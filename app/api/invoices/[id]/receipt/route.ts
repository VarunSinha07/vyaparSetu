import { getContext } from "@/lib/context";
import prisma from "@/lib/prisma";
import { CompanyRole, PaymentStatus } from "@/app/generated/prisma/client";
import { NextResponse } from "next/server";
import { generateReceiptPDF } from "@/lib/receipt-generator";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const context = await getContext();
  if (!context?.companyId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { id } = await params;

  // 1. RBAC Check (Finance or Admin only)
  if (
    context.role !== CompanyRole.FINANCE &&
    context.role !== CompanyRole.ADMIN
  ) {
    return new NextResponse("Forbidden", { status: 403 });
  }

  // 2. Fetch Payment details via Invoice ID
  // We assume 1 active successful payment per invoice for now
  const invoice = await prisma.invoice.findUnique({
    where: { id: id, companyId: context.companyId },
    include: {
      payments: {
        where: { status: PaymentStatus.SUCCESS },
        take: 1,
      },
      vendor: true,
    },
  });

  if (!invoice || invoice.payments.length === 0) {
    return new NextResponse("Receipt not found", { status: 404 });
  }

  const payment = invoice.payments[0];

  try {
    const pdfBuffer = await generateReceiptPDF({
      paymentId: payment.razorpayPaymentId || payment.id,
      paymentDate: payment.paidAt || new Date(),
      invoiceNumber: invoice.invoiceNumber,
      amount: payment.amount,
      vendorName: invoice.vendor.name,
      vendorEmail: invoice.vendor.email || "",
      vendorGst: invoice.vendor.gstin || undefined,
    });

    const { searchParams } = new URL(req.url);
    const isDownload = searchParams.get("download") === "true";

    // Inline = View in browser, Attachment = Download
    const disposition = isDownload ? "attachment" : "inline";

    return new NextResponse(pdfBuffer as unknown as BodyInit, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `${disposition}; filename="Receipt-${invoice.invoiceNumber}.pdf"`,
      },
    });
  } catch (error) {
    console.error("[RECEIPT_GEN]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
