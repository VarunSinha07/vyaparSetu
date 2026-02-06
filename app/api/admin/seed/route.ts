import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getContext } from "@/lib/context";

export async function POST() {
  const context = await getContext(); // This internally uses headers()

  if (!context || context.role !== "ADMIN") {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const companyId = context.companyId!;
  const profileId = context.profileId;

  try {
    // 1. Create a Demo Vendor
    const vendor = await prisma.vendor
      .upsert({
        where: {
          // We can't easily upsert by just name if schema doesn't force unique name per company
          // So we'll try to find first or create.
          // But for demo, let's just create a unique one or use findFirst
          id: "demo-vendor-1", // Use a deterministic ID for demo (if UUIDs allow, actually standard uuid is safer)
          // Let's rely on standard create, maybe adding a random suffix if needed,
          // or just checking if "Demo Vendor Corp" exists
        },
        update: {},
        create: {
          companyId,
          name: "Acme Corp (Demo)",
          email: "accounts@acme-demo.com",
          phone: "9876543210",
          address: "123 Innovation Dr, Tech City",
          gstin: "29ABCDE1234F1Z5",
          vendorType: "GOODS",
        },
      })
      .catch(async () => {
        // Fallback if upsert fails due to UUID constraints (since "demo-vendor-1" isn't a valid UUID usually)
        // We'll just create new one
        return prisma.vendor.create({
          data: {
            companyId,
            name: `Acme Corp ${Math.floor(Math.random() * 1000)}`,
            email: `accounts+${Date.now()}@acme-demo.com`,
            vendorType: "GOODS",
          },
        });
      });

    // 2. Create a "Pending" PR (For Action)
    await prisma.purchaseRequest.create({
      data: {
        companyId,
        createdById: profileId,
        title: "Office Ergonomic Chairs (Demo)",
        description: "Need 5 new chairs for the engineering team.",
        department: "Operations",
        priority: "NORMAL",
        estimatedCost: 75000,
        budgetCategory: "OPEX",
        status: "SUBMITTED",
        preferredVendorId: vendor.id,
      },
    });

    // 3. Create a "Completed" Chain (PR -> PO -> Inv -> Payment)
    // 3a. PR (Approved)
    const approvedPR = await prisma.purchaseRequest.create({
      data: {
        companyId,
        createdById: profileId,
        title: "Annual Server Maintenance (Demo)",
        description: "Yearly cloud infrastructure contract renewal.",
        department: "IT",
        priority: "URGENT",
        estimatedCost: 120000,
        budgetCategory: "OPEX",
        status: "APPROVED",
        preferredVendorId: vendor.id,
      },
    });

    // 3b. PO (Issued)
    const po = await prisma.purchaseOrder.create({
      data: {
        companyId,
        createdById: profileId,
        vendorId: vendor.id,
        purchaseRequestId: approvedPR.id,
        issuedById: profileId,
        poNumber: `PO-DEMO-${Date.now().toString().slice(-4)}`,
        status: "ISSUED",
        totalAmount: 120000,
        issuedAt: new Date(),
        notes: "Standard demo terms.",
      },
    });

    // 3c. Invoice (Verified)
    const inv = await prisma.invoice.create({
      data: {
        companyId,
        purchaseOrderId: po.id,
        vendorId: vendor.id,
        uploadedById: profileId,
        verifiedById: profileId,
        invoiceNumber: `INV-DEMO-${Date.now().toString().slice(-4)}`,
        invoiceDate: new Date(),
        fileUrl: "https://example.com/demo-invoice.pdf", // Dummy URL
        subtotal: 100000,
        cgst: 9000,
        sgst: 9000,
        totalAmount: 118000, // Slightly diff from PO to show reality
        status: "VERIFIED",
        verifiedAt: new Date(),
      },
    });

    // 3d. Payment (Success)
    await prisma.payment.create({
      data: {
        companyId,
        invoiceId: inv.id,
        initiatedById: profileId,
        amount: 118000,
        status: "SUCCESS",
        razorpayPaymentId: `pay_demo_${Date.now()}`,
        paidAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      message: "Demo data seeded successfully!",
    });
  } catch (error) {
    console.error("Seed error:", error);
    return new NextResponse("Failed to seed data", { status: 500 });
  }
}
