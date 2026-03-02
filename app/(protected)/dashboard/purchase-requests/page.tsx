"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CompanyRole } from "@/app/generated/prisma/enums";
import {
  FileText,
  Plus,
  Search,
  ArrowRight,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  AlertTriangle,
  Filter,
  Calendar,
  IndianRupee,
  Briefcase,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { PurchaseRequest } from "@/app/generated/prisma/client";
import { cn } from "@/lib/utils";

// Types
type PRStatus =
  | "DRAFT"
  | "SUBMITTED"
  | "UNDER_REVIEW"
  | "APPROVED"
  | "REJECTED";
type PRPriority = "LOW" | "NORMAL" | "HIGH" | "URGENT";

// Helper for status badge
const getStatusBadge = (status: string) => {
  switch (status) {
    case "DRAFT":
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-600 border border-slate-200">
          <FileText className="w-3.5 h-3.5" /> Draft
        </span>
      );
    case "SUBMITTED":
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
          <Clock className="w-3.5 h-3.5" /> Submitted
        </span>
      );
    case "UNDER_REVIEW":
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
          <AlertCircle className="w-3.5 h-3.5" /> In Review
        </span>
      );
    case "APPROVED":
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
          <CheckCircle2 className="w-3.5 h-3.5" /> Approved
        </span>
      );
    case "REJECTED":
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
          <XCircle className="w-3.5 h-3.5" /> Rejected
        </span>
      );
    default:
      return <span>{status}</span>;
  }
};

const getPriorityBadge = (priority: string | null) => {
  switch (priority) {
    case "URGENT":
      return (
        <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wider font-bold text-rose-600 bg-rose-50 px-2 py-1 rounded-lg border border-rose-100">
          <AlertTriangle className="w-3 h-3" /> Urgent
        </span>
      );
    case "HIGH":
      return (
        <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wider font-bold text-orange-600 bg-orange-50 px-2 py-1 rounded-lg border border-orange-100">
          <AlertTriangle className="w-3 h-3" /> High
        </span>
      );
    case "Low":
      return (
        <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wider font-bold text-slate-500 bg-slate-50 px-2 py-1 rounded-lg border border-slate-100">
          Low
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wider font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-100">
          Normal
        </span>
      );
  }
};

