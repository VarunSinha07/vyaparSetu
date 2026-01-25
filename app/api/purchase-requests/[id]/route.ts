import { getContext } from "@/lib/context";
import prisma from "@/lib/prisma";
import { CompanyRole, PRStatus } from "@/app/generated/prisma/client";
import { NextResponse } from "next/server";

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
    const pr = await prisma.purchaseRequest.findUnique({
      where: {
        id,
        companyId: context.companyId,
      },
      include: {
        createdBy: true,
        preferredVendor: true,
        approvals: {
          include: {
            approver: true,
          },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!pr) return new NextResponse("Not Found", { status: 404 });

    return NextResponse.json(pr);
  } catch (error) {
    console.error("[PR_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const context = await getContext();
  if (!context?.companyId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }
  const { id } = await params;

  try {
    const existingPR = await prisma.purchaseRequest.findUnique({
      where: { id, companyId: context.companyId },
    });

    if (!existingPR) return new NextResponse("Not Found", { status: 404 });

    // Rule: Must be DRAFT
    if (existingPR.status !== PRStatus.DRAFT) {
      return new NextResponse("Cannot edit PR that is not in DRAFT status", {
        status: 400,
      });
    }

    // Rule: Creator or Admin only
    const isCreator = existingPR.createdById === context.profileId;
    const isAdmin = context.role === CompanyRole.ADMIN;

    if (!isCreator && !isAdmin) {
      return new NextResponse(
        "Forbidden: Only Creator or Admin can edit this draft",
        { status: 403 },
      );
    }

    const body = await req.json();
    // Whitelist allowed fields for update
    const {
      title,
      description,
      department,
      estimatedCost,
      preferredVendorId,
      priority,
      budgetCategory,
      requiredBy,
    } = body;

    const updated = await prisma.purchaseRequest.update({
      where: { id },
      data: {
        title,
        description,
        department,
        estimatedCost,
        preferredVendorId,
        priority,
        budgetCategory,
        requiredBy: requiredBy ? new Date(requiredBy) : undefined,
      },
    });

    // Audit
    await prisma.auditLog.create({
      data: {
        companyId: context.companyId,
        userId: context.profileId!,
        action: "UPDATE_PR",
        entity: "PurchaseRequest",
        entityId: updated.id,
        metadata: { status: "DRAFT", changes: body },
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("[PR_UPDATE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
