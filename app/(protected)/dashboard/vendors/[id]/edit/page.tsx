import { getContext } from "@/lib/context";
import { CompanyRole } from "@/app/generated/prisma/enums";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import VendorForm from "../../vendor-form";

export default async function EditVendorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const context = await getContext();
  const { id } = await params;

  // RBAC: Edit -> ADMIN, PROCUREMENT
  const allowedRoles = [CompanyRole.ADMIN, CompanyRole.PROCUREMENT];

  if (
    !context?.role ||
    !(allowedRoles as CompanyRole[]).includes(context.role as CompanyRole)
  ) {
    redirect("/dashboard/vendors");
  }

  const vendor = await prisma.vendor.findUnique({
    where: {
      id,
      companyId: context.companyId!,
    },
  });

  if (!vendor) {
    redirect("/dashboard/vendors");
  }

  return <VendorForm initialData={vendor} isEditMode />;
}
