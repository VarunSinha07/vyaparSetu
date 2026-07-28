"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { format } from "date-fns";
import {
  Loader2,
  FileText,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Clock,
  Building2,
  IndianRupee,
  MoreVertical,
  Eye,
  FileCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Invoice {
  id: string;
  invoiceNumber: string;
  invoiceDate: string;
  vendor: { name: string };
  purchaseOrder: { poNumber: string; totalAmount: number };
  totalAmount: number;
  status: string;
  fileUrl: string;
}

const getStatusBadge = (status: string) => {
  switch (status) {
    case "UPLOADED":
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-600 border border-slate-200">
          <Clock className="w-3.5 h-3.5" /> Uploaded
        </span>
      );
    case "UNDER_VERIFICATION":
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
          <Loader2 className="w-3.5 h-3.5 animate-spin" /> Verifying
        </span>
      );
    case "VERIFIED":
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
          <FileCheck className="w-3.5 h-3.5" /> Verified
        </span>
      );
    case "PAID":
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
          <CheckCircle2 className="w-3.5 h-3.5" /> Paid
        </span>
      );
    case "MISMATCH":
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
          <AlertCircle className="w-3.5 h-3.5" /> Mismatch
        </span>
      );
    case "REJECTED":
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
          <XCircle className="w-3.5 h-3.5" /> Rejected
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-600 border border-slate-200">
          {status.replace("_", " ")}
        </span>
      );
  }
};

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<string | null>(null);

  // Filters State
  const [search, setSearch] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [statusFilters, setStatusFilters] = useState<string[]>([]);
  const [vendorFilters, setVendorFilters] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [roleRes, invoicesRes] = await Promise.all([
          fetch("/api/user/role"),
          fetch("/api/invoices"),
        ]);

        if (roleRes.ok) {
          const roleData = await roleRes.json();
          setUserRole(roleData.role);
        }

        if (invoicesRes.ok) {
          const invoicesData = await invoicesRes.json();
          setInvoices(invoicesData);
        }
      } catch (error) {
        console.error("Failed to fetch data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter Logic
  const uniqueVendors = Array.from(
    new Set(invoices.map((inv) => inv.vendor.name)),
  ).sort();

  const toggleFilter = (
    current: string[],
    item: string,
    setter: (val: string[]) => void,
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

  const filteredInvoices = invoices.filter((inv) => {
    const matchesSearch =
      inv.invoiceNumber.toLowerCase().includes(search.toLowerCase()) ||
      inv.purchaseOrder.poNumber.toLowerCase().includes(search.toLowerCase()) ||
      inv.vendor.name.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      statusFilters.length === 0 || statusFilters.includes(inv.status);

    const matchesVendor =
      vendorFilters.length === 0 || vendorFilters.includes(inv.vendor.name);

    return matchesSearch && matchesStatus && matchesVendor;
  });

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
    <label className="flex items-center gap-3 cursor-pointer group select-none py-1">
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
          "text-sm font-medium transition-colors flex-1 truncate",
          checked ? "text-slate-900" : "text-slate-600",
        )}
      >
        {label}
      </span>
      {count !== undefined && (
        <span className="text-xs text-slate-400 font-medium bg-slate-50 px-1.5 py-0.5 rounded-full ml-2">
          {count}
        </span>
      )}
    </label>
  );

  return (
    <div className="min-h-screen pb-20 relative">
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-emerald-50/50 via-slate-50 to-white pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col gap-6 md:gap-8 pb-8 border-b border-slate-200/60">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900">
              Invoices
            </h1>
            <p className="text-slate-500 font-light text-lg">
              Manage, verify, and track vendor invoices.
            </p>
          </div>
          {userRole === "ADMIN" && (
            <Link href="/dashboard/invoices/upload">
              <Button className="bg-slate-900 text-white hover:bg-emerald-600 shadow-lg shadow-emerald-900/10 transition-all rounded-xl h-12 px-6">
                <Plus className="w-4 h-4 mr-2" /> Upload Invoice
              </Button>
            </Link>
          )}
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start mt-8">
        {/* Sidebar Filters */}
        <div
          className={cn(
            "lg:sticky lg:top-8 transition-all duration-300 ease-in-out space-y-6",
            isSidebarOpen
              ? "lg:w-72 w-full opacity-100"
              : "lg:w-0 w-full lg:opacity-0 lg:overflow-hidden",
          )}
        >
          <div className="bg-white rounded-2xl p-5 border border-slate-200/60 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-slate-800 flex items-center gap-2">
                <Filter className="w-4 h-4 text-emerald-600" />
                Filters
              </h2>
              {(statusFilters.length > 0 || vendorFilters.length > 0) && (
                <button
                  onClick={clearFilters}
                  className="text-xs font-medium text-rose-500 hover:bg-rose-50 px-2 py-1 rounded transition-colors"
                >
                  Clear All
                </button>
              )}
            </div>

            {/* Status Filter */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Status
              </h3>
              <div className="space-y-1">
                {[
                  "UPLOADED",
                  "UNDER_VERIFICATION",
                  "VERIFIED",
                  "MISMATCH",
                  "REJECTED",
                  "PAID",
                ].map((status) => (
                  <FilterCheckbox
                    key={status}
                    label={status
                      .replace("_", " ")
                      .toLowerCase()
                      .replace(/\b\w/g, (l) => l.toUpperCase())}
                    checked={statusFilters.includes(status)}
                    onChange={() =>
                      toggleFilter(statusFilters, status, setStatusFilters)
                    }
                    count={invoices.filter((i) => i.status === status).length}
                  />
                ))}
              </div>
            </div>

            {/* Vendor Filter */}
            {uniqueVendors.length > 0 && (
              <div className="space-y-3 pt-4 border-slate-100 border-t">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Vendor
                </h3>
                <div className="space-y-1 max-h-[200px] overflow-y-auto pr-2 custom-scrollbar">
                  {uniqueVendors.map((vendor) => (
                    <FilterCheckbox
                      key={vendor}
                      label={vendor}
                      checked={vendorFilters.includes(vendor)}
                      onChange={() =>
                        toggleFilter(vendorFilters, vendor, setVendorFilters)
                      }
                      count={
                        invoices.filter((i) => i.vendor.name === vendor).length
                      }
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 w-full space-y-6 min-w-0">
          {/* Controls Bar */}
          <div className="bg-white p-2 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center gap-2">
            <Button
              variant="ghost"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className={cn(
                "hidden lg:flex gap-2 text-slate-600",
                isSidebarOpen && "bg-slate-100 text-slate-900",
              )}
            >
              <Filter className="w-4 h-4" />
              {isSidebarOpen ? "Hide Filters" : "Show Filters"}
            </Button>

            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search by Invoice #, PO # or Vendor..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-transparent hover:bg-slate-50 focus:bg-white border-none pl-10 pr-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 rounded-xl transition-all outline-none ring-0 focus:ring-2 focus:ring-emerald-500/10"
              />
            </div>

            <div className="flex items-center gap-2 px-2 text-sm text-slate-500">
              <span className="font-medium text-slate-900">
                {filteredInvoices.length}
              </span>{" "}
              invoices
            </div>
          </div>

          {/* Table List */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
            {loading ? (
              <div className="p-20 flex flex-col items-center justify-center text-slate-400">
                <Loader2 className="w-10 h-10 animate-spin mb-4 text-emerald-500" />
                <p>Loading invoices...</p>
              </div>
            ) : filteredInvoices.length === 0 ? (
              <div className="p-20 flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                  <FileText className="w-8 h-8 text-slate-300" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900">
                  No invoices found
                </h3>
                <p className="text-slate-500 max-w-sm mt-2">
                  Try adjusting your filters or search terms to find what you're
                  looking for.
                </p>
                <Button
                  variant="link"
                  onClick={clearFilters}
                  className="mt-4 text-emerald-600"
                >
                  Clear all filters
                </Button>
              </div>
            ) : (
              <div className="w-full overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50/50 text-xs uppercase tracking-wider text-slate-500 font-semibold">
                      <th className="px-6 py-4">Invoice Details</th>
                      <th className="px-6 py-4">Vendor</th>
                      <th className="px-6 py-4 text-right">Amount</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredInvoices.map((invoice) => (
                      <tr
                        key={invoice.id}
                        className="group hover:bg-slate-50/80 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <Link
                              href={`/dashboard/invoices/${invoice.id}`}
                              className="font-medium text-slate-900 hover:text-emerald-600 transition-colors"
                            >
                              {invoice.invoiceNumber}
                            </Link>
                            <span className="text-xs text-slate-500 mt-0.5 flex items-center gap-1.5">
                              <span className="font-mono">
                                PO: {invoice.purchaseOrder.poNumber}
                              </span>
                              <span className="w-1 h-1 rounded-full bg-slate-300" />
                              {format(
                                new Date(invoice.invoiceDate),
                                "MMM d, yyyy",
                              )}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0">
                              <Building2 className="w-4 h-4" />
                            </div>
                            <span className="font-medium text-slate-700">
                              {invoice.vendor.name}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <span className="font-mono font-medium text-slate-900">
                            ₹{invoice.totalAmount.toLocaleString("en-IN")}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          {getStatusBadge(invoice.status)}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                className="h-8 w-8 p-0 text-slate-400 hover:text-slate-600"
                              >
                                <MoreVertical className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                              align="end"
                              className="w-[160px]"
                            >
                              <DropdownMenuItem asChild>
                                <Link
                                  href={`/dashboard/invoices/${invoice.id}`}
                                  className="cursor-pointer"
                                >
                                  <Eye className="w-4 h-4 mr-2" /> View Details
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem asChild>
                                <a
                                  href={invoice.fileUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="cursor-pointer"
                                >
                                  <FileText className="w-4 h-4 mr-2" /> View PDF
                                </a>
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
