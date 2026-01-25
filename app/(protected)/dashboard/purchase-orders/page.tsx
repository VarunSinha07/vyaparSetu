"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { format } from "date-fns";
import {
  FileText,
  Search,
  Loader2,
  ArrowRight,
  CheckCircle2,
  Ban,

} from "lucide-react";

// Types (simplified for list)
interface PurchaseOrdersList {
  id: string;
  poNumber: string;
  totalAmount: number;
  status: "DRAFT" | "ISSUED" | "CANCELLED";
  createdAt: string;
  vendor: { name: string };
  createdBy: { name: string | null };
}

const getStatusBadge = (status: string) => {
  switch (status) {
    case "DRAFT":
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200">
          <FileText className="w-3.5 h-3.5" /> Draft
        </span>
      );
    case "ISSUED":
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
          <CheckCircle2 className="w-3.5 h-3.5" /> Issued
        </span>
      );
    case "CANCELLED":
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-red-50 text-red-700 border border-red-200">
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

  const filteredPos = pos.filter(
    (po) =>
      po.poNumber.toLowerCase().includes(search.toLowerCase()) ||
      po.vendor.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-gray-200/50 pb-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Purchase Orders
          </h1>
          <p className="text-base text-gray-500 max-w-2xl">
            Manage official purchase orders sent to vendors.
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <div className="relative flex-1 max-w-md group">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
          </div>
          <input
            type="text"
            placeholder="Search PO Number or Vendor..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="block w-full rounded-xl border-gray-200 bg-white/50 backdrop-blur-sm py-2.5 pl-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-200 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 focus:bg-white transition-all sm:text-sm"
          />
        </div>
      </div>

      {/* List */}
      <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/20 shadow-xl ring-1 ring-gray-200/50 overflow-hidden">
        {loading ? (
          <div className="p-20 flex flex-col items-center justify-center gap-4 text-gray-400 animate-pulse">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
            <p className="text-sm font-medium text-gray-500">
              Loading orders...
            </p>
          </div>
        ) : filteredPos.length === 0 ? (
          <div className="p-20 text-center text-gray-500">
            No purchase orders found.
          </div>
        ) : (
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50/50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 font-semibold text-gray-900">
                  PO Number
                </th>
                <th className="px-6 py-4 font-semibold text-gray-900">
                  Vendor
                </th>
                <th className="px-6 py-4 font-semibold text-gray-900">
                  Amount
                </th>
                <th className="px-6 py-4 font-semibold text-gray-900">
                  Status
                </th>
                <th className="px-6 py-4 font-semibold text-gray-900">
                  Created
                </th>
                <th className="px-6 py-4 font-semibold text-gray-900 text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredPos.map((po) => (
                <tr
                  key={po.id}
                  className="group hover:bg-slate-50/50 transition-colors"
                >
                  <td className="px-6 py-4 font-mono font-medium text-gray-900">
                    {po.poNumber}
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {po.vendor.name}
                  </td>
                  <td className="px-6 py-4 font-mono">
                    ₹{po.totalAmount.toLocaleString("en-IN")}
                  </td>
                  <td className="px-6 py-4">{getStatusBadge(po.status)}</td>
                  <td className="px-6 py-4 text-xs text-gray-500">
                    {format(new Date(po.createdAt), "MMM d, yyyy")}
                    <div className="text-gray-400 text-[10px] mt-0.5">
                      by {po.createdBy?.name || "Unknown"}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link
                      href={`/dashboard/purchase-orders/${po.id}`}
                      className="inline-flex items-center gap-1 text-sm font-medium text-indigo-600 hover:text-indigo-700 hover:underline"
                    >
                      View <ArrowRight className="w-4 h-4" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
