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

  // RBAC: Admin or Procurement
  const allowed = [CompanyRole.ADMIN, CompanyRole.PROCUREMENT] as CompanyRole[];
  if (!context.role || !allowed.includes(context.role as CompanyRole)) {
    return new NextResponse("Forbidden", { status: 403 });
  }

  try {
    const pr = await prisma.purchaseRequest.findUnique({
      where: { id, companyId: context.companyId },
    });

    if (!pr) return new NextResponse("Not Found", { status: 404 });

    if (pr.status !== PRStatus.DRAFT) {
      return new NextResponse("Only DRAFT PRs can be submitted", {
        status: 400,
      });
    }

    const updated = await prisma.purchaseRequest.update({
      where: { id },
      data: { status: PRStatus.SUBMITTED },
    });

    await prisma.auditLog.create({
      data: {
        companyId: context.companyId,
        userId: context.profileId!,
        action: "SUBMIT_PR",
        entity: "PurchaseRequest",
        entityId: updated.id,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("[PR_SUBMIT]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
