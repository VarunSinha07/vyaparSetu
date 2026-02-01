import { getContext } from "@/lib/context";
import prisma from "@/lib/prisma";
import {
  CompanyRole,
  InvoiceStatus,
  PaymentStatus,
} from "@/app/generated/prisma/client";
import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import { z } from "zod";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_ID!,
  key_secret: process.env.RAZORPAY_SECRET!,
});

const createOrderSchema = z.object({
  invoiceId: z.string().uuid(),
});

export async function POST(req: Request) {
  const context = await getContext();
  if (!context?.companyId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  // 1. RBAC: Only Finance
  if (context.role !== CompanyRole.FINANCE) {
    return new NextResponse("Forbidden: Only Finance can initiate payments", {
      status: 403,
    });
  }

  try {
    const body = await req.json();
    const { invoiceId } = createOrderSchema.parse(body);

    // 2. Fetch Invoice & Validate
    const invoice = await prisma.invoice.findUnique({
      where: { id: invoiceId, companyId: context.companyId },
      include: {
        purchaseOrder: { select: { status: true } },
        payments: {
          where: { status: PaymentStatus.SUCCESS },
        },
      },
    });

    if (!invoice) {
      return new NextResponse("Invoice not found", { status: 404 });
    }

    // "Invoice status = VERIFIED"
    if (invoice.status !== InvoiceStatus.VERIFIED) {
      return new NextResponse("Invoice must be VERIFIED to initiate payment", {
        status: 400,
      });
    }

    // "PO status = ISSUED"
    if (invoice.purchaseOrder.status !== "ISSUED") {
      return new NextResponse("Linked PO is not ISSUED", { status: 400 });
    }

    // "Payment not already completed"
    if (invoice.payments.length > 0) {
      return new NextResponse("Invoice is already paid", { status: 400 });
    }

    const amountInPaise = Math.round(invoice.totalAmount * 100);
    console.log(
      `[CREATE_ORDER] Invoice: ${invoice.id}, Amount: ${invoice.totalAmount}, Paise: ${amountInPaise}`,
    );

    const receiptId = `inv_${invoice.invoiceNumber}`.substring(0, 40);

    const order = await razorpay.orders.create({
      amount: amountInPaise,
      currency: "INR",
      receipt: receiptId,
      notes: {
        invoiceId: invoice.id,
        companyId: context.companyId,
      },
    });

    // 4. Create Payment Record (INITIATED)
    const payment = await prisma.payment.create({
      data: {
        companyId: context.companyId,
        invoiceId: invoice.id,
        initiatedById: context.profileId,
        amount: invoice.totalAmount,
        status: PaymentStatus.INITIATED,
        razorpayOrderId: order.id,
      },
    });

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      key: process.env.RAZORPAY_ID,
      paymentId: payment.id,
    });
  } catch (error: unknown) {
    console.error("[CREATE_PAYMENT_ORDER]", error);
    if (error instanceof z.ZodError) {
      return new NextResponse("Invalid ID", { status: 400 });
    }

    // Handle Razorpay specific errors
    const razorpayError = error as {
      statusCode?: number;
      error?: { description?: string };
    };
    if (razorpayError?.statusCode === 400 && razorpayError.error?.description) {
      return new NextResponse(razorpayError.error.description, { status: 400 });
    }

    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
