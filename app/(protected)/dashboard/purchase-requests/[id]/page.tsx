import { notFound, redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { getContext } from "@/lib/context";
import PRDetailsView from "./pr-details-view";
import { CompanyRole, PRStatus } from "@/app/generated/prisma/client";

export default async function PurchaseRequestDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const context = await getContext();

  if (!context?.companyId) {
    redirect("/sign-in");
  }

  // 1. Fetch PR with all necessary relations
  const pr = await prisma.purchaseRequest.findFirst({
    where: {
      id: id,
      companyId: context.companyId, // Isolation check
    },
    include: {
      preferredVendor: true,
      createdBy: true,
      approvals: {
        include: {
          approver: true,
        },
        orderBy: {
          createdAt: "asc",
        },
      },
      purchaseOrder: {
        select: {
          id: true,
          poNumber: true,
        },
      },
    },
  });

  if (!pr) {
    return notFound();
  }

  // 2. Fetch timeline data with role-based filtering
  let timeline: {
    id: string;
    action: string;
    actor: string;
    timestamp: string;
    metadata?: Record<string, unknown>;
  }[] = [];

  // Finance can only view timeline after approval
  if (context.role === CompanyRole.FINANCE && pr.status !== PRStatus.APPROVED) {
    // Don't show timeline to Finance for non-approved PRs
    timeline = [];
  } else {
    const auditLogs = await prisma.auditLog.findMany({
      where: {
        companyId: context.companyId,
        entity: "PurchaseRequest",
        entityId: id,
      },
      include: {
        user: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    timeline = auditLogs.map((log) => ({
      id: log.id,
      action: log.action,
      actor: log.user.name || "Unknown User",
      timestamp: log.createdAt.toISOString(),
      metadata: log.metadata as Record<string, unknown>,
    }));
  }

  // 3. Prepare user context for the client component
  // We need to pass enough info for the UI to disable/enable buttons
  const currentUser = {
    id: context.profileId,
    role: context.role as CompanyRole,
    userId: context.userId,
  };

  return (
    <PRDetailsView pr={pr} currentUser={currentUser} timeline={timeline} />
  );
}
