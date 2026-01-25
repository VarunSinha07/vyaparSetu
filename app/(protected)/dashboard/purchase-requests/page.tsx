"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  FileText,
  Plus,
  Search,
  Loader2,
  ArrowRight,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  AlertTriangle,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { PurchaseRequest } from "@/app/generated/prisma/client";

// Helper for status badge
const getStatusBadge = (status: string) => {
  switch (status) {
    case "DRAFT":
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200">
          <FileText className="w-3.5 h-3.5" /> Draft
        </span>
      );
    case "SUBMITTED":
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
          <Clock className="w-3.5 h-3.5" /> Submitted
        </span>
      );
    case "UNDER_REVIEW":
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">
          <AlertCircle className="w-3.5 h-3.5" /> In Review
        </span>
      );
    case "APPROVED":
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
          <CheckCircle2 className="w-3.5 h-3.5" /> Approved
        </span>
      );
    case "REJECTED":
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-red-50 text-red-700 border border-red-200">
          <XCircle className="w-3.5 h-3.5" /> Rejected
        </span>
      );
    default:
      return <span>{status}</span>;
  }
};

const getPriorityBadge = (priority: string | null) => {
  if (priority === "URGENT") {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-full border border-red-100">
        <AlertTriangle className="w-3 h-3" /> Urgent
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 text-xs font-medium text-gray-500 bg-gray-50 px-2 py-0.5 rounded-full border border-gray-100">
      Normal
    </span>
  );
};

export default function PurchaseRequestsPage() {
  const [prs, setPrs] = useState<
    (PurchaseRequest & { createdBy: { name: string } | null })[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/api/purchase-requests")
      .then((res) => res.json())
      .then((data) => {
        setPrs(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const filteredPrs = prs.filter(
    (pr) =>
      pr.title.toLowerCase().includes(search.toLowerCase()) ||
      pr.department.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-gray-200/50 pb-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Purchase Requests
          </h1>
          <p className="text-base text-gray-500 max-w-2xl">
            Track and manage internal spending requests.
          </p>
        </div>
        <Link
          href="/dashboard/purchase-requests/new"
          className="inline-flex items-center justify-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-200 transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" />
          New Request
        </Link>
      </div>

      {/* Filters (simplified for now) */}
      <div className="flex gap-4">
        <div className="relative flex-1 max-w-md group">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
          </div>
          <input
            type="text"
            placeholder="Search by title or department..."
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
              Loading requests...
            </p>
          </div>
        ) : filteredPrs.length === 0 ? (
          <div className="p-20 text-center text-gray-500">
            No purchase requests found.
          </div>
        ) : (
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50/50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 font-semibold text-gray-900">
                  Priority
                </th>
                <th className="px-6 py-4 font-semibold text-gray-900">Title</th>
                <th className="px-6 py-4 font-semibold text-gray-900">
                  Department
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
                <th className="px-6 py-4 font-semibold text-gray-900 text-right"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredPrs.map((pr) => (
                <tr
                  key={pr.id}
                  className="group hover:bg-indigo-50/30 transition-colors"
                >
                  <td className="px-6 py-4 w-[100px]">
                    {getPriorityBadge(pr.priority)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-semibold text-gray-900">
                      {pr.title}
                    </div>
                    <div className="text-xs text-gray-400">
                      ID: {pr.id.slice(0, 8)}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200">
                      {pr.department}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-mono text-gray-900 font-medium">
                    ₹{pr.estimatedCost.toLocaleString("en-IN")}
                  </td>
                  <td className="px-6 py-4">{getStatusBadge(pr.status)}</td>
                  <td className="px-6 py-4 text-xs text-gray-500">
                    {formatDistanceToNow(new Date(pr.createdAt), {
                      addSuffix: true,
                    })}
                    <div className="text-gray-400">
                      by {pr.createdBy?.name || "Unknown"}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link
                      href={`/dashboard/purchase-requests/${pr.id}`}
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
