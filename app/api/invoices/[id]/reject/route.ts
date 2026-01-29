import { getContext } from "@/lib/context";
import prisma from "@/lib/prisma";
import { CompanyRole } from "@/app/generated/prisma/client";
import { NextResponse } from "next/server";
import { z } from "zod";

const rejectSchema = z.object({
  reason: z.string().min(1, "Reason is required"),
});

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const context = await getContext();
  if (!context || !context.companyId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { role, profileId, companyId } = context;
  const { id } = await params;

  // RBAC: Only FINANCE
  if (role !== CompanyRole.FINANCE) {
    return new NextResponse("Forbidden: Only Finance can reject invoices", {
      status: 403,
    });
  }

  try {
    const body = await request.json();
    const { reason } = rejectSchema.parse(body);

    const invoice = await prisma.invoice.findUnique({
      where: { id },
    });

    if (!invoice || invoice.companyId !== companyId) {
      return new NextResponse("Invoice not found", { status: 404 });
    }

    if (invoice.status === "VERIFIED") {
      return new NextResponse("Cannot reject verified invoice", {
        status: 400,
      });
    }

    // Update status
    const updatedInvoice = await prisma.invoice.update({
      where: { id },
      data: {
        status: "REJECTED",
        comments: reason, // Storing reason
        verifiedById: profileId,
        verifiedAt: new Date(),
      },
    });

    // Audit Log
    await prisma.auditLog.create({
      data: {
        companyId,
        userId: profileId,
        action: "INVOICE_REJECTED",
        entity: "Invoice",
        entityId: invoice.id,
        metadata: { reason },
      },
    });

    return NextResponse.json(updatedInvoice);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new NextResponse(JSON.stringify(error.issues), { status: 400 });
    }
    console.error("Error rejecting invoice:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
