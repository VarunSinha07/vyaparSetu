"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { format } from "date-fns";
import {
  FileText,
  Search,
  ArrowRight,
  CheckCircle2,
  Ban,
  Filter,
  IndianRupee,
  Clock,
  User,
  Building2,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Types (simplified for list)
type POStatus = "DRAFT" | "ISSUED" | "CANCELLED";

interface PurchaseOrdersList {
  id: string;
  poNumber: string;
  totalAmount: number;
  status: POStatus;
  createdAt: string;
  vendor: { name: string };
  createdBy: { name: string | null };
}

// Helper for status badge
const getStatusBadge = (status: string) => {
  switch (status) {
    case "DRAFT":
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-600 border border-slate-200 uppercase tracking-wider">
          <FileText className="w-3.5 h-3.5" /> Draft
        </span>
      );
    case "ISSUED":
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 uppercase tracking-wider">
          <CheckCircle2 className="w-3.5 h-3.5" /> Issued
        </span>
      );
    case "CANCELLED":
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200 uppercase tracking-wider">
          <Ban className="w-3.5 h-3.5" /> Void
        </span>
      );
    default:
      return <span>{status}</span>;
  }
};

export default function PurchaseOrdersPage() {
  const [pos, setPos] = useState<PurchaseOrdersList[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Filters
  const [statusFilters, setStatusFilters] = useState<POStatus[]>([]);
  const [vendorFilters, setVendorFilters] = useState<string[]>([]);

  // Derived Data for Filters
  const uniqueVendors = Array.from(
    new Set(pos.map((po) => po.vendor.name)),
  ).sort();

  useEffect(() => {
    fetch("/api/purchase-orders")
      .then((res) => res.json())
      .then((data) => {
        setPos(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const toggleFilter = <T,>(
    current: T[],
    item: T,
    setter: (val: T[]) => void,
  ) => {
    if (current.includes(item)) {
      setter(current.filter((i) => i !== item));
    } else {
      setter([...current, item]);
    }
  };

  const clearFilters = () => {
    setStatusFilters([]);
    setVendorFilters([]);
    setSearch("");
  };

  const filteredPos = pos.filter((po) => {
    const matchesSearch =
      po.poNumber.toLowerCase().includes(search.toLowerCase()) ||
      po.vendor.name.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      statusFilters.length === 0 || statusFilters.includes(po.status);

    const matchesVendor =
      vendorFilters.length === 0 || vendorFilters.includes(po.vendor.name);

    return matchesSearch && matchesStatus && matchesVendor;
  });

  // Reusable Filter Components
  const FilterSection = ({
    title,
    children,
  }: {
    title: string;
    children: React.ReactNode;
  }) => (
    <div className="py-5 border-b border-slate-100 last:border-0">
      <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
        {title}
      </h3>
      <div className="space-y-2">{children}</div>
    </div>
  );

  const FilterCheckbox = ({
    label,
    checked,
    onChange,
    count,
  }: {
    label: string | React.ReactNode;
    checked: boolean;
    onChange: () => void;
    count?: number;
  }) => (
    <label className="flex items-center gap-3 cursor-pointer group select-none">
      <div
        className={cn(
          "w-4 h-4 rounded border flex items-center justify-center transition-all",
          checked
            ? "bg-emerald-600 border-emerald-600 text-white"
            : "border-slate-300 bg-white group-hover:border-emerald-500",
        )}
      >
        {checked && <div className="w-2 h-2 rounded-full bg-white" />}
        <input
          type="checkbox"
          className="hidden"
          checked={checked}
          onChange={onChange}
        />
      </div>
      <span
        className={cn(
          "text-sm font-medium transition-colors",
          checked ? "text-slate-900" : "text-slate-600",
        )}
      >
        {label}
      </span>
      {count !== undefined && (
        <span className="ml-auto text-xs text-slate-400 font-medium bg-slate-50 px-1.5 py-0.5 rounded-full">
          {count}
        </span>
      )}
    </label>
  );

  return (
    <div className="space-y-8 relative min-h-screen pb-20">
      {/* Background Decor */}
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-emerald-50/50 via-slate-50 to-white pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col gap-8 pb-8 border-b border-slate-200/60 leading-none">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold tracking-tight text-slate-900">
              Purchase Orders
            </h1>
            <p className="text-lg text-slate-500 max-w-2xl font-light">
              Manage official purchase orders sent to vendors.
            </p>
          </div>
          {/* Add Create Button Here if needed */}
        </div>
      </div>

      {/* Main Layout Grid */}
      <div className="flex flex-col lg:flex-row gap-8 items-start relative">
        {/* Left Sidebar Filters */}
        <div
          className={cn(
            "hidden lg:block space-y-6 sticky top-8 transition-all duration-300 ease-in-out",
            isSidebarOpen
              ? "w-72 opacity-100 translate-x-0"
              : "w-0 opacity-0 -translate-x-10 overflow-hidden",
          )}
        >
          <div className="bg-white rounded-2xl p-5 border border-slate-200/60 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <h2 className="font-bold text-slate-800 flex items-center gap-2.5">
                <div className="bg-emerald-50 p-1.5 rounded-lg shadow-sm border border-emerald-100 text-emerald-600">
                  <Filter className="w-3.5 h-3.5" />
                </div>
                Filters
              </h2>
              {(statusFilters.length > 0 || vendorFilters.length > 0) && (
                <button
                  onClick={clearFilters}
                  className="text-[10px] font-bold text-rose-500 bg-rose-50 px-2 py-1 rounded-md hover:bg-rose-100 transition-colors"
                >
                  Clear All
                </button>
              )}
            </div>

            <FilterSection title="Status">
              {["DRAFT", "ISSUED", "CANCELLED"].map((status) => (
                <FilterCheckbox
                  key={status}
                  label={status}
                  checked={statusFilters.includes(status as POStatus)}
                  onChange={() =>
                    toggleFilter(
                      statusFilters,
                      status as POStatus,
                      setStatusFilters,
                    )
                  }
                  count={pos.filter((po) => po.status === status).length}
                />
              ))}
            </FilterSection>

            {uniqueVendors.length > 0 && (
              <FilterSection title="Vendor">
                {uniqueVendors.map((vendor) => (
                  <FilterCheckbox
                    key={vendor}
                    label={vendor}
                    checked={vendorFilters.includes(vendor)}
                    onChange={() =>
                      toggleFilter(vendorFilters, vendor, setVendorFilters)
                    }
                    count={pos.filter((po) => po.vendor.name === vendor).length}
                  />
                ))}
              </FilterSection>
            )}
          </div>
        </div>

        {/* Right Content Area */}
        <div className="flex-1 w-full space-y-6 min-w-0">
          {/* Search Bar & Toggle */}
          <div className="bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 flex-1">
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all border",
                  isSidebarOpen
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                    : "bg-white text-slate-600 border-slate-200 hover:border-emerald-500/50 hover:text-emerald-600 hover:bg-emerald-50/50",
                )}
              >
                <Filter className="w-4 h-4" /> Filter
              </button>

              <div className="relative flex-1 max-w-md ml-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search PO Number or Vendor..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-slate-50/50 hover:bg-slate-50 focus:bg-white border-transparent focus:border-emerald-500/20 pl-10 pr-4 py-2 text-sm text-slate-900 placeholder:text-slate-400 rounded-xl transition-all outline-none focus:ring-4 focus:ring-emerald-500/10"
                />
              </div>
            </div>
          </div>

          {/* Results List */}
          {loading ? (
            <div className="min-h-[400px] flex flex-col items-center justify-center gap-4 bg-white/50 rounded-3xl border border-dashed border-slate-200">
              <div className="relative">
                <div className="w-12 h-12 rounded-full border-4 border-slate-100 border-t-emerald-500 animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                </div>
              </div>
              <p className="text-sm font-medium text-slate-500 animate-pulse">
                Loading Orders...
              </p>
            </div>
          ) : filteredPos.length === 0 ? (
            <div className="min-h-[400px] flex flex-col items-center justify-center bg-white rounded-[2rem] border border-slate-200 p-8 text-center bg-[url('https://grainy-gradients.vercel.app/noise.svg')]">
              <div className="w-24 h-24 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm border border-slate-100 transform rotate-3 transition-transform hover:rotate-6">
                <FileText className="w-10 h-10 text-slate-300" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">
                No orders found
              </h3>
              <p className="text-slate-500 max-w-sm mx-auto mb-8">
                Try adjusting your search or filters to find what you're looking
                for.
              </p>
              <button
                onClick={clearFilters}
                className="px-6 py-2.5 bg-slate-900 text-white rounded-xl font-bold hover:bg-emerald-600 transition-all hover:shadow-lg active:scale-95"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredPos.map((po) => (
                <div
                  key={po.id}
                  className="group bg-white rounded-2xl border border-slate-200 p-5 hover:border-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/5 transition-all duration-300 relative overflow-hidden"
                >
                  <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                    {/* Icon */}
                    <div className="flex-shrink-0">
                      <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-600 group-hover:bg-emerald-50 group-hover:text-emerald-600 group-hover:border-emerald-100 transition-all font-bold text-xl shadow-sm">
                        <FileText className="w-6 h-6" />
                      </div>
                    </div>

                    {/* Main Content */}
                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-center gap-3 mb-1">
                        <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100 font-mono">
                          #{po.poNumber}
                        </span>
                        <span className="text-[10px] text-slate-400 uppercase tracking-widest font-medium">
                          Created{" "}
                          {format(new Date(po.createdAt), "MMM d, yyyy")}
                        </span>
                      </div>

                      <h3 className="text-lg font-bold text-slate-900 truncate pr-10 group-hover:text-emerald-700 transition-colors flex items-center gap-2">
                        {po.vendor.name}
                      </h3>

                      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-500">
                        <span className="flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5" />
                          Created by{" "}
                          <span className="font-medium text-slate-700">
                            {po.createdBy?.name || "System"}
                          </span>
                        </span>
                      </div>
                    </div>

                    {/* Right Side Stats & Action */}
                    <div className="flex flex-row md:flex-col items-center md:items-end gap-3 md:gap-1 w-full md:w-auto mt-4 md:mt-0 pt-4 md:pt-0 border-t md:border-0 border-slate-100">
                      <div className="text-lg font-bold text-slate-900 group-hover:text-emerald-700 transition-colors font-mono">
                        ₹{po.totalAmount.toLocaleString("en-IN")}
                      </div>
                      <div className="mb-2">{getStatusBadge(po.status)}</div>
                      <Link
                        href={`/dashboard/purchase-orders/${po.id}`}
                        className="hidden md:inline-flex items-center gap-1 text-sm font-semibold text-emerald-600 hover:text-emerald-700 hover:underline mt-1"
                      >
                        View Order <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>

                    {/* Mobile Link Overlay */}
                    <Link
                      href={`/dashboard/purchase-orders/${po.id}`}
                      className="absolute inset-0 md:hidden"
                    >
                      <span className="sr-only">View Order</span>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
