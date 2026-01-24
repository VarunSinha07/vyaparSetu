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
} from "lucide-react";
import Link from "next/link";

export default function VendorsPage() {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const res = await fetch("/api/vendors");
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        setVendors(data);
      } catch (error: unknown) {
        toast.error("Could not load vendors");
      } finally {
        setLoading(false);
      }
    };
    fetchVendors();
  }, []);

  const filteredVendors = vendors.filter(
    (v) =>
      v.name.toLowerCase().includes(search.toLowerCase()) ||
      v.gstin?.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="space-y-8">
      {/* Background Decor */}
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-50/50 via-white to-white pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-gray-200/50 pb-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Vendors
          </h1>
          <p className="text-base text-gray-500 max-w-2xl">
            Manage your external suppliers, track their GST details, and handle
            status.
          </p>
        </div>
        <Link
          href="/dashboard/vendors/new"
          className="inline-flex items-center justify-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-200 transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" />
          Add New Vendor
        </Link>
      </div>

      {/* Stats/Filters Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2 relative group">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
          </div>
          <input
            type="text"
            placeholder="Search by vendor name, GSTIN..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="block w-full rounded-xl border-gray-200 bg-white/50 backdrop-blur-sm py-3 pl-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-200 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 focus:bg-white transition-all sm:text-sm"
          />
        </div>
        <div className="flex gap-2">
          <button className="flex-1 inline-flex items-center justify-center gap-2 bg-white px-4 py-2.5 rounded-xl text-sm font-medium text-gray-700 shadow-sm ring-1 ring-inset ring-gray-200 hover:bg-gray-50 transition-all">
            <Filter className="w-4 h-4 text-gray-500" />
            Filter
          </button>
        </div>
      </div>

      {/* Vendors List */}
      <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/20 shadow-xl ring-1 ring-gray-200/50 overflow-hidden">
        {loading ? (
          <div className="p-20 flex flex-col items-center justify-center gap-4 text-gray-400 animate-pulse">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
            <p className="text-sm font-medium text-gray-500">
              Loading vendors...
            </p>
          </div>
        ) : filteredVendors.length === 0 ? (
          <div className="p-20 text-center flex flex-col items-center">
            <div className="w-20 h-20 bg-indigo-50 rounded-3xl flex items-center justify-center mb-6 rotate-3 shadow-inner">
              <Building2 className="w-10 h-10 text-indigo-500" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">
              No vendors found
            </h3>
            <p className="text-gray-500 mt-2 max-w-sm mx-auto">
              No vendors match your search criteria. Try adjusting your filters
              or add a new vendor to get started.
            </p>
            {search && (
              <button
                onClick={() => setSearch("")}
                className="mt-6 text-indigo-600 font-medium hover:text-indigo-700 hover:underline"
              >
                Clear Search
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-600">
              <thead className="bg-gray-50/50 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4 font-semibold text-gray-900">
                    Vendor Entity
                  </th>
                  <th className="px-6 py-4 font-semibold text-gray-900">
                    Category
                  </th>
                  <th className="px-6 py-4 font-semibold text-gray-900">
                    Compliance
                  </th>
                  <th className="px-6 py-4 font-semibold text-gray-900">
                    Status
                  </th>
                  <th className="px-6 py-4 font-semibold text-gray-900 text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredVendors.map((vendor) => (
                  <tr
                    key={vendor.id}
                    className="group hover:bg-indigo-50/30 transition-colors duration-200"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-gray-100 to-white border border-gray-200 flex items-center justify-center shadow-sm">
                          <span className="font-bold text-gray-700 text-lg">
                            {vendor.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900 group-hover:text-indigo-700 transition-colors">
                            {vendor.name}
                          </div>
                          <div className="text-xs text-gray-500 font-medium">
                            {vendor.email || "No contact email"}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${
                          vendor.vendorType === "GOODS"
                            ? "bg-blue-50 text-blue-700 border-blue-200/50"
                            : "bg-purple-50 text-purple-700 border-purple-200/50"
                        }`}
                      >
                        {vendor.vendorType === "GOODS" ? (
                          <Package className="w-3.5 h-3.5" />
                        ) : (
                          <Briefcase className="w-3.5 h-3.5" />
                        )}
                        {vendor.vendorType}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-xs">
                          <span className="text-gray-400 font-medium w-10">
                            GSTIN
                          </span>
                          <span className="font-mono text-gray-700 bg-gray-100 px-1.5 py-0.5 rounded border border-gray-200">
                            {vendor.gstin || "N/A"}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-xs">
                          <span className="text-gray-400 font-medium w-10">
                            PAN
                          </span>
                          <span className="font-mono text-gray-600">
                            {vendor.pan || "N/A"}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {vendor.isActive ? (
                        <div className="flex items-center gap-1.5">
                          <span className="relative flex h-2.5 w-2.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
                          </span>
                          <span className="text-xs font-medium text-green-700">
                            Active
                          </span>
                        </div>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600 border border-gray-200">
                          Inactive
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-white rounded-lg transition-all border border-transparent hover:border-gray-200 hover:shadow-sm">
                        <MoreHorizontal className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
