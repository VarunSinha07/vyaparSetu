import { getContext } from "@/lib/context";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const context = await getContext();
  if (!context || !context.companyId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { id } = await params;
  const { companyId } = context;

  try {
    const invoice = await prisma.invoice.findUnique({
      where: { id },
      include: {
        vendor: true,
        purchaseOrder: {
          include: {
            // Determine what PO details are needed for comparison
            vendor: true,
          },
        },
        uploadedBy: {
          select: { name: true },
        },
        verifiedBy: {
          select: { name: true },
        },
        payments: {
          where: { status: "SUCCESS" },
          select: { paidAt: true, id: true, razorpayPaymentId: true },
        },
      },
    });

    if (!invoice) {
      return new NextResponse("Invoice not found", { status: 404 });
    }

    if (invoice.companyId !== companyId) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    return NextResponse.json(invoice);
  } catch (error) {
    console.error("Error fetching invoice details:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
