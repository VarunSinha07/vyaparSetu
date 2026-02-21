import { getContext } from "@/lib/context";
import prisma from "@/lib/prisma";
import {
  CompanyRole,
  PRStatus,
  PRPriority,
  BudgetCategory,
} from "@/app/generated/prisma/client";
import { NextResponse } from "next/server";
import { z } from "zod";

const createPRSchema = z.object({
  title: z.string().min(3),
  description: z.string().optional(),
  department: z.string().min(2),
  estimatedCost: z.number().positive(),
  preferredVendorId: z.string().optional(),
  priority: z.nativeEnum(PRPriority).default(PRPriority.NORMAL),
  budgetCategory: z.nativeEnum(BudgetCategory).optional(),
  requiredBy: z
    .string()
    .optional()
    .transform((str) => (str ? new Date(str) : null)), // Receives string, converts to Date
  status: z.nativeEnum(PRStatus).optional().default(PRStatus.DRAFT),
  itemName: z.string().optional(),
  quantity: z.number().int().positive().optional(),
  unitPrice: z.number().positive().optional(),
});

export async function POST(req: Request) {
  const context = await getContext();
  if (!context?.companyId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  // RBAC: Only ADMIN and PROCUREMENT can create PRs
  const allowedRoles: CompanyRole[] = [
    CompanyRole.ADMIN,
    CompanyRole.PROCUREMENT,
  ];
  if (!context.role || !allowedRoles.includes(context.role as CompanyRole)) {
    return new NextResponse(
      "Forbidden: Only Admin or Procurement can create PRs",
      { status: 403 },
    );
  }

  try {
    const body = await req.json();
    const validatedData = createPRSchema.parse(body);

    const pr = await prisma.purchaseRequest.create({
      data: {
        companyId: context.companyId,
        createdById: context.profileId!,
        title: validatedData.title,
        description: validatedData.description,
        department: validatedData.department,
        estimatedCost: validatedData.estimatedCost,
        preferredVendorId: validatedData.preferredVendorId,
        priority: validatedData.priority,
        budgetCategory: validatedData.budgetCategory,
        requiredBy: validatedData.requiredBy,
        status: validatedData.status,
        itemName: validatedData.itemName,
        quantity: validatedData.quantity,
        unitPrice: validatedData.unitPrice,
      },
      include: {
        preferredVendor: true,
        createdBy: true,
      },
    });

    // Audit Log
    await prisma.auditLog.create({
      data: {
        companyId: context.companyId,
        userId: context.profileId!,
        action: "CREATE_PR",
        entity: "PurchaseRequest",
        entityId: pr.id,
        metadata: { title: pr.title, amount: pr.estimatedCost },
      },
    });

    return NextResponse.json(pr);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new NextResponse(JSON.stringify(error.issues), { status: 400 });
    }
    console.error("[PR_CREATE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function GET() {
  const context = await getContext();
  if (!context?.companyId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  // All roles can view PRs, but we might want to filter?
  // Requirement says: "View all PRs" for all 4 roles.

  try {
    const prs = await prisma.purchaseRequest.findMany({
      where: {
        companyId: context.companyId,
      },
      include: {
        createdBy: {
          select: { name: true, userId: true },
        },
        preferredVendor: {
          select: { name: true },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({
      items: prs,
      role: context.role,
    });
  } catch (error) {
    console.error("[PR_LIST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
