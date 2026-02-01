import { processPaymentSuccess } from "@/lib/payment-service";
import prisma from "@/lib/prisma";
import { PaymentStatus } from "@/app/generated/prisma/client";
import { NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const bodyText = await req.text();
    const signature = req.headers.get("x-razorpay-signature");

    // In a real app, use a dedicated webhook secret.
    // For this MVP, if not set, we might fallback or fail.
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;

    if (!secret) {
      console.error("RAZORPAY_WEBHOOK_SECRET is not set");
      return new NextResponse("Configuration Error", { status: 500 });
    }

    if (!signature) {
      return new NextResponse("Missing Signature", { status: 400 });
    }

    // Verify Signature
    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(bodyText)
      .digest("hex");

    if (expectedSignature !== signature) {
      return new NextResponse("Invalid Signature", { status: 400 });
    }

    const payload = JSON.parse(bodyText);
    const { event, payload: data } = payload;

    if (event === "payment.captured") {
      const paymentEntity = data.payment.entity;
      const orderId = paymentEntity.order_id;
      const paymentId = paymentEntity.id;

      try {
        await processPaymentSuccess(orderId, paymentId, signature);
      } catch (err: unknown) {
        if (err instanceof Error && err.message.includes("not found")) {
          return new NextResponse("Record not found", { status: 404 });
        }
        throw err;
      }
    } else if (event === "payment.failed") {
      const paymentEntity = data.payment.entity;
      const orderId = paymentEntity.order_id;

      await prisma.payment.updateMany({
        where: { razorpayOrderId: orderId },
        data: { status: PaymentStatus.FAILED },
      });
    }

    return new NextResponse("OK", { status: 200 });
  } catch (error) {
    console.error("[WEBHOOK_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
