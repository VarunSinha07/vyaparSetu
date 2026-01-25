import { getContext } from "@/lib/context";
import VendorListView from "./vendor-list-view";

export default async function VendorsPage() {
  const context = await getContext();

  return <VendorListView role={context?.role || null} />;
}
