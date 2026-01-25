import { getContext } from "@/lib/context";
import prisma from "@/lib/prisma";
import { CompanyRole, PRStatus } from "@/app/generated/prisma/client";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const context = await getContext();
  if (!context?.companyId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }
  const { id } = await params;

  // RBAC: Manager or Admin
  const allowed: CompanyRole[] = [CompanyRole.ADMIN, CompanyRole.MANAGER];
  if (!context.role || !allowed.includes(context.role as CompanyRole)) {
    return new NextResponse("Forbidden", { status: 403 });
  }

  try {
    const pr = await prisma.purchaseRequest.findUnique({
      where: { id, companyId: context.companyId },
    });

    if (!pr) return new NextResponse("Not Found", { status: 404 });

    // Prevent self-approval
    if (pr.createdById === context.profileId) {
      return new NextResponse("You cannot approve your own request", {
        status: 403,
      });
    }

    // Allow approval from SUBMITTED or UNDER_REVIEW
    if (
      !([PRStatus.SUBMITTED, PRStatus.UNDER_REVIEW] as PRStatus[]).includes(
        pr.status,
      )
    ) {
      return new NextResponse("PR is not in a reviewable state", {
        status: 400,
      });
    }

    const updated = await prisma.purchaseRequest.update({
      where: { id },
      data: { status: PRStatus.APPROVED },
    });

    // We also want to create an "Approval" record if we strictly followed schema,
    // but the Phase 4 instructions emphasize the Status Lifecycle.
    // The schema has `approvals Approval[]`. It's good practice to add one.
    await prisma.approval.create({
      data: {
        purchaseRequestId: id,
        approverId: context.profileId!,
        status: "APPROVED",
        approvedAt: new Date(),
        comment: "Auto-generated via simple approval",
      },
    });

    await prisma.auditLog.create({
      data: {
        companyId: context.companyId,
        userId: context.profileId!,
        action: "APPROVE_PR",
        entity: "PurchaseRequest",
        entityId: updated.id,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("[PR_APPROVE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
