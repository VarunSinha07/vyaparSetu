import { secureApi } from "@/lib/api-context";
import prisma from "@/lib/prisma";
import { CompanyRole } from "@/app/generated/prisma/enums";
import { NextResponse } from "next/server";
import { logAudit } from "@/lib/audit";

export const POST = secureApi(async (req, ctx) => {
  // Check if user already has a company
  if (ctx.companyId) {
    return NextResponse.json(
      { error: "User already belongs to a company" },
      { status: 400 },
    );
  }

  const body = await req.json();
  const { name, email, phone, address } = body;

  if (!name) {
    return NextResponse.json(
      { error: "Company name is required" },
      { status: 400 },
    );
  }

  // Step 3: Company Creation & Admin Assignment
  const result = await prisma.$transaction(async (tx) => {
    const company = await tx.company.create({
      data: {
        name,
        email,
        phone,
        address,
      },
    });

    await tx.companyMember.create({
      data: {
        companyId: company.id,
        userId: ctx.userProfile.id,
        role: CompanyRole.ADMIN,
      },
    });

    return company;
  });

  // Step 8: Audit Logging
  await logAudit({
    companyId: result.id,
    userId: ctx.userProfile.id,
    action: "CREATE_COMPANY",
    entity: "Company",
    entityId: result.id,
    metadata: { name },
  });

  return NextResponse.json({ company: result });
});
