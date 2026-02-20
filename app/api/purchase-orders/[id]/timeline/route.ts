import { getContext } from "@/lib/context";
import prisma from "@/lib/prisma";
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
    // First, check if the PO exists and belongs to this company
    const po = await prisma.purchaseOrder.findUnique({
      where: {
        id,
        companyId: context.companyId,
      },
    });

    if (!po) {
      return new NextResponse("Purchase Order not found", { status: 404 });
    }

    // Role-based visibility: All roles can view PO timeline
    // Admin, Procurement, Finance - Full access
    // Manager - View only

    // Fetch audit logs for this PO
    const auditLogs = await prisma.auditLog.findMany({
      where: {
        companyId: context.companyId,
        entity: "PurchaseOrder",
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
    console.error("[PO_TIMELINE_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
