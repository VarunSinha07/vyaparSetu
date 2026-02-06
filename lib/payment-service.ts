import prisma from "@/lib/prisma";
import {
  InvoiceStatus,
  PaymentStatus,
  CompanyRole,
} from "@/app/generated/prisma/client";
import { logAudit } from "@/lib/audit";
import { sendEmail } from "@/lib/email";
import { generateReceiptPDF } from "@/lib/receipt-generator";
import { generatePaymentSuccessEmail } from "@/lib/email-templates";

export async function processPaymentSuccess(
  orderId: string,
  paymentId: string,
  signature: string,
) {
  // Find associated payment record
  const payment = await prisma.payment.findFirst({
    where: { razorpayOrderId: orderId },
  });

  if (!payment) {
    throw new Error(`Payment record not found for order ${orderId}`);
  }

  if (payment.status === PaymentStatus.SUCCESS) {
    return { status: "ALREADY_PROCESSED" };
  }

  // Transaction updates
  await prisma.$transaction(async (tx) => {
    // 1. Update Payment
    await tx.payment.update({
      where: { id: payment.id },
      data: {
        status: PaymentStatus.SUCCESS,
        razorpayPaymentId: paymentId,
        razorpaySignature: signature,
        paidAt: new Date(),
      },
    });

    // 2. Update Invoice to PAID
    await tx.invoice.update({
      where: { id: payment.invoiceId },
      data: {
        status: InvoiceStatus.PAID,
      },
    });
  });

  // 3. Audit Log
  await logAudit({
    companyId: payment.companyId,
    userId: payment.initiatedById,
    action: "PAYMENT_SUCCESS",
    entity: "Payment",
    entityId: payment.id,
    metadata: {
      amount: payment.amount,
      rzpPayment: paymentId,
    },
  });

  // 4. Send Email
  try {
    const fullPayment = await prisma.payment.findUnique({
      where: { id: payment.id },
      include: {
        invoice: {
          include: { vendor: true },
        },
      },
    });

    if (fullPayment && fullPayment.invoice.vendor.email) {
      // Get Admin & Finance Users for CC
      const staff = await prisma.companyMember.findMany({
        where: {
          companyId: payment.companyId,
          role: { in: [CompanyRole.ADMIN, CompanyRole.FINANCE] },
          isActive: true,
        },
      });

      const userIds = staff.map((s) => s.userId);
      const users = await prisma.user.findMany({
        where: { id: { in: userIds } },
        select: { email: true },
      });

      const ccEmails = users
        .map((u) => u.email)
        .filter((e): e is string => !!e);

      // Generate Receipt PDF
      const pdfBuffer = await generateReceiptPDF({
        paymentId: paymentId,
        paymentDate: new Date(),
        invoiceNumber: fullPayment.invoice.invoiceNumber,
        amount: fullPayment.amount,
        vendorName: fullPayment.invoice.vendor.name,
        vendorEmail: fullPayment.invoice.vendor.email,
        vendorGst: fullPayment.invoice.vendor.gstin || undefined,
      });

      // Generate HTML Email
      const emailHtml = generatePaymentSuccessEmail({
        vendorName: fullPayment.invoice.vendor.name,
        amount: fullPayment.amount,
        invoiceNumber: fullPayment.invoice.invoiceNumber,
        paymentDate: new Date().toLocaleDateString(),
        transactionId: paymentId,
      });

      await sendEmail({
        to: fullPayment.invoice.vendor.email,
        cc: ccEmails,
        subject: `Payment Receipt: Invoice #${fullPayment.invoice.invoiceNumber}`,
        text: `Payment Successful for Invoice #${fullPayment.invoice.invoiceNumber}`, // Fallback
        html: emailHtml,
        attachments: [
          {
            filename: `Receipt-${fullPayment.invoice.invoiceNumber}.pdf`,
            content: pdfBuffer,
            contentType: "application/pdf",
          },
        ],
      });
      
      console.log(
        `[EMAIL] Receipt sent to ${fullPayment.invoice.vendor.email} (CC: ${ccEmails.join(", ")})`,
      );
    }
  } catch (err) {
    console.error("[EMAIL_ERROR]", err);
    // Don't throw, just log. Payment is successful.
  }

  return { status: "SUCCESS" };
}
