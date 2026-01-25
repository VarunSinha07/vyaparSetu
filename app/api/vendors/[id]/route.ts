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

  // RBAC: View -> ADMIN, PROCUREMENT, FINANCE, MANAGER
  const allowedRoles: CompanyRole[] = [
    CompanyRole.ADMIN,
    CompanyRole.PROCUREMENT,
    CompanyRole.FINANCE,
    CompanyRole.MANAGER,
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

  // General Update Logic
  // RBAC: Edit -> ADMIN, PROCUREMENT
  const editRoles: CompanyRole[] = [CompanyRole.ADMIN, CompanyRole.PROCUREMENT];

  if (!context.role || !editRoles.includes(context.role as CompanyRole)) {
    return new NextResponse("Forbidden", { status: 403 });
  }

  // Status Change Specific Check (Activate or Deactivate)
  if (Object.prototype.hasOwnProperty.call(body, "isActive")) {
    if (context.role !== CompanyRole.ADMIN) {
      return new NextResponse(
        "Forbidden. Only Admins can change vendor status.",
        { status: 403 },
      );
    }
  }

  try {
    // Remove sensitive or Immutable fields if any (like id, companyId, createdAt)
    // For now, we trust the body but ensure companyId is not changed by the update query query scope
    const { id: _id, companyId: _cid, createdAt: _ca, ...updateData } = body;

    const vendor = await prisma.vendor.update({
      where: { id, companyId: context.companyId },
      data: updateData,
    });

    // Audit
    await prisma.auditLog.create({
      data: {
        companyId: context.companyId,
        userId: context.profileId,
        action: body.isActive === false ? "DEACTIVATE_VENDOR" : "UPDATE_VENDOR",
        entity: "Vendor",
        entityId: vendor.id,
        metadata: { name: vendor.name, ...updateData },
      },
    });

    return NextResponse.json(vendor);
  } catch (error) {
    console.error("[VENDOR_UPDATE]", error);
    return new NextResponse("Error updating vendor", { status: 500 });
  }
}
