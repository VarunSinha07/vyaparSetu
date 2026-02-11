import { getContext } from "@/lib/context";
import prisma from "@/lib/prisma";
import { CompanyRole, POStatus } from "@/app/generated/prisma/client";
import { NextResponse } from "next/server";
import { sendEmail } from "@/lib/email";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const context = await getContext();
  if (!context?.companyId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }
  const { id } = await params;

  // RBAC: Admin Only
  if (context.role !== CompanyRole.ADMIN) {
    return new NextResponse("Forbidden: Only Admins can issue POs", {
      status: 403,
    });
  }

  try {
    const po = await prisma.purchaseOrder.findUnique({
      where: { id, companyId: context.companyId },
      include: {
        vendor: true,
      },
    });

    if (!po) return new NextResponse("Not Found", { status: 404 });

    if (po.status !== POStatus.DRAFT) {
      return new NextResponse("Only DRAFT POs can be issued", { status: 400 });
    }

    const updated = await prisma.purchaseOrder.update({
      where: { id },
      data: {
        status: POStatus.ISSUED,
        issuedById: context.profileId!,
        issuedAt: new Date(),
      },
    });

    // Send Email to Vendor (Mock/Real)
    if (po.vendor.email) {
      await sendEmail({
        to: po.vendor.email,
        subject: `Purchase Order ${po.poNumber} from ${context.user?.name || "VyaparSetu"}`,
        text: `Dear ${po.vendor.name},\n\nPlease find attached Purchase Order ${po.poNumber} for the amount of ${po.totalAmount}.\n\nTerms: ${po.paymentTerms}\n\nNotes: ${po.notes || "None"}`,
        html: `<div style="font-family: sans-serif;">
                <h2>Purchase Order Issued</h2>
                <p>Dear ${po.vendor.name},</p>
                <p>A new Purchase Order has been issued.</p>
                <ul>
                    <li><strong>PO Number:</strong> ${po.poNumber}</li>
                    <li><strong>Amount:</strong> ₹${po.totalAmount}</li>
                    <li><strong>Payment Terms:</strong> ${po.paymentTerms}</li>
                </ul>
                <p><em>${po.notes || ""}</em></p>
            </div>`,
      });
    }

    // Audit
    await prisma.auditLog.create({
      data: {
        companyId: context.companyId,
        userId: context.profileId!,
        action: "ISSUE_PO",
        entity: "PurchaseOrder",
        entityId: po.id,
        metadata: { poNumber: po.poNumber },
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("[PO_ISSUE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
