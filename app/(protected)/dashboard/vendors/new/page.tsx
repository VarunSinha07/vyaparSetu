import { getContext } from "@/lib/context";
import { CompanyRole } from "@/app/generated/prisma/enums";
import { redirect } from "next/navigation";
import VendorForm from "../vendor-form";

export default async function NewVendorPage() {
  const context = await getContext();
  
  if (context?.role === CompanyRole.MANAGER || context?.role === CompanyRole.FINANCE) {
    redirect("/dashboard/vendors");
  }

    return <VendorForm />;
  }
