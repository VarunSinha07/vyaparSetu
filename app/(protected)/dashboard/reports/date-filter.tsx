"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function DateRangeFilter() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentRange = searchParams.get("range") || "30d";

  const handleValueChange = (value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set("range", value);
    } else {
      params.delete("range");
    }
    router.replace(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex items-center space-x-2">
      <span className="text-sm font-medium text-slate-700">Date Range:</span>
      <Select value={currentRange} onValueChange={handleValueChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select range" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="30d">Last 30 Days</SelectItem>
          <SelectItem value="90d">Last 3 Months</SelectItem>
          <SelectItem value="this_year">This Year</SelectItem>
          <SelectItem value="all">All Time</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