export default function PurchaseRequestsPage() {
  const [prs, setPrs] = useState<
    (PurchaseRequest & { createdBy: { name: string } | null })[]
  >([]);
  const [userRole, setUserRole] = useState<CompanyRole | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Filters
  const [statusFilters, setStatusFilters] = useState<PRStatus[]>([]);
  const [priorityFilters, setPriorityFilters] = useState<PRPriority[]>([]);
  const [deptFilters, setDeptFilters] = useState<string[]>([]);

  // Derived Data for Filters
  const uniqueDepartments = Array.from(
    new Set(prs.map((pr) => pr.department)),
  ).sort();

  useEffect(() => {
    fetch("/api/purchase-requests")
      .then((res) => res.json())
      .then((data) => {
        setPrs(data.items);
        setUserRole(data.role);
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
    setPriorityFilters([]);
    setDeptFilters([]);
    setSearch("");
  };

  const filteredPrs = prs.filter((pr) => {
    const matchesSearch =
      pr.title.toLowerCase().includes(search.toLowerCase()) ||
      pr.department.toLowerCase().includes(search.toLowerCase()) ||
      (pr as any).createdById?.toLowerCase().includes(search.toLowerCase()) || // Type assertion for loose check
      pr.createdBy?.name?.toLowerCase().includes(search.toLowerCase()) ||
      pr.id.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      statusFilters.length === 0 ||
      statusFilters.includes(pr.status as PRStatus);
    const matchesPriority =
      priorityFilters.length === 0 ||
      priorityFilters.includes(pr.priority as PRPriority);
    const matchesDept =
      deptFilters.length === 0 || deptFilters.includes(pr.department);

    return matchesSearch && matchesStatus && matchesPriority && matchesDept;
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
              Purchase Requests
            </h1>
            <p className="text-lg text-slate-500 max-w-2xl font-light">
              Submit and track spending requests for approval.
            </p>
          </div>
          {userRole &&
            (
              [
                CompanyRole.ADMIN,
                CompanyRole.PROCUREMENT,
                CompanyRole.EMPLOYEE,
                CompanyRole.MANAGER,
              ] as CompanyRole[]
            ).includes(userRole) && (
              <Link
                href="/dashboard/purchase-requests/new"
                className="inline-flex items-center justify-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-2xl text-sm font-semibold hover:bg-emerald-600 hover:shadow-lg hover:shadow-emerald-200 transition-all duration-300 active:scale-95 group"
              >
                <div className="p-1 rounded-lg bg-white/10 group-hover:bg-white/20 transition-colors">
                  <Plus className="w-4 h-4" />
                </div>
                New Request
              </Link>
            )}
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
              {(statusFilters.length > 0 ||
                priorityFilters.length > 0 ||
                deptFilters.length > 0) && (
                <button
                  onClick={clearFilters}
                  className="text-[10px] font-bold text-rose-500 bg-rose-50 px-2 py-1 rounded-md hover:bg-rose-100 transition-colors"
                >
                  Clear All
                </button>
              )}
            </div>

            <FilterSection title="Status">
              {[
                "DRAFT",
                "SUBMITTED",
                "UNDER_REVIEW",
                "APPROVED",
                "REJECTED",
              ].map((status) => (
                <FilterCheckbox
                  key={status}
                  label={status.replace("_", " ")}
                  checked={statusFilters.includes(status as PRStatus)}
                  onChange={() =>
                    toggleFilter(
                      statusFilters,
                      status as PRStatus,
                      setStatusFilters,
                    )
                  }
                  count={prs.filter((pr) => pr.status === status).length}
                />
              ))}
            </FilterSection>

            <FilterSection title="Priority">
              {["NORMAL", "HIGH", "URGENT"].map((p) => (
                <FilterCheckbox
                  key={p}
                  label={p.charAt(0) + p.slice(1).toLowerCase()}
                  checked={priorityFilters.includes(p as PRPriority)}
                  onChange={() =>
                    toggleFilter(
                      priorityFilters,
                      p as PRPriority,
                      setPriorityFilters,
                    )
                  }
                  count={prs.filter((pr) => pr.priority === p).length}
                />
              ))}
            </FilterSection>

            {uniqueDepartments.length > 0 && (
              <FilterSection title="Department">
                {uniqueDepartments.map((dept) => (
                  <FilterCheckbox
                    key={dept}
                    label={dept}
                    checked={deptFilters.includes(dept)}
                    onChange={() =>
                      toggleFilter(deptFilters, dept, setDeptFilters)
                    }
                    count={prs.filter((pr) => pr.department === dept).length}
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
                  placeholder="Search by title, department or ID..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-slate-50/50 hover:bg-slate-50 focus:bg-white border-transparent focus:border-emerald-500/20 pl-10 pr-4 py-2 text-sm text-slate-900 placeholder:text-slate-400 rounded-xl transition-all outline-none focus:ring-4 focus:ring-emerald-500/10"
                />
              </div>
            </div>
            <div>{/* Placeholder for future sort/view controls */}</div>
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
                Loading Requests...
              </p>
            </div>
          ) : filteredPrs.length === 0 ? (
            <div className="min-h-[400px] flex flex-col items-center justify-center bg-white rounded-[2rem] border border-slate-200 p-8 text-center bg-[url('https://grainy-gradients.vercel.app/noise.svg')]">
              <div className="w-24 h-24 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm border border-slate-100 transform rotate-3 transition-transform hover:rotate-6">
                <FileText className="w-10 h-10 text-slate-300" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">
                No requests found
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
              {filteredPrs.map((pr) => (
                <div
                  key={pr.id}
                  className="group bg-white rounded-2xl border border-slate-200 p-5 hover:border-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/5 transition-all duration-300 relative overflow-hidden"
                >
                  <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                    {/* Icon / Status Indicator */}
                    <div className="flex-shrink-0">
                      <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-600 group-hover:bg-emerald-50 group-hover:text-emerald-600 group-hover:border-emerald-100 transition-all font-bold text-xl shadow-sm">
                        {pr.estimatedCost > 50000 ? (
                          <IndianRupee className="w-6 h-6" />
                        ) : (
                          <FileText className="w-6 h-6" />
                        )}
                      </div>
                    </div>

                    {/* Main Content */}
                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-center gap-3 mb-1">
                        {getPriorityBadge(pr.priority)}
                        <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">
                          #{pr.id.split("-")[0]}
                        </span>
                      </div>

                      <h3 className="text-lg font-bold text-slate-900 truncate pr-10 group-hover:text-emerald-700 transition-colors">
                        {pr.title}
                      </h3>

                      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-500">
                        <span className="flex items-center gap-1.5">
                          <Briefcase className="w-3.5 h-3.5" />
                          {pr.department}
                        </span>
                        <span className="w-1 h-1 rounded-full bg-slate-300" />
                        <span className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5" />
                          {formatDistanceToNow(new Date(pr.createdAt), {
                            addSuffix: true,
                          })}
                        </span>
                        <span className="w-1 h-1 rounded-full bg-slate-300" />
                        <span>
                          By{" "}
                          <span className="font-medium text-slate-700">
                            {pr.createdBy?.name || "Unknown"}
                          </span>
                        </span>
                      </div>
                    </div>

                    {/* Right Side Stats & Action */}
                    <div className="flex flex-row md:flex-col items-center md:items-end gap-3 md:gap-1 w-full md:w-auto mt-4 md:mt-0 pt-4 md:pt-0 border-t md:border-0 border-slate-100">
                      <div className="text-lg font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                        ₹{pr.estimatedCost.toLocaleString("en-IN")}
                      </div>
                      <div className="mb-2">{getStatusBadge(pr.status)}</div>
                      <Link
                        href={`/dashboard/purchase-requests/${pr.id}`}
                        className="hidden md:inline-flex items-center gap-1 text-sm font-semibold text-emerald-600 hover:text-emerald-700 hover:underline mt-1"
                      >
                        View Details <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>

                    {/* Mobile Link Overlay */}
                    <Link
                      href={`/dashboard/purchase-requests/${pr.id}`}
                      className="absolute inset-0 md:hidden"
                    >
                      <span className="sr-only">View Details</span>
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
