"use client";

import { Vendor } from "@/app/generated/prisma/client";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Briefcase,
  Building2,
  Loader2,
  Package,
  LayoutGrid,
  List,
  ChevronLeft,
  ChevronRight,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

import { CompanyRole } from "@/app/generated/prisma/enums";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Edit, Trash2, Power } from "lucide-react";
import { useRouter } from "next/navigation";

type ViewMode = "list" | "grid";
type FilterStatus = "ALL" | "ACTIVE" | "INACTIVE";
type FilterType = "ALL" | "GOODS" | "SERVICES";
type FilterCompliance = "ALL" | "COMPLIANT" | "NON_COMPLIANT";

export default function VendorListView({ role }: { role: string | null }) {
  const router = useRouter();
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [vendorToToggle, setVendorToToggle] = useState<string | null>(null);

  // View State
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Filter States
  const [statusFilter, setStatusFilter] = useState<FilterStatus>("ALL");
  const [typeFilter, setTypeFilter] = useState<FilterType>("ALL");
  const [complianceFilter, setComplianceFilter] =
    useState<FilterCompliance>("ALL");

  const canCreate =
    role !== CompanyRole.MANAGER && role !== CompanyRole.FINANCE;
  const canEdit =
    role === CompanyRole.ADMIN || role === CompanyRole.PROCUREMENT;
  const canToggleStatus = role === CompanyRole.ADMIN;

  const handleToggleStatus = async () => {
    if (!vendorToToggle) return;

    // Find current status first
    const vendor = vendors.find((v) => v.id === vendorToToggle);
    if (!vendor) return;
    const newStatus = !vendor.isActive;

    try {
      const res = await fetch(`/api/vendors/${vendorToToggle}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: newStatus }),
      });

      if (!res.ok) throw new Error("Failed");
      toast.success(newStatus ? "Vendor Activated" : "Vendor Deactivated");
      // refresh local state
      setVendors((prev) =>
        prev.map((v) =>
          v.id === vendorToToggle ? { ...v, isActive: newStatus } : v,
        ),
      );
    } catch {
      toast.error("Failed to update status");
    } finally {
      setVendorToToggle(null);
    }
  };

  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const res = await fetch("/api/vendors");
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        setVendors(data);
      } catch {
        toast.error("Could not load vendors");
      } finally {
        setLoading(false);
      }
    };
    fetchVendors();
  }, []);

  const filteredVendors = vendors.filter((v) => {
    const matchesSearch =
      v.name.toLowerCase().includes(search.toLowerCase()) ||
      v.gstin?.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "ALL"
        ? true
        : statusFilter === "ACTIVE"
          ? v.isActive
          : !v.isActive;

    const matchesType =
      typeFilter === "ALL" ? true : v.vendorType === typeFilter;

    const matchesCompliance =
      complianceFilter === "ALL"
        ? true
        : complianceFilter === "COMPLIANT"
          ? v.gstin && v.pan
          : !v.gstin || !v.pan;

    return matchesSearch && matchesStatus && matchesType && matchesCompliance;
  });

  const clearFilters = () => {
    setSearch("");
    setStatusFilter("ALL");
    setTypeFilter("ALL");
    setComplianceFilter("ALL");
  };

  const getFilterCount = (
    predicate: (v: Vendor) => boolean,
    baseList = vendors,
  ) => {
    return baseList.filter(predicate).length;
  };

  // --- Sub-components for Filters ---
  const FilterSection = ({
    title,
    children,
  }: {
    title: string;
    children: React.ReactNode;
  }) => (
    <div className="space-y-3 pb-6 border-b border-slate-100 last:border-0">
      <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
        {title}
      </h3>
      <div className="space-y-2">{children}</div>
    </div>
  );

  const FilterCheckbox = ({
    label,
    count,
    checked,
    onChange,
  }: {
    label: string;
    count?: number;
    checked: boolean;
    onChange: () => void;
  }) => (
    <label className="flex items-center gap-3 cursor-pointer group">
      <div
        className={cn(
          "w-5 h-5 rounded-md border flex items-center justify-center transition-all duration-200",
          checked
            ? "bg-slate-900 border-slate-900 text-white"
            : "border-slate-300 bg-white group-hover:border-slate-400",
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
        <span className="ml-auto text-xs text-slate-400 font-medium bg-slate-50 px-2 py-0.5 rounded-full">
          {count}
        </span>
      )}
    </label>
  );

  const VendorCard = ({ vendor }: { vendor: Vendor }) => (
    <div className="group bg-white rounded-2xl border border-slate-200 p-5 hover:border-emerald-500/30 hover:shadow-2xl hover:shadow-emerald-500/10 transition-all duration-300 flex flex-col h-full relative overflow-hidden">
      <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity z-10">
        {(canEdit || canToggleStatus) && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all outline-none bg-white/80 backdrop-blur-sm border border-slate-100 shadow-sm">
                <MoreHorizontal className="w-5 h-5" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-48 p-2 bg-white backdrop-blur-3xl border border-slate-100 shadow-xl shadow-slate-200/50 rounded-2xl"
            >
              <DropdownMenuItem
                className="group flex items-center gap-2.5 px-3 py-2 text-sm font-semibold text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg cursor-pointer transition-all"
                onClick={() =>
                  router.push(`/dashboard/vendors/${vendor.id}/edit`)
                }
              >
                <Edit className="w-4 h-4 text-slate-400 group-hover:text-emerald-500" />
                Edit
              </DropdownMenuItem>
              {canToggleStatus && (
                <DropdownMenuItem
                  className={cn(
                    "group flex items-center gap-2.5 px-3 py-2 text-sm font-semibold rounded-lg cursor-pointer transition-all mt-1",
                    vendor.isActive
                      ? "text-rose-600 hover:bg-rose-50"
                      : "text-emerald-600 hover:bg-emerald-50",
                  )}
                  onClick={() => setVendorToToggle(vendor.id)}
                >
                  <Power className="w-4 h-4" />
                  {vendor.isActive ? "Deactivate" : "Activate"}
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      <div className="flex items-start justify-between mb-6">
        <div className="w-16 h-16 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-2xl font-bold text-slate-700 group-hover:bg-gradient-to-br group-hover:from-emerald-500 group-hover:to-emerald-600 group-hover:text-white group-hover:border-transparent transition-all shadow-sm">
          {vendor.name.charAt(0).toUpperCase()}
        </div>
        <div
          className={cn(
            "px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border",
            vendor.isActive
              ? "bg-emerald-50 text-emerald-700 border-emerald-100"
              : "bg-slate-50 text-slate-500 border-slate-100",
          )}
        >
          {vendor.isActive ? "Active" : "Inactive"}
        </div>
      </div>

      <div className="mb-4">
        <h3 className="text-lg font-bold text-slate-900 mb-1 line-clamp-1 group-hover:text-emerald-700 transition-colors">
          {vendor.name}
        </h3>
        <p className="text-sm text-slate-500 font-medium flex items-center gap-1.5 truncate">
          {vendor.email || "No email"}
        </p>
      </div>

      <div className="space-y-3 mt-auto pt-6 border-t border-slate-50">
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-400 font-medium text-xs uppercase tracking-wide">
            Type
          </span>
          <span className="font-semibold text-slate-700 flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded-lg border border-slate-100">
            {vendor.vendorType === "GOODS" ? (
              <Package className="w-3.5 h-3.5 text-blue-500" />
            ) : (
              <Briefcase className="w-3.5 h-3.5 text-purple-500" />
            )}
            {vendor.vendorType}
          </span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-400 font-medium text-xs uppercase tracking-wide">
            GSTIN
          </span>
          <span className="font-mono text-slate-600 bg-slate-50 px-1.5 rounded border border-slate-100 text-xs">
            {vendor.gstin || "—"}
          </span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-8 relative min-h-screen pb-20">
      {/* Background Decor */}
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-emerald-50/50 via-slate-50 to-white pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col gap-8 pb-8 border-b border-slate-200/60">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold tracking-tight text-slate-900">
              Vendors
            </h1>
            <p className="text-lg text-slate-500 max-w-2xl font-light">
              Manage your external suppliers, track their GST details, and
              status.
            </p>
          </div>
          {canCreate && (
            <Link
              href="/dashboard/vendors/new"
              className="inline-flex items-center justify-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-2xl text-sm font-semibold hover:bg-emerald-600 hover:shadow-lg hover:shadow-emerald-200 transition-all duration-300 active:scale-95 group"
            >
              <div className="p-1 rounded-lg bg-white/10 group-hover:bg-white/20 transition-colors">
                <Plus className="w-4 h-4" />
              </div>
              Onboard Vendor
            </Link>
          )}
        </div>

        {/* Quick Stats */}
        {!loading && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-white border border-slate-100 shadow-sm hover:border-slate-300 transition-colors group cursor-default flex flex-col items-start gap-1">
              <span className="text-slate-400 text-xs font-bold uppercase tracking-wider group-hover:text-slate-900 transition-colors">
                Total Vendors
              </span>
              <span className="text-2xl font-bold text-slate-900">
                {vendors.length}
              </span>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-slate-100 shadow-sm hover:border-emerald-200 transition-colors group cursor-default flex flex-col items-start gap-1">
              <span className="text-slate-400 text-xs font-bold uppercase tracking-wider group-hover:text-emerald-600 transition-colors">
                Active
              </span>
              <span className="text-2xl font-bold text-emerald-600">
                {vendors.filter((v) => v.isActive).length}
              </span>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-slate-100 shadow-sm hover:border-blue-200 transition-colors group cursor-default flex flex-col items-start gap-1">
              <span className="text-slate-400 text-xs font-bold uppercase tracking-wider group-hover:text-blue-600 transition-colors">
                Goods
              </span>
              <span className="text-2xl font-bold text-blue-600">
                {vendors.filter((v) => v.vendorType === "GOODS").length}
              </span>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-slate-100 shadow-sm hover:border-purple-200 transition-colors group cursor-default flex flex-col items-start gap-1">
              <span className="text-slate-400 text-xs font-bold uppercase tracking-wider group-hover:text-purple-600 transition-colors">
                Services
              </span>
              <span className="text-2xl font-bold text-purple-600">
                {vendors.filter((v) => v.vendorType === "SERVICES").length}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Main Layout Grid */}
      <div className="flex flex-col lg:flex-row gap-8 items-start relative">
        {/* Left Sidebar Filters (Desktop) */}
        <div
          className={cn(
            "hidden lg:block space-y-6 sticky top-8 transition-all duration-300 ease-in-out",
            isSidebarOpen
              ? "w-80 opacity-100 translate-x-0"
              : "w-0 opacity-0 -translate-x-10 overflow-hidden",
          )}
        >
          <div className="bg-white rounded-2xl p-5 border border-slate-200/60 shadow-sm relative group">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
              <h2 className="font-bold text-slate-800 flex items-center gap-2.5">
                <div className="bg-emerald-50 p-1.5 rounded-lg shadow-sm border border-emerald-100 text-emerald-600">
                  <Filter className="w-3.5 h-3.5" />
                </div>
                Filters
              </h2>
              {(statusFilter !== "ALL" ||
                typeFilter !== "ALL" ||
                complianceFilter !== "ALL") && (
                <button
                  onClick={clearFilters}
                  className="text-[10px] font-bold text-rose-500 bg-rose-50 px-2 py-1 rounded-md hover:bg-rose-100 transition-colors"
                >
                  Clear
                </button>
              )}
            </div>

            <div className="space-y-6">
              {/* Status Filter */}
              <FilterSection title="Status">
                <FilterCheckbox
                  label="All Status"
                  checked={statusFilter === "ALL"}
                  onChange={() => setStatusFilter("ALL")}
                  count={vendors.length}
                />
                <FilterCheckbox
                  label="Active"
                  checked={statusFilter === "ACTIVE"}
                  onChange={() => setStatusFilter("ACTIVE")}
                  count={getFilterCount((v) => v.isActive)}
                />
                <FilterCheckbox
                  label="Inactive"
                  checked={statusFilter === "INACTIVE"}
                  onChange={() => setStatusFilter("INACTIVE")}
                  count={getFilterCount((v) => !v.isActive)}
                />
              </FilterSection>

              {/* Type Filter */}
              <FilterSection title="Vendor Type">
                <FilterCheckbox
                  label="All Types"
                  checked={typeFilter === "ALL"}
                  onChange={() => setTypeFilter("ALL")}
                />
                <FilterCheckbox
                  label="Goods"
                  checked={typeFilter === "GOODS"}
                  onChange={() => setTypeFilter("GOODS")}
                  count={getFilterCount((v) => v.vendorType === "GOODS")}
                />
                <FilterCheckbox
                  label="Services"
                  checked={typeFilter === "SERVICES"}
                  onChange={() => setTypeFilter("SERVICES")}
                  count={getFilterCount((v) => v.vendorType === "SERVICES")}
                />
              </FilterSection>

              {/* Compliance Filter */}
              <FilterSection title="Compliance">
                <FilterCheckbox
                  label="All Vendors"
                  checked={complianceFilter === "ALL"}
                  onChange={() => setComplianceFilter("ALL")}
                />
                <FilterCheckbox
                  label="GST Compliant"
                  checked={complianceFilter === "COMPLIANT"}
                  onChange={() => setComplianceFilter("COMPLIANT")}
                  count={getFilterCount((v) => !!v.gstin && !!v.pan)}
                />
                <FilterCheckbox
                  label="Incomplete"
                  checked={complianceFilter === "NON_COMPLIANT"}
                  onChange={() => setComplianceFilter("NON_COMPLIANT")}
                  count={getFilterCount((v) => !v.gstin || !v.pan)}
                />
              </FilterSection>
            </div>
          </div>
        </div>

        {/* Right Content Area */}
        <div className="flex-1 w-full space-y-6 min-w-0">
          {/* Search & View Toggle Bar */}
          <div className="bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-2">
            <div className="flex items-center gap-2 flex-1 w-full">
              {/* Sidebar Toggle Button */}
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="hidden lg:flex p-2 hover:bg-slate-100/80 rounded-xl text-slate-500 hover:text-slate-800 transition-colors border border-transparent hover:border-slate-200"
                title={isSidebarOpen ? "Collapse Filters" : "Show Filters"}
              >
                {isSidebarOpen ? (
                  <PanelLeftClose className="w-5 h-5" />
                ) : (
                  <PanelLeftOpen className="w-5 h-5" />
                )}
              </button>

              <div className="relative flex-1 w-full sm:max-w-md ml-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search vendors by name or GSTIN..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-slate-50/50 hover:bg-slate-50 focus:bg-white border-transparent focus:border-emerald-500/20 pl-10 pr-4 py-2 text-sm text-slate-900 placeholder:text-slate-400 rounded-xl transition-all outline-none focus:ring-4 focus:ring-emerald-500/10 group"
                />
              </div>
            </div>

            <div className="h-8 w-px bg-slate-100 hidden sm:block"></div>

            <div className="flex items-center gap-2 w-full sm:w-auto px-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider hidden sm:inline-block mr-2">
                View
              </span>
              <div className="flex bg-slate-100 p-1 rounded-xl w-full sm:w-auto">
                <button
                  onClick={() => setViewMode("list")}
                  className={cn(
                    "flex-1 sm:flex-none px-4 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2",
                    viewMode === "list"
                      ? "bg-white text-slate-900 shadow-sm"
                      : "text-slate-500 hover:text-slate-700",
                  )}
                >
                  <List className="w-4 h-4" />
                  List
                </button>
                <button
                  onClick={() => setViewMode("grid")}
                  className={cn(
                    "flex-1 sm:flex-none px-4 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2",
                    viewMode === "grid"
                      ? "bg-white text-slate-900 shadow-sm"
                      : "text-slate-500 hover:text-slate-700",
                  )}
                >
                  <LayoutGrid className="w-4 h-4" />
                  Grid
                </button>
              </div>
            </div>

            {/* Mobile Filter Toggle */}
            <button
              className="lg:hidden p-2.5 bg-slate-100 rounded-xl text-slate-600 hover:bg-slate-200"
              onClick={() => setShowMobileFilters(!showMobileFilters)}
            >
              <Filter className="w-4 h-4" />
            </button>
          </div>

          {/* Mobile Filters Collapsible */}
          {showMobileFilters && (
            <div className="lg:hidden bg-white rounded-2xl p-4 border border-slate-200 space-y-4">
              <div className="font-bold text-slate-900 mb-2">Filters</div>
              <div className="flex flex-wrap gap-2">
                {/* Simplified Mobile choices */}
                <select
                  value={statusFilter}
                  onChange={(e) =>
                    setStatusFilter(e.target.value as FilterStatus)
                  }
                  className="p-2 rounded-lg border border-slate-200 text-sm bg-slate-50"
                >
                  <option value="ALL">All Status</option>
                  <option value="ACTIVE">Active</option>
                  <option value="INACTIVE">Inactive</option>
                </select>
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value as FilterType)}
                  className="p-2 rounded-lg border border-slate-200 text-sm bg-slate-50"
                >
                  <option value="ALL">All Types</option>
                  <option value="GOODS">Goods</option>
                  <option value="SERVICES">Services</option>
                </select>
              </div>
            </div>
          )}

          {/* Results Area */}
          {loading ? (
            <div className="min-h-[400px] flex flex-col items-center justify-center gap-4 bg-white/50 rounded-3xl border border-dashed border-slate-200">
              <div className="relative">
                <div className="w-12 h-12 rounded-full border-4 border-slate-100 border-t-emerald-500 animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                </div>
              </div>
              <p className="text-sm font-medium text-slate-500 animate-pulse">
                Loading Vendors...
              </p>
            </div>
          ) : filteredVendors.length === 0 ? (
            <div className="min-h-[400px] flex flex-col items-center justify-center bg-white rounded-[2rem] border border-slate-200 p-8 text-center bg-[url('https://grainy-gradients.vercel.app/noise.svg')]">
              <div className="w-24 h-24 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm border border-slate-100 transform rotate-3 transition-transform hover:rotate-6">
                <Search className="w-10 h-10 text-slate-300" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">
                No vendors found
              </h3>
              <p className="text-slate-500 max-w-sm mx-auto mb-8">
                We couldn't find any vendors matching your search. Try adjusting
                filters or keywords.
              </p>
              <button
                onClick={clearFilters}
                className="px-6 py-2.5 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all hover:shadow-lg active:scale-95"
              >
                Clear Filters
              </button>
            </div>
          ) : viewMode === "grid" ? (
            // GRID VIEW
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {filteredVendors.map((vendor) => (
                <VendorCard key={vendor.id} vendor={vendor} />
              ))}
            </div>
          ) : (
            // LIST VIEW
            <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100">
                      <th className="px-8 py-5 font-semibold text-slate-500 text-[11px] uppercase tracking-wider w-[35%]">
                        Vendor Entity
                      </th>
                      <th className="px-6 py-5 font-semibold text-slate-500 text-[11px] uppercase tracking-wider w-[15%]">
                        Category
                      </th>
                      <th className="hidden xl:table-cell px-6 py-5 font-semibold text-slate-500 text-[11px] uppercase tracking-wider w-[25%]">
                        Tax & Compliance
                      </th>
                      <th className="px-6 py-5 font-semibold text-slate-500 text-[11px] uppercase tracking-wider w-[15%]">
                        Status
                      </th>
                      <th className="px-6 py-5 font-semibold text-slate-500 text-[11px] uppercase tracking-wider text-right w-[10%]">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {filteredVendors.map((vendor) => (
                      <tr
                        key={vendor.id}
                        className="group hover:bg-slate-50/80 transition-all duration-200"
                      >
                        <td className="px-8 py-4">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center shadow-sm text-slate-700 font-bold group-hover:bg-gradient-to-br group-hover:from-emerald-500 group-hover:to-emerald-600 group-hover:text-white group-hover:border-transparent transition-all">
                              {vendor.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <div className="font-bold text-slate-900 group-hover:text-emerald-700 transition-colors text-sm">
                                {vendor.name}
                              </div>
                              <div className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
                                {vendor.email || "No email provided"}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={cn(
                              "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold border transition-colors",
                              vendor.vendorType === "GOODS"
                                ? "bg-blue-50 text-blue-700 border-blue-100"
                                : "bg-purple-50 text-purple-700 border-purple-100",
                            )}
                          >
                            {vendor.vendorType === "GOODS" ? (
                              <Package className="w-3 h-3" />
                            ) : (
                              <Briefcase className="w-3 h-3" />
                            )}
                            {vendor.vendorType}
                          </span>
                        </td>
                        <td className="hidden xl:table-cell px-6 py-4">
                          <div className="space-y-1.5">
                            <div className="flex items-center gap-3 text-xs">
                              <span className="text-slate-400 font-bold uppercase tracking-wider w-8 text-[10px]">
                                GSTIN
                              </span>
                              {vendor.gstin ? (
                                <span className="font-mono text-slate-600 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-100 text-[11px]">
                                  {vendor.gstin}
                                </span>
                              ) : (
                                <span className="text-slate-300 italic text-[11px]">
                                  —
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-3 text-xs">
                              <span className="text-slate-400 font-bold uppercase tracking-wider w-8 text-[10px]">
                                PAN
                              </span>
                              <span className="font-mono text-slate-500 text-[11px]">
                                {vendor.pan || "—"}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          {vendor.isActive ? (
                            <div className="inline-flex items-center gap-1.5 bg-emerald-50 border border-emerald-100 text-emerald-700 px-2.5 py-1 rounded-full text-[11px] font-bold">
                              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                              Active
                            </div>
                          ) : (
                            <div className="inline-flex items-center gap-1.5 bg-slate-50 border border-slate-100 text-slate-500 px-2.5 py-1 rounded-full text-[11px] font-bold">
                              <div className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                              Inactive
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 text-right">
                          {(canEdit || canToggleStatus) && (
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <button className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all outline-none focus:ring-2 focus:ring-slate-900/10">
                                  <MoreHorizontal className="w-5 h-5" />
                                </button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent
                                align="end"
                                className="w-48 p-2 bg-white backdrop-blur-3xl border border-slate-100 shadow-xl shadow-slate-200/50 rounded-2xl"
                              >
                                <div className="px-2 py-1.5">
                                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                    Manage
                                  </span>
                                </div>
                                <DropdownMenuSeparator className="bg-slate-100 my-1" />
                                {canEdit && (
                                  <DropdownMenuItem
                                    className="group flex items-center gap-2.5 px-3 py-2 text-sm font-semibold text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg cursor-pointer focus:bg-emerald-50 focus:text-emerald-700 outline-none transition-all duration-200"
                                    onClick={() =>
                                      router.push(
                                        `/dashboard/vendors/${vendor.id}/edit`,
                                      )
                                    }
                                  >
                                    <Edit className="w-4 h-4 text-slate-400 group-hover:text-emerald-500 transition-colors" />
                                    Edit Details
                                  </DropdownMenuItem>
                                )}
                                {canToggleStatus && (
                                  <DropdownMenuItem
                                    className={cn(
                                      "group flex items-center gap-2.5 px-3 py-2 text-sm font-semibold rounded-lg cursor-pointer outline-none transition-all duration-200 mt-1",
                                      vendor.isActive
                                        ? "text-rose-600 hover:bg-rose-50 focus:bg-rose-50 focus:text-rose-700"
                                        : "text-emerald-600 hover:bg-emerald-50 focus:bg-emerald-50 focus:text-emerald-700",
                                    )}
                                    onClick={() => setVendorToToggle(vendor.id)}
                                  >
                                    {vendor.isActive ? (
                                      <>
                                        <Trash2 className="w-4 h-4 text-rose-400 group-hover:text-rose-600 transition-colors" />
                                        Deactivate Vendor
                                      </>
                                    ) : (
                                      <>
                                        <Power className="w-4 h-4 text-emerald-400 group-hover:text-emerald-600 transition-colors" />
                                        Activate Vendor
                                      </>
                                    )}
                                  </DropdownMenuItem>
                                )}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      <AlertDialog
        open={!!vendorToToggle}
        onOpenChange={(open) => !open && setVendorToToggle(null)}
      >
        <AlertDialogContent className="bg-white rounded-2xl shadow-2xl border border-slate-100 p-6">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-bold text-slate-900">
              {vendors.find((v) => v.id === vendorToToggle)?.isActive
                ? "Deactivate Vendor?"
                : "Activate Vendor?"}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-slate-500 text-base font-medium">
              {vendors.find((v) => v.id === vendorToToggle)?.isActive
                ? "Are you sure you want to deactivate this vendor? They will be hidden from lists but preserve their history."
                : "Are you sure you want to activate this vendor? They will become visible and available for new transactions."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-3 mt-6">
            <AlertDialogCancel className="rounded-xl border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-semibold px-5">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleToggleStatus}
              className={cn(
                "text-white rounded-xl shadow-lg px-6 font-bold transition-all active:scale-95",
                vendors.find((v) => v.id === vendorToToggle)?.isActive
                  ? "bg-rose-500 hover:bg-rose-600 shadow-rose-200"
                  : "bg-emerald-500 hover:bg-emerald-600 shadow-emerald-200",
              )}
            >
              {vendors.find((v) => v.id === vendorToToggle)?.isActive
                ? "Yes, Deactivate"
                : "Yes, Activate"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
