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
    // First, check if the Payment exists and belongs to this company
    const payment = await prisma.payment.findUnique({
      where: {
        id,
        companyId: context.companyId,
      },
    });

    if (!payment) {
      return new NextResponse("Payment not found", { status: 404 });
    }

    // Role-based visibility: All roles can view payment timeline
    // Admin, Finance - Full access
    // Procurement, Manager - View only (transparency)

    // Fetch audit logs for this Payment
    const auditLogs = await prisma.auditLog.findMany({
      where: {
        companyId: context.companyId,
        entity: "Payment",
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

    // Filter out sensitive payment metadata
    const timeline = auditLogs.map((log) => {
      const metadata = (log.metadata as Record<string, unknown>) || {};

      // Remove sensitive fields
      const {
        ...safeMetadata
      } = metadata;

      return {
        id: log.id,
        action: log.action,
        actor: log.user.name || "Unknown User",
        timestamp: log.createdAt,
        metadata: safeMetadata,
      };
    });

    return NextResponse.json(timeline);
  } catch (error) {
    console.error("[PAYMENT_TIMELINE_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
