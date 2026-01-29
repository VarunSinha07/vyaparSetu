import { getContext } from "@/lib/context";
import prisma from "@/lib/prisma";
import {
  CompanyRole,
  POStatus,
  Prisma,
  InvoiceStatus,
} from "@/app/generated/prisma/client";
import { NextResponse } from "next/server";
import { z } from "zod";

const createInvoiceSchema = z.object({
  purchaseOrderId: z.string(),
  invoiceNumber: z.string(),
  invoiceDate: z.string().transform((str) => new Date(str)),
  fileUrl: z.string().url(),
  vendorId: z.string(),
  subtotal: z.number().min(0),
  cgst: z.number().min(0).optional(),
  sgst: z.number().min(0).optional(),
  igst: z.number().min(0).optional(),
  totalAmount: z.number().min(0),
});

export async function GET(request: Request) {
  const context = await getContext();
  if (!context || !context.companyId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");
  const vendorId = searchParams.get("vendorId");

  const whereCondition: Prisma.InvoiceWhereInput = {
    companyId: context.companyId,
  };

  if (status) {
    whereCondition.status = status as InvoiceStatus;
  }

  if (vendorId) {
    whereCondition.vendorId = vendorId;
  }

  try {
    const invoices = await prisma.invoice.findMany({
      where: whereCondition,
      include: {
        vendor: {
          select: { name: true },
        },
        purchaseOrder: {
          select: { poNumber: true, totalAmount: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(invoices);
  } catch (error) {
    console.error("Error fetching invoices:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function POST(request: Request) {
  const context = await getContext();
  if (!context || !context.companyId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { role, profileId, companyId } = context;

  // RBAC: Only ADMIN can upload
  if (role !== CompanyRole.ADMIN) {
    return new NextResponse("Forbidden: Only Admin can upload invoices", {
      status: 403,
    });
  }

  try {
    const body = await request.json();
    const validatedData = createInvoiceSchema.parse(body);

    // 1. Verify PO
    const po = await prisma.purchaseOrder.findUnique({
      where: { id: validatedData.purchaseOrderId },
      include: { invoice: true },
    });

    if (!po) {
      return new NextResponse("Purchase Order not found", { status: 404 });
    }

    if (po.companyId !== companyId) {
      return new NextResponse("Unauthorized PO access", { status: 403 });
    }

    // 2. Preconditions
    if (po.status !== POStatus.ISSUED) {
      return new NextResponse("PO is not in ISSUED state", { status: 400 });
    }

    if (po.invoice) {
      return new NextResponse("An invoice already exists for this PO", {
        status: 400,
      });
    }

    // Validate GST Logic: Either (CGST/SGST) OR IGST, not both
    const hasCGST_SGST =
      (validatedData.cgst || 0) > 0 || (validatedData.sgst || 0) > 0;
    const hasIGST = (validatedData.igst || 0) > 0;

    if (hasCGST_SGST && hasIGST) {
      return new NextResponse("Enter either CGST & SGST or IGST, not both.", {
        status: 400,
      });
    }

    // Validate Invoice Amount <= PO Amount (Requirement Step 3)
    if (validatedData.totalAmount > po.totalAmount) {
      // Wait, sometimes invoice might differ slightly due to rounding or shipping?
      // "Backend must enforce: Invoice amount <= PO amount"
      // Strict check as per instructions.
      return new NextResponse("Invoice amount cannot exceed PO amount", {
        status: 400,
      });
    }

    // 3. Create Invoice
    const invoice = await prisma.invoice.create({
      data: {
        companyId,
        purchaseOrderId: validatedData.purchaseOrderId,
        vendorId: validatedData.vendorId, // Should match PO vendor ideally?
        uploadedById: profileId,
        invoiceNumber: validatedData.invoiceNumber,
        invoiceDate: validatedData.invoiceDate,
        fileUrl: validatedData.fileUrl,
        subtotal: validatedData.subtotal,
        cgst: validatedData.cgst,
        sgst: validatedData.sgst,
        igst: validatedData.igst,
        totalAmount: validatedData.totalAmount,
        status: "UPLOADED",
      },
    });

    // 4. Audit Log
    await prisma.auditLog.create({
      data: {
        companyId,
        userId: profileId,
        action: "INVOICE_UPLOADED",
        entity: "Invoice",
        entityId: invoice.id,
        metadata: {
          poId: po.id,
          poNumber: po.poNumber,
          invoiceNumber: invoice.invoiceNumber,
        },
      },
    });

    return NextResponse.json(invoice);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new NextResponse(JSON.stringify(error.issues), { status: 400 });
    }
    console.error("Error creating invoice:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
