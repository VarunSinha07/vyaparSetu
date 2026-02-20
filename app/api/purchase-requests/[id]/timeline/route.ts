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
    // First, check if the PR exists and belongs to this company
    const pr = await prisma.purchaseRequest.findUnique({
      where: {
        id,
        companyId: context.companyId,
      },
      select: {
        status: true,
      },
    });

    if (!pr) {
      return new NextResponse("Purchase Request not found", { status: 404 });
    }

    // Role-based visibility
    // Finance can only view timeline after approval
    if (
      context.role === CompanyRole.FINANCE &&
      pr.status !== PRStatus.APPROVED
    ) {
      return new NextResponse(
        "Finance can only view timeline for approved PRs",
        { status: 403 },
      );
    }

    // Fetch audit logs for this PR
    const auditLogs = await prisma.auditLog.findMany({
      where: {
        companyId: context.companyId,
        entity: "PurchaseRequest",
        entityId: id,
      },
      include: {
        user: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    // Format timeline events
    const timeline = auditLogs.map((log) => ({
      id: log.id,
      action: log.action,
      actor: log.user.name || "Unknown User",
      timestamp: log.createdAt,
      metadata: log.metadata,
    }));

    return NextResponse.json(timeline);
  } catch (error) {
    console.error("[PR_TIMELINE_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
