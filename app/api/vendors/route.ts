import { getContext } from "@/lib/context";
import prisma from "@/lib/prisma";
import { CompanyRole, VendorType } from "@/app/generated/prisma/enums";
import { NextResponse } from "next/server";
import { z } from "zod";

const vendorSchema = z.object({
  name: z.string().min(1, "Vendor name is required"),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  phone: z.string().optional(),
  address: z.string().optional(),
  gstin: z
    .string()
    .regex(
      /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/,
      "Invalid GSTIN format",
    )
    .optional()
    .or(z.literal("")),
  pan: z
    .string()
    .regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, "Invalid PAN format")
    .optional()
    .or(z.literal("")),
  bankAccount: z.string().optional(),
  ifsc: z
    .string()
    .regex(/^[A-Z]{4}0[A-Z0-9]{6}$/, "Invalid IFSC format")
    .optional()
    .or(z.literal("")),
  vendorType: z.nativeEnum(VendorType),
});

export async function GET() {
  const context = await getContext();
  if (!context?.companyId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  // RBAC: View vendors -> ADMIN, PROCUREMENT, FINANCE
  const allowedRoles: CompanyRole[] = [
    CompanyRole.ADMIN,
    CompanyRole.PROCUREMENT,
    CompanyRole.FINANCE,
  ];
  if (!context.role || !allowedRoles.includes(context.role as CompanyRole)) {
    return new NextResponse("Forbidden", { status: 403 });
  }

  try {
    const vendors = await prisma.vendor.findMany({
      where: {
        companyId: context.companyId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return NextResponse.json(vendors);
  } catch (error) {
    console.error("[VENDORS_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function POST(req: Request) {
  const context = await getContext();
  if (!context?.companyId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  // RBAC: Add vendor -> ADMIN, PROCUREMENT
  const allowedRoles: CompanyRole[] = [CompanyRole.ADMIN, CompanyRole.PROCUREMENT];
  if (!context.role || !allowedRoles.includes(context.role as CompanyRole)) {
    return new NextResponse("Forbidden", { status: 403 });
  }

  try {
    const body = await req.json();
    const validation = vendorSchema.safeParse(body);

    if (!validation.success) {
      return new NextResponse(validation.error.issues[0].message, {
        status: 400,
      });
    }

    const { name, gstin } = validation.data;

    // Check for duplicates (Simple check: Name or GSTIN within company)
    // NOTE: Companies might have same vendor names, so scope by companyId
    const existingVendor = await prisma.vendor.findFirst({
      where: {
        companyId: context.companyId,
        OR: [
          { name: { equals: name, mode: "insensitive" } },
          ...(gstin ? [{ gstin }] : []),
        ],
      },
    });

    if (existingVendor) {
      return new NextResponse(
        "Vendor with this name or GSTIN already exists.",
        { status: 409 },
      );
    }

    const vendor = await prisma.vendor.create({
      data: {
        companyId: context.companyId,
        ...validation.data,
      },
    });

    // Audit Log
    await prisma.auditLog.create({
      data: {
        companyId: context.companyId,
        userId: context.profileId,
        action: "CREATE_VENDOR",
        entity: "Vendor",
        entityId: vendor.id,
        metadata: { name: vendor.name },
      },
    });

    return NextResponse.json(vendor);
  } catch (error) {
    console.error("[VENDORS_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
