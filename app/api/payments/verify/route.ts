import { processPaymentSuccess } from "@/lib/payment-service";
import crypto from "crypto";
import { NextResponse } from "next/server";
import { z } from "zod";

const verifySchema = z.object({
  orderCreationId: z.string(),
  razorpayPaymentId: z.string(),
  razorpaySignature: z.string(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { orderCreationId, razorpayPaymentId, razorpaySignature } =
      verifySchema.parse(body);

    const secret = process.env.RAZORPAY_ID;
    if (!secret)
      return new NextResponse("Server Config Error", { status: 500 });

    // In Client-side Verify, the signature is generated using a different method than the webhook
    // order_id + "|" + razorpay_payment_id
    // Signed with KEY_SECRET (not Webhook Secret)
    // Wait, let's verify which key is used in frontend. usually it's Key Secret.

    // IMPORTANT: Frontend usually sends signature generated with key_secret.
    // Webhook uses webhook_secret.
    const keySecret = process.env.RAZORPAY_SECRET;

    if (!keySecret) {
      return new NextResponse("Configuration Error", { status: 500 });
    }

    const generatedSignature = crypto
      .createHmac("sha256", keySecret)
      .update(orderCreationId + "|" + razorpayPaymentId)
      .digest("hex");

    if (generatedSignature !== razorpaySignature) {
      return new NextResponse("Invalid Signature", { status: 400 });
    }

    // Process Payment
    await processPaymentSuccess(
      orderCreationId, // orderId
      razorpayPaymentId,
      razorpaySignature,
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[PAYMENT_VERIFY]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
