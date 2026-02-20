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
    // First, check if the Invoice exists and belongs to this company
    const invoice = await prisma.invoice.findUnique({
      where: {
        id,
        companyId: context.companyId,
      },
    });

    if (!invoice) {
      return new NextResponse("Invoice not found", { status: 404 });
    }

    // Role-based visibility: All roles can view invoice timeline
    // Admin, Finance - Full access
    // Procurement, Manager - View only

    // Fetch audit logs for this Invoice
    const auditLogs = await prisma.auditLog.findMany({
      where: {
        companyId: context.companyId,
        entity: "Invoice",
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
    console.error("[INVOICE_TIMELINE_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
