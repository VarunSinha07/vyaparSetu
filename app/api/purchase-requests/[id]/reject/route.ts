import { getContext } from "@/lib/context";
import prisma from "@/lib/prisma";
import { CompanyRole, PRStatus } from "@/app/generated/prisma/client";
import { NextResponse } from "next/server";
import { z } from "zod";

const rejectSchema = z.object({
  reason: z.string().min(5, "Rejection reason is required"),
});

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const context = await getContext();
  if (!context?.companyId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }
  const { id } = await params;

  const allowed: CompanyRole[] = [CompanyRole.ADMIN, CompanyRole.MANAGER];
  if (!context.role || !allowed.includes(context.role as CompanyRole)) {
    return new NextResponse("Forbidden", { status: 403 });
  }

  try {
    const body = await req.json();
    const { reason } = rejectSchema.parse(body);

    const pr = await prisma.purchaseRequest.findUnique({
      where: { id, companyId: context.companyId },
    });

    if (!pr) return new NextResponse("Not Found", { status: 404 });

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
      data: {
        status: PRStatus.REJECTED,
        rejectionReason: reason,
      },
    });

    await prisma.approval.create({
      data: {
        purchaseRequestId: id,
        approverId: context.profileId!,
        status: "REJECTED",
        comment: reason,
      },
    });

    await prisma.auditLog.create({
      data: {
        companyId: context.companyId,
        userId: context.profileId!,
        action: "REJECT_PR",
        entity: "PurchaseRequest",
        entityId: updated.id,
        metadata: { reason },
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new NextResponse(error.issues[0].message, { status: 400 });
    }
    console.error("[PR_REJECT]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
