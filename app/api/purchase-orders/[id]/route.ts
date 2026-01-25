import { getContext } from "@/lib/context";
import prisma from "@/lib/prisma";
import { CompanyRole, POStatus } from "@/app/generated/prisma/client";
import { NextResponse } from "next/server";
import { z } from "zod";

const updatePOSchema = z.object({
  paymentTerms: z.string().optional(),
  notes: z.string().optional(),
});

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const context = await getContext();
  if (!context?.companyId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }
  const { id } = await params;

  try {
    const po = await prisma.purchaseOrder.findUnique({
      where: { id, companyId: context.companyId },
      include: {
        vendor: true,
        company: {
          select: {
            name: true,
            address: true,
            email: true,
            phone: true,
          },
        },
        createdBy: { select: { name: true } },
        issuedBy: { select: { name: true } },
        purchaseRequest: {
          select: {
            id: true,
            title: true,
            description: true,
            department: true,
          },
        },
      },
    });

    if (!po) return new NextResponse("Not Found", { status: 404 });

    return NextResponse.json(po);
  } catch (error) {
    console.error("[PO_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const context = await getContext();
  if (!context?.companyId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }
  const { id } = await params;

  // RBAC: Admin or Procurement
  const allowed: CompanyRole[] = [CompanyRole.ADMIN, CompanyRole.PROCUREMENT];
  if (!context.role || !allowed.includes(context.role as CompanyRole)) {
    return new NextResponse("Forbidden", { status: 403 });
  }

  try {
    const body = await req.json();
    const { paymentTerms, notes } = updatePOSchema.parse(body);

    const po = await prisma.purchaseOrder.findUnique({
      where: { id, companyId: context.companyId },
    });

    if (!po) return new NextResponse("Not Found", { status: 404 });

    // Status Check
    if (po.status !== POStatus.DRAFT) {
      return new NextResponse("Only DRAFT POs can be edited", { status: 400 });
    }

    const updated = await prisma.purchaseOrder.update({
      where: { id },
      data: {
        paymentTerms,
        notes,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("[PO_UPDATE]", error);
    if (error instanceof z.ZodError) {
      return new NextResponse(error.issues[0].message, { status: 400 });
    }
    return new NextResponse("Internal Error", { status: 500 });
  }
}
