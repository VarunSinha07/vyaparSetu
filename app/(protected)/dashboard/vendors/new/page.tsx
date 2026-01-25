import { getContext } from "@/lib/context";
import { CompanyRole } from "@/app/generated/prisma/enums";
import { redirect } from "next/navigation";
import CreateVendorForm from "./create-vendor-form";

export default async function NewVendorPage() {
  const context = await getContext();

  if (context?.role === CompanyRole.MANAGER) {
    redirect("/dashboard/vendors");
  }

  return <CreateVendorForm />;
}
