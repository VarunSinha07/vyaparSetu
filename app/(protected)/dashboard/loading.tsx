import { LoadingState } from "@/components/loading-state";

export default function DashboardLoading() {
  return (
    <div className="flex h-full w-full items-center justify-center p-8 bg-gray-50/50">
      <LoadingState text="Loading Dashboard..." />
    </div>
  );
}
