import { notFound, redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { getContext } from "@/lib/context";
import PRDetailsView from "./pr-details-view";
import { CompanyRole } from "@/app/generated/prisma/client";

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

  // 2. Prepare user context for the client component
  // We need to pass enough info for the UI to disable/enable buttons
  const currentUser = {
    id: context.profileId,
    role: context.role as CompanyRole,
    userId: context.userId,
  };

  return <PRDetailsView pr={pr} currentUser={currentUser} />;
}
