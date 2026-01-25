import { notFound, redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { getContext } from "@/lib/context";
import EditPurchaseRequestForm from "./edit-form";
import { CompanyRole, PRStatus } from "@/app/generated/prisma/client";

export default async function EditPurchaseRequestPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const context = await getContext();

  if (!context?.companyId) {
    redirect("/sign-in");
  }

  const pr = await prisma.purchaseRequest.findFirst({
    where: {
      id: id,
      companyId: context.companyId,
    },
  });

  if (!pr) {
    return notFound();
  }

  // Permission Check: only DRAFT can be edited, and only by creator or admin
  const isCreator = pr.createdById === context.profileId;
  const isAdmin = context.role === CompanyRole.ADMIN;

  if (pr.status !== PRStatus.DRAFT) {
    // If not draft, cannot edit. Redirect to details.
    redirect(`/dashboard/purchase-requests/${id}`);
  }

  if (!isCreator && !isAdmin) {
    // If not creator or admin, cannot edit.
    redirect(`/dashboard/purchase-requests/${id}`);
  }

  return <EditPurchaseRequestForm pr={pr} />;
}
