"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import {
  ArrowLeft,
  FileText,
  Building2,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Clock,
  Send,
  UserCheck,
  Calendar,
  DollarSign,
} from "lucide-react";
import { format } from "date-fns";
import {
  PurchaseRequest,
  CompanyRole,
  Vendor,
  UserProfile,
  Approval,
} from "@/app/generated/prisma/client";

// Define strict types for the full PR object with relations
interface PRWithRelations extends PurchaseRequest {
  createdBy: UserProfile;
  preferredVendor: Vendor | null;
  approvals: (Approval & { approver: UserProfile })[];
}

interface PRDetailsViewProps {
  pr: PRWithRelations;
  currentUser: {
    id: string; // profilId
    role: CompanyRole;
    userId: string; // auth id
  };
}

export default function PRDetailsView({
  pr: initialPr,
  currentUser,
}: PRDetailsViewProps) {
  const router = useRouter();
  const [pr] = useState<PRWithRelations>(initialPr);
  const [loading, setLoading] = useState(false);

  // Status Badge Helper
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "DRAFT":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-700 border border-gray-200">
            <FileText className="w-4 h-4" /> Draft
          </span>
        );
      case "SUBMITTED":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium bg-blue-50 text-blue-700 border border-blue-200">
            <Clock className="w-4 h-4" /> Submitted
          </span>
        );
      case "UNDER_REVIEW":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium bg-amber-50 text-amber-700 border border-amber-200">
            <AlertCircle className="w-4 h-4" /> Under Review
          </span>
        );
      case "APPROVED":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-4 h-4" /> Approved
          </span>
        );
      case "REJECTED":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium bg-red-50 text-red-700 border border-red-200">
            <XCircle className="w-4 h-4" /> Rejected
          </span>
        );
      default:
        return null;
    }
  };

  // Action Handlers
  const handleAction = async (
    action: "submit" | "review" | "approve" | "reject",
  ) => {
    if (!confirm(`Are you sure you want to ${action} this request?`)) return; // Simple confirm for now

    // For reject, prompt for reason
    let body = {};
    if (action === "reject") {
      const reason = prompt("Please provide a rejection reason:");
      if (!reason) return;
      body = { reason };
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/purchase-requests/${pr.id}/${action}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        throw new Error(await res.text());
      }

      toast.success(`Request ${action} successful`);

      // Ideally re-fetch or update local state logic
      // Refreshing the page is safest to get new server state
      router.refresh();
      window.location.reload(); // Hard reload to ensure data freshness
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  // Permission Logic
  const canEdit =
    pr.status === "DRAFT" &&
    (currentUser.role === "ADMIN" || currentUser.id === pr.createdById);
  const canSubmit =
    pr.status === "DRAFT" &&
    (currentUser.role === "ADMIN" || currentUser.role === "PROCUREMENT");
  const canReview =
    pr.status === "SUBMITTED" &&
    (currentUser.role === "ADMIN" || currentUser.role === "MANAGER");
  const canDecide =
    (pr.status === "SUBMITTED" || pr.status === "UNDER_REVIEW") &&
    (currentUser.role === "ADMIN" || currentUser.role === "MANAGER");

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200/50 pb-6">
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard/purchase-requests"
            className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-gray-900">{pr.title}</h1>
              {getStatusBadge(pr.status)}
            </div>
            <p className="text-sm text-gray-500 mt-1">
              Created on {format(new Date(pr.createdAt), "PPP")} by{" "}
              <span className="font-medium text-gray-700">
                {pr.createdBy.name}
              </span>
            </p>
          </div>
        </div>

        {/* Action Buttons Toolbar */}
        <div className="flex gap-2">
          {canEdit && (
            <Link
              href={`/dashboard/purchase-requests/${pr.id}/edit`}
              className="inline-flex items-center gap-2 bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-xl text-sm font-medium hover:bg-gray-50 transition-all"
            >
              <FileText className="w-4 h-4" /> Edit Request
            </Link>
          )}

          {canSubmit && (
            <button
              onClick={() => handleAction("submit")}
              disabled={loading}
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-blue-700 transition-all disabled:opacity-50"
            >
              <Send className="w-4 h-4" /> Submit Request
            </button>
          )}

          {canReview && (
            <button
              onClick={() => handleAction("review")}
              disabled={loading}
              className="inline-flex items-center gap-2 bg-amber-500 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-amber-600 transition-all disabled:opacity-50"
            >
              <UserCheck className="w-4 h-4" /> Review
            </button>
          )}

          {canDecide && (
            <>
              <button
                onClick={() => handleAction("reject")}
                disabled={loading}
                className="inline-flex items-center gap-2 bg-white border border-red-200 text-red-600 px-4 py-2 rounded-xl text-sm font-medium hover:bg-red-50 transition-all disabled:opacity-50"
              >
                <XCircle className="w-4 h-4" /> Reject
              </button>
              <button
                onClick={() => handleAction("approve")}
                disabled={loading}
                className="inline-flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-emerald-700 transition-all disabled:opacity-50"
              >
                <CheckCircle2 className="w-4 h-4" /> Approve
              </button>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Column: Details */}
        <div className="md:col-span-2 space-y-8">
          {/* Main Attributes */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-6">
            <h2 className="text-lg font-semibold text-gray-900 border-b border-gray-50 pb-3">
              Request Overview
            </h2>

            <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Department
                </label>
                <p className="mt-1 text-sm font-medium text-gray-900 flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-gray-400" />{" "}
                  {pr.department}
                </p>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Priority
                </label>
                <p
                  className={`mt-1 text-sm font-medium flex items-center gap-2 ${pr.priority === "URGENT" ? "text-red-600" : "text-gray-900"}`}
                >
                  {pr.priority === "URGENT" ? (
                    <AlertCircle className="w-4 h-4 text-red-600" />
                  ) : (
                    <Clock className="w-4 h-4 text-gray-400" />
                  )}
                  {pr.priority}
                </p>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Required By
                </label>
                <p className="mt-1 text-sm font-medium text-gray-900 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  {pr.requiredBy
                    ? format(new Date(pr.requiredBy), "PPP")
                    : "Not specified"}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 pt-4 border-t border-gray-50">
              <div>
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Estimated Amount
                </label>
                <p className="mt-1 text-xl font-bold text-gray-900 font-mono">
                  ₹{pr.estimatedCost.toLocaleString("en-IN")}
                </p>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Budget Category
                </label>
                <p className="mt-1 text-sm font-medium text-gray-900 flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-gray-400" />
                  {pr.budgetCategory || "Not specified"}
                </p>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Justification
              </label>
              <div className="mt-2 p-4 bg-gray-50 rounded-xl text-sm text-gray-700 leading-relaxed border border-gray-100">
                {pr.description || "No description provided."}
              </div>
            </div>

            {/* Rejection Reason display */}
            {pr.status === "REJECTED" && pr.rejectionReason && (
              <div className="bg-red-50 p-4 rounded-xl border border-red-100">
                <h3 className="text-red-800 font-semibold text-sm flex items-center gap-2">
                  <XCircle className="w-4 h-4" /> Rejection Reason
                </h3>
                <p className="text-red-600 text-sm mt-1">
                  {pr.rejectionReason}
                </p>
              </div>
            )}
          </div>

          {/* Vendor Info */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
            <h2 className="text-lg font-semibold text-gray-900 border-b border-gray-50 pb-3">
              Vendor Information
            </h2>
            <div>
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Preferred Vendor
              </label>
              {pr.preferredVendor ? (
                <div className="mt-2 flex items-center justify-between p-3 bg-blue-50/50 rounded-lg border border-blue-100">
                  <div>
                    <p className="text-sm text-blue-900 font-semibold hover:underline">
                      <Link href={`/dashboard/vendors`}>
                        {pr.preferredVendor.name}
                      </Link>
                    </p>
                    <p className="text-xs text-blue-700 mt-0.5">
                      {pr.preferredVendor.vendorType} •{" "}
                      {pr.preferredVendor.email}
                    </p>
                  </div>
                </div>
              ) : (
                <p className="mt-1 text-sm text-gray-400 italic">
                  No preference specified
                </p>
              )}
            </div>
          </div>

          {/* Attachments (Placeholder) */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
            <h2 className="text-lg font-semibold text-gray-900 border-b border-gray-50 pb-3">
              Attachments
            </h2>
            <div className="p-8 border-2 border-dashed border-gray-100 rounded-xl flex flex-col items-center justify-center text-center">
              <FileText className="w-10 h-10 text-gray-200 mb-2" />
              <p className="text-sm text-gray-400">No documents attached.</p>
            </div>
          </div>
        </div>

        {/* Right Column: Timeline / Audit */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Approval Chain
            </h2>
            <div className="space-y-6 relative before:absolute before:inset-y-0 before:left-2 before:w-0.5 before:bg-gray-100">
              {/* Creator Node */}
              <div className="relative pl-6">
                <div className="absolute left-0 top-1 p-1 bg-white border border-gray-200 rounded-full">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                </div>
                <p className="text-sm font-medium text-gray-900">
                  Request Created
                </p>
                <p className="text-xs text-gray-500">
                  {format(new Date(pr.createdAt), "MMM d, h:mm a")}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  by {pr.createdBy.name}
                </p>
              </div>

              {/* Approvals List */}
              {pr.approvals.map((approval) => (
                <div key={approval.id} className="relative pl-6">
                  <div className="absolute left-0 top-1 p-1 bg-white border border-gray-200 rounded-full">
                    <div
                      className={`w-2 h-2 rounded-full ${approval.status === "APPROVED" ? "bg-emerald-500" : "bg-red-500"}`}
                    ></div>
                  </div>
                  <p className="text-sm font-medium text-gray-900">
                    {approval.status === "APPROVED" ? "Approved" : "Rejected"}
                  </p>
                  <p className="text-xs text-gray-500">
                    {approval.approvedAt
                      ? format(new Date(approval.approvedAt), "MMM d, h:mm a")
                      : "Pending"}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    by {approval.approver.name}
                  </p>
                  {approval.comment && (
                    <p className="text-xs bg-gray-50 p-2 mt-1 rounded border border-gray-100 text-gray-600 italic">
                      &quot;{approval.comment}&quot;
                    </p>
                  )}
                </div>
              ))}

              {/* Pending State */}
              {pr.status !== "APPROVED" && pr.status !== "REJECTED" && (
                <div className="relative pl-6 opacity-50">
                  <div className="absolute left-0 top-1 p-1 bg-white border border-gray-200 rounded-full">
                    <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                  </div>
                  <p className="text-sm text-gray-500 italic">
                    Pending Decision...
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
