import { getContext } from "@/lib/context";
import prisma from "@/lib/prisma";
import { CompanyRole, PRStatus, POStatus } from "@/app/generated/prisma/client";
import { NextResponse } from "next/server";
import { z } from "zod";
import { format } from "date-fns";

const createPOSchema = z.object({
  purchaseRequestId: z.string().uuid(),
  notes: z.string().optional(),
  paymentTerms: z.string().optional(),
});

function generatePONumber() {
  const date = format(new Date(), "yyyyMMdd");
  const random = Math.floor(1000 + Math.random() * 9000);
  return `PO-${date}-${random}`;
}

export async function POST(req: Request) {
  const context = await getContext();
  if (!context?.companyId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  // RBAC: Admin or Procurement
  const allowed: CompanyRole[] = [CompanyRole.ADMIN, CompanyRole.PROCUREMENT];
  if (!context.role || !allowed.includes(context.role as CompanyRole)) {
    return new NextResponse("Forbidden", { status: 403 });
  }

  try {
    const body = await req.json();
    const { purchaseRequestId, notes, paymentTerms } =
      createPOSchema.parse(body);

    // 1. Fetch PR
    const pr = await prisma.purchaseRequest.findUnique({
      where: { id: purchaseRequestId, companyId: context.companyId },
      include: {
        preferredVendor: true,
        purchaseOrder: true,
      },
    });

    if (!pr) return new NextResponse("PR Not Found", { status: 404 });

    // 2. Validate PR Status
    if (pr.status !== PRStatus.APPROVED) {
      return new NextResponse("PR must be APPROVED to create a PO", {
        status: 400,
      });
    }

    // 3. Validate Duplicate PO
    if (pr.purchaseOrder) {
      return new NextResponse("A PO already exists for this PR", {
        status: 409,
      });
    }

    // 4. Validate Vendor (PR should have one if approved usually, but good to check)
    if (!pr.preferredVendorId) {
      return new NextResponse("PR does not have a selected vendor", {
        status: 400,
      });
    }

    // 5. Create PO
    const po = await prisma.purchaseOrder.create({
      data: {
        companyId: context.companyId,
        purchaseRequestId: pr.id,
        vendorId: pr.preferredVendorId,
        createdById: context.profileId!,
        poNumber: generatePONumber(),
        totalAmount: pr.estimatedCost, // In real world, this might differ
        paymentTerms: paymentTerms || "30 Days",
        notes,
        status: POStatus.DRAFT,
      },
    });

    // Audit
    await prisma.auditLog.create({
      data: {
        companyId: context.companyId,
        userId: context.profileId!,
        action: "CREATE_PO",
        entity: "PurchaseOrder",
        entityId: po.id,
        metadata: { poNumber: po.poNumber },
      },
    });

    return NextResponse.json(po);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new NextResponse(error.issues[0].message, { status: 400 });
    }
    console.error("[PO_CREATE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function GET(request: Request) {
  const context = await getContext();
  if (!context?.companyId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const statusParam = searchParams.get("status");

  // All roles can view

  try {
    const filters: any = { companyId: context.companyId };
    if (statusParam) {
      filters.status = statusParam;
    }

    const pos = await prisma.purchaseOrder.findMany({
      where: filters,
      include: {
        vendor: { select: { name: true } },
        createdBy: { select: { name: true } },
        invoice: { select: { id: true, status: true } }, // Include invoice info
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(pos);
  } catch (error) {
    console.error("[PO_LIST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
