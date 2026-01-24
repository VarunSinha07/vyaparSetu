import { getContext } from "@/lib/context";
import prisma from "@/lib/prisma";
import { CompanyRole } from "@/app/generated/prisma/enums";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const context = await getContext();
  if (!context?.companyId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { id } = await params;

  // RBAC: View -> ADMIN, PROCUREMENT, FINANCE
  const allowedRoles: CompanyRole[] = [
    CompanyRole.ADMIN,
    CompanyRole.PROCUREMENT,
    CompanyRole.FINANCE,
  ];
  if (!context.role || !allowedRoles.includes(context.role as CompanyRole)) {
    return new NextResponse("Forbidden", { status: 403 });
  }

  try {
    const vendor = await prisma.vendor.findUnique({
      where: {
        id,
        companyId: context.companyId, // Tenant Scoping
      },
    });

    if (!vendor) {
      return new NextResponse("Not Found", { status: 404 });
    }

    return NextResponse.json(vendor);
  } catch (error) {
    console.error("[VENDOR_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const context = await getContext();
  if (!context?.companyId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { id } = await params;

  const body = await req.json();
  const { action } = body;

  // Handle Deactivation
  if (action === "deactivate") {
    // RBAC: Deactivate -> ADMIN Only
    if (context.role !== CompanyRole.ADMIN) {
      return new NextResponse(
        "Forbidden. Only Admins can deactivate vendors.",
        { status: 403 },
      );
    }

    try {
      const vendor = await prisma.vendor.update({
        where: { id, companyId: context.companyId },
        data: { isActive: false },
      });

      // Audit
      await prisma.auditLog.create({
        data: {
          companyId: context.companyId,
          userId: context.profileId,
          action: "DEACTIVATE_VENDOR",
          entity: "Vendor",
          entityId: vendor.id,
          metadata: { name: vendor.name },
        },
      });

      return NextResponse.json(vendor);
    } catch (error) {
      console.error("[VENDOR_DEACTIVATE]", error);
      // Check if record not found
      return new NextResponse("Error deactivating vendor", { status: 500 });
    }
  }

  return new NextResponse("Invalid Action", { status: 400 });
}
