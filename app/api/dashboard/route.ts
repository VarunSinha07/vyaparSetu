import { getContext } from "@/lib/context";
import prisma from "@/lib/prisma";
import { CompanyRole } from "@/app/generated/prisma/client";
import { NextResponse } from "next/server";

export async function GET() {
  const context = await getContext();
  if (!context || !context.companyId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { companyId, role, profileId } = context;

  // Initial stats structure
  const stats: Record<string, number> = {};

  try {
    if (role === CompanyRole.ADMIN) {
      const [
        activeMembersCount,
        pendingInvitesCount,
        totalVendorsCount,
        totalPurchaseRequestsCount,
        pendingPurchaseRequestsCount,
        totalPurchaseOrdersCount,
        draftPurchaseOrdersCount,
        issuedPurchaseOrdersCount,
      ] = await Promise.all([
        prisma.companyMember.count({ where: { companyId, isActive: true } }),
        prisma.invitation.count({ where: { companyId, acceptedAt: null } }),
        prisma.vendor.count({ where: { companyId } }),
        prisma.purchaseRequest.count({ where: { companyId } }),
        prisma.purchaseRequest.count({
          where: {
            companyId,
            status: { in: ["SUBMITTED", "UNDER_REVIEW"] },
          },
        }),
        prisma.purchaseOrder.count({ where: { companyId } }),
        prisma.purchaseOrder.count({ where: { companyId, status: "DRAFT" } }),
        prisma.purchaseOrder.count({ where: { companyId, status: "ISSUED" } }),
      ]);

      Object.assign(stats, {
        activeMembersCount,
        pendingInvitesCount,
        totalVendorsCount,
        totalPurchaseRequestsCount,
        pendingPurchaseRequestsCount,
        totalPurchaseOrdersCount,
        draftPurchaseOrdersCount,
        issuedPurchaseOrdersCount,
      });
    } else if (role === CompanyRole.MANAGER) {
      // For Pending Approvals, we look for Submitted PRs that are NOT created by the current user
      // (since self-approval is blocked).
      // We assume any Manager can approve any Submitted PR (pool model).
      const [pendingApprovalsCount, approvedByMeCount, rejectedByMeCount] =
        await Promise.all([
          prisma.purchaseRequest.count({
            where: {
              companyId,
              status: "SUBMITTED",
              createdById: { not: profileId },
            },
          }),
          prisma.approval.count({
            where: { approverId: profileId, status: "APPROVED" },
          }),
          prisma.approval.count({
            where: { approverId: profileId, status: "REJECTED" },
          }),
        ]);

      Object.assign(stats, {
        pendingApprovalsCount,
        approvedByMeCount,
        rejectedByMeCount,
      });
    } else if (role === CompanyRole.PROCUREMENT) {
      const [
        draftPurchaseRequestsCount,
        submittedPurchaseRequestsCount,
        approvedPurchaseRequestsCount,
        draftPurchaseOrdersCount,
        totalVendorsCount,
      ] = await Promise.all([
        prisma.purchaseRequest.count({ where: { companyId, status: "DRAFT" } }),
        prisma.purchaseRequest.count({
          where: { companyId, status: "SUBMITTED" },
        }),
        prisma.purchaseRequest.count({
          where: { companyId, status: "APPROVED" },
        }),
        prisma.purchaseOrder.count({ where: { companyId, status: "DRAFT" } }),
        prisma.vendor.count({ where: { companyId } }),
      ]);

      Object.assign(stats, {
        draftPurchaseRequestsCount,
        submittedPurchaseRequestsCount,
        approvedPurchaseRequestsCount,
        draftPurchaseOrdersCount,
        totalVendorsCount,
      });
    } else if (role === CompanyRole.FINANCE) {
      const [
        issuedPurchaseOrdersCount,
        pendingInvoicesCount,
        pendingPaymentsCount,
      ] = await Promise.all([
        prisma.purchaseOrder.count({ where: { companyId, status: "ISSUED" } }),
        prisma.invoice.count({
          where: {
            companyId,
            status: { in: ["UPLOADED", "UNDER_VERIFICATION"] },
          },
        }),
        prisma.payment.count({ where: { companyId, status: "INITIATED" } }),
      ]);

      Object.assign(stats, {
        issuedPurchaseOrdersCount,
        pendingInvoicesCount,
        pendingPaymentsCount,
      });
    }

    return NextResponse.json({
      companyId,
      role,
      stats,
    });
  } catch (error) {
    console.error("[DASHBOARD_STATS]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
