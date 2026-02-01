import { getContext } from "@/lib/context";
import prisma from "@/lib/prisma";
import { CompanyRole } from "@/app/generated/prisma/client";
import { NextResponse } from "next/server";

export async function GET() {
  const context = await getContext();
  if (!context?.companyId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  // RBAC: Admin & Finance only
  const allowed = [CompanyRole.ADMIN, CompanyRole.FINANCE] as CompanyRole[];
  if (!allowed.includes(context.role as CompanyRole)) {
    return new NextResponse("Forbidden", { status: 403 });
  }

  try {
    const payments = await prisma.payment.findMany({
      where: {
        companyId: context.companyId,
      },
      include: {
        invoice: {
          select: {
            invoiceNumber: true,
            vendor: { select: { name: true } },
          },
        },
        initiatedBy: { select: { name: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(payments);
  } catch (error) {
    console.error("[PAYMENTS_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
