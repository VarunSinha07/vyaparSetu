import { getContext } from "@/lib/context";
import prisma from "@/lib/prisma";
import { CompanyRole } from "@/app/generated/prisma/client";
import { NextResponse } from "next/server";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const context = await getContext();
  if (!context || !context.companyId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { role, profileId, companyId } = context;
  const { id } = await params;

  // RBAC: Only FINANCE can verify
  if (role !== CompanyRole.FINANCE) {
    return new NextResponse("Forbidden: Only Finance can verify invoices", { status: 403 });
  }

  try {
    const invoice = await prisma.invoice.findUnique({
      where: { id },
    });

    if (!invoice || invoice.companyId !== companyId) {
      return new NextResponse("Invoice not found", { status: 404 });
    }

    if (invoice.status === "VERIFIED") {
        return new NextResponse("Invoice is already verified", { status: 400 });
    }

    // Update status
    const updatedInvoice = await prisma.invoice.update({
      where: { id },
      data: {
        status: "VERIFIED",
        verifiedById: profileId,
        verifiedAt: new Date(),
      },
    });

    // Audit Log
    await prisma.auditLog.create({
      data: {
        companyId,
        userId: profileId,
        action: "INVOICE_VERIFIED",
        entity: "Invoice",
        entityId: invoice.id,
      },
    });

    return NextResponse.json(updatedInvoice);

  } catch (error) {
    console.error("Error verifying invoice:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
