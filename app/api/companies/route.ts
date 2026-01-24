import { getContext } from "@/lib/context";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { CompanyRole } from "../../generated/prisma/client";

export async function POST(req: Request) {
  try {
    const context = await getContext(); // Don't enforce company, we are creating one

    if (!context) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (context.companyId) {
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

    // Transaction to create Company and Member
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
          userId: context.userId, // References UserProfile.userId
          role: CompanyRole.ADMIN,
        },
      });

      return company;
    });

    return NextResponse.json({ company: result }, { status: 201 });
  } catch (error: unknown) {
    console.error("Create Company Error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
