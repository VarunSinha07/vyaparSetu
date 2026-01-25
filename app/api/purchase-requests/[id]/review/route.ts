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
  const allowed = [CompanyRole.ADMIN, CompanyRole.MANAGER] as CompanyRole[];
  if (!context.role || !allowed.includes(context.role as CompanyRole)) {
    return new NextResponse("Forbidden", { status: 403 });
  }

  try {
    const pr = await prisma.purchaseRequest.findUnique({
      where: { id, companyId: context.companyId },
    });

    if (!pr) return new NextResponse("Not Found", { status: 404 });

    if (pr.status !== PRStatus.SUBMITTED) {
      return new NextResponse("Only SUBMITTED PRs can be reviewed", {
        status: 400,
      });
    }

    const updated = await prisma.purchaseRequest.update({
      where: { id },
      data: { status: PRStatus.UNDER_REVIEW },
    });

    await prisma.auditLog.create({
      data: {
        companyId: context.companyId,
        userId: context.profileId!,
        action: "REVIEW_PR",
        entity: "PurchaseRequest",
        entityId: updated.id,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("[PR_REVIEW]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
