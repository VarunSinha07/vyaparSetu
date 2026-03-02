"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import {
  FileText,
  Building2,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Clock,
  Send,
  UserCheck,
  Calendar,
  MoreVertical,
  Paperclip,
  Download,
  Printer,
  Edit,
  Phone,
  Mail,
  ShieldCheck,
  Tag,
  History,
} from "lucide-react";
import { format } from "date-fns";
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

// Timeline Component
function Timeline({ events }: { events: TimelineEvent[] }) {
  return (
    <div className="space-y-4">
      {events.length === 0 ? (
        <p className="text-sm text-slate-500 text-center py-8">
          No timeline events yet
        </p>
      ) : (
        events.map((event, index) => (
          <div key={event.id} className="flex gap-4 relative">
            <div className="flex flex-col items-center">
              <div className="w-3 h-3 rounded-full bg-emerald-500 mt-1.5"></div>
              {index < events.length - 1 && (
                <div className="w-0.5 h-12 bg-slate-200 my-2"></div>
              )}
            </div>
            <div className="pb-4">
              <p className="text-sm font-semibold text-slate-900">
                {event.action}
              </p>
              <p className="text-xs text-slate-500">
                by {event.actor} • {format(new Date(event.timestamp), "PPpp")}
              </p>
              {event.metadata && (
                <p className="text-xs text-slate-600 mt-1">
                  {JSON.stringify(event.metadata)}
                </p>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
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
  purchaseOrder: { id: string; poNumber: string } | null;
}

interface TimelineEvent {
  id: string;
  action: string;
  actor: string;
  timestamp: string;
  metadata?: Record<string, unknown>;
}

interface PRDetailsViewProps {
  pr: PRWithRelations;
  currentUser: {
    id: string; // profilId
    role: CompanyRole;
    userId: string; // auth id
  };
  timeline: TimelineEvent[];
}

export default function PRDetailsView({
  pr: initialPr,
  currentUser,
  timeline,
}: PRDetailsViewProps) {
  const router = useRouter();
  const [pr] = useState<PRWithRelations>(initialPr);
  const [loading, setLoading] = useState(false);
  const [confirmState, setConfirmState] = useState<{
    isOpen: boolean;
    action: "submit" | "review" | "approve" | "reject" | null;
  }>({ isOpen: false, action: null });
  const [rejectReason, setRejectReason] = useState("");

  // Status Badge Helper
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "DRAFT":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide bg-slate-100 text-slate-600 border border-slate-200">
            <FileText className="w-3.5 h-3.5" /> Draft
          </span>
        );
      case "SUBMITTED":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide bg-blue-50 text-blue-700 border border-blue-200">
            <Clock className="w-3.5 h-3.5" /> Submitted
          </span>
        );
      case "UNDER_REVIEW":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide bg-amber-50 text-amber-700 border border-amber-200">
            <AlertCircle className="w-3.5 h-3.5" /> In Review
          </span>
        );
      case "APPROVED":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5" /> Approved
          </span>
        );
      case "REJECTED":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide bg-rose-50 text-rose-700 border border-rose-200">
            <XCircle className="w-3.5 h-3.5" /> Rejected
          </span>
        );
      default:
        return null;
    }
  };

  const getPriorityColor = (priority: string | null) => {
    switch (priority) {
      case "URGENT":
        return "text-rose-600 bg-rose-50 border-rose-200";
      case "HIGH":
        return "text-orange-600 bg-orange-50 border-orange-200";
      default:
        return "text-emerald-600 bg-emerald-50 border-emerald-200";
    }
  };

  // Action Handlers
  const openConfirm = (action: "submit" | "review" | "approve" | "reject") => {
    setConfirmState({ isOpen: true, action });
    setRejectReason("");
  };

  const handleExecuteAction = async () => {
    const action = confirmState.action;
    if (!action) return;

    let body = {};
    if (action === "reject") {
      if (!rejectReason) {
        toast.error("Rejection reason is required");
        return;
      }
      body = { reason: rejectReason };
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
      setConfirmState({ ...confirmState, isOpen: false });
      router.refresh();
      window.location.reload();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePO = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/purchase-orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ purchaseRequestId: pr.id }),
      });

      if (!res.ok) throw new Error(await res.text());

      const po = await res.json();
      toast.success("Purchase Order created successfully");
      router.push(`/dashboard/purchase-orders/${po.id}`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Creation failed");
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
  const canCreatePO =
    pr.status === "APPROVED" &&
    !pr.purchaseOrder &&
    (currentUser.role === "ADMIN" || currentUser.role === "PROCUREMENT");

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-20">
      {/* Header Section */}
      <div className="flex flex-col gap-6">
        {/* Breadcrumb & Back */}
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <Link
            href="/dashboard/purchase-requests"
            className="hover:text-slate-900 transition-colors"
          >
            Purchase Requests
          </Link>
          <span>/</span>
          <span className="text-slate-900 font-medium">
            {pr.id.substring(0, 8)}...
          </span>
        </div>

        {/* Title & Actions Bar */}
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
          <div className="space-y-4">
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
              {pr.title}
            </h1>
            <div className="flex flex-wrap items-center gap-3">
              {getStatusBadge(pr.status)}
              <span className="text-sm text-slate-500 flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-50 border border-slate-100">
                <Calendar className="w-3.5 h-3.5" />
                Created {format(new Date(pr.createdAt), "PPP")}
              </span>
              <span className="text-sm text-slate-500 flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-50 border border-slate-100">
                <UserCheck className="w-3.5 h-3.5" />
                {pr.createdBy.name}
              </span>
            </div>
          </div>

          {/* Action Toolbar */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Primary Actions */}
            {canSubmit && (
              <Button
                onClick={() => openConfirm("submit")}
                disabled={loading}
                className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-200/50 transition-all active:scale-95"
              >
                <Send className="w-4 h-4 mr-2" /> Submit Request
              </Button>
            )}

            {canReview && (
              <Button
                onClick={() => openConfirm("review")}
                disabled={loading}
                className="bg-amber-500 hover:bg-amber-600 text-white shadow-lg shadow-amber-200/50 transition-all active:scale-95"
              >
                <UserCheck className="w-4 h-4 mr-2" /> Start Review
              </Button>
            )}

            {canDecide && (
              <div className="flex items-center gap-2 bg-white p-1 rounded-lg border border-slate-200 shadow-sm">
                <Button
                  onClick={() => openConfirm("approve")}
                  disabled={loading}
                  variant="ghost"
                  className="text-emerald-700 hover:text-emerald-800 hover:bg-emerald-50"
                >
                  <CheckCircle2 className="w-4 h-4 mr-2" /> Approve
                </Button>
                <Separator orientation="vertical" className="h-4" />
                <Button
                  onClick={() => openConfirm("reject")}
                  disabled={loading}
                  variant="ghost"
                  className="text-rose-700 hover:text-rose-800 hover:bg-rose-50"
                >
                  <XCircle className="w-4 h-4 mr-2" /> Reject
                </Button>
              </div>
            )}

            {canCreatePO && (
              <Button
                onClick={handleCreatePO}
                disabled={loading}
                className="bg-slate-900 hover:bg-slate-800 text-white shadow-lg shadow-slate-200/50 transition-all active:scale-95"
              >
                <FileText className="w-4 h-4 mr-2" /> Create PO
              </Button>
            )}

            {pr.purchaseOrder && (
              <Link href={`/dashboard/purchase-orders/${pr.purchaseOrder.id}`}>
                <Button variant="outline" className="gap-2 border-slate-200">
                  <FileText className="w-4 h-4 text-emerald-600" /> View PO
                </Button>
              </Link>
            )}

            {/* Context Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="w-10 h-10">
                  <MoreVertical className="w-4 h-4 text-slate-500" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                {canEdit && (
                  <DropdownMenuItem asChild>
                    <Link href={`/dashboard/purchase-requests/${pr.id}/edit`}>
                      <Edit className="w-4 h-4 mr-2" /> Edit Request
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem onClick={() => window.print()}>
                  <Printer className="w-4 h-4 mr-2" /> Print Details
                </DropdownMenuItem>
                {/* Add delete option if needed */}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Column (Content) */}
        <div className="lg:col-span-2 space-y-8">
          {/* Request Overview Card */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="border-b border-slate-100 p-6 flex justify-between items-center bg-slate-50/50">
              <h2 className="font-semibold text-slate-900 flex items-center gap-2">
                <FileText className="w-4 h-4 text-emerald-600" />
                Request Details
              </h2>
              {/* Optional: Add item count or total badge */}
            </div>

            <div className="p-6 space-y-8">
              {/* Description */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                  Description & Justification
                </h3>
                <p className="text-sm leading-relaxed text-slate-700 bg-slate-50 p-4 rounded-xl border border-slate-100">
                  {pr.description || "No specific description provided."}
                </p>
              </div>

              {/* Line Items Table (Simulated for this object structure) */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                  Items Requested
                </h3>
                <div className="border border-slate-200 rounded-xl overflow-hidden">
                  <table className="w-full text-sm text-left">
                    <thead className="text-xs text-slate-500 bg-slate-50 border-b border-slate-200 uppercase">
                      <tr>
                        <th className="px-4 py-3 font-medium">Item Name</th>
                        <th className="px-4 py-3 font-medium text-right">
                          Qty
                        </th>
                        <th className="px-4 py-3 font-medium text-right">
                          Unit Price
                        </th>
                        <th className="px-4 py-3 font-medium text-right">
                          Total
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 bg-white">
                      <tr>
                        <td className="px-4 py-4 font-medium text-slate-900">
                          {pr.itemName || pr.title}
                        </td>
                        <td className="px-4 py-4 text-right text-slate-600">
                          {pr.quantity || 1}
                        </td>
                        <td className="px-4 py-4 text-right text-slate-600">
                          ₹
                          {(pr.unitPrice || pr.estimatedCost).toLocaleString(
                            "en-IN",
                          )}
                        </td>
                        <td className="px-4 py-4 text-right font-bold text-slate-900 bg-emerald-50/30">
                          ₹{pr.estimatedCost.toLocaleString("en-IN")}
                        </td>
                      </tr>
                    </tbody>
                    <tfoot className="bg-slate-50 border-t border-slate-200">
                      <tr>
                        <td
                          colSpan={3}
                          className="px-4 py-3 text-right text-xs font-bold text-slate-500 uppercase"
                        >
                          Total Estimated Cost
                        </td>
                        <td className="px-4 py-3 text-right font-bold text-emerald-700 text-lg">
                          ₹{pr.estimatedCost.toLocaleString("en-IN")}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>

              {/* Attachments */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <Paperclip className="w-3.5 h-3.5" /> Attachments
                </h3>
                {pr.attachments && pr.attachments.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {pr.attachments.map((file, i) => (
                      <a
                        key={i}
                        href={file}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 hover:border-emerald-500/50 hover:bg-emerald-50/10 hover:shadow-sm transition-all group"
                      >
                        <div className="bg-slate-100 p-2 rounded-lg group-hover:bg-emerald-100 group-hover:text-emerald-600 transition-colors">
                          <FileText className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-slate-700 truncate group-hover:text-emerald-700">
                            Attachment-{i + 1}
                          </p>
                          <p className="text-xs text-slate-400">
                            Click to view
                          </p>
                        </div>
                        <Download className="w-4 h-4 text-slate-400 group-hover:text-emerald-500" />
                      </a>
                    ))}
                  </div>
                ) : (
                  <div className="p-6 border border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center text-center gap-2 bg-slate-50/50">
                    <Paperclip className="w-8 h-8 text-slate-300" />
                    <p className="text-sm text-slate-500 font-medium">
                      No documents attached
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Timeline / Audit Logs */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="border-b border-slate-100 p-6 bg-slate-50/50">
              <h2 className="font-semibold text-slate-900 flex items-center gap-2">
                <History className="w-4 h-4 text-blue-500" />
                Audit Trail
              </h2>
            </div>
            <div className="p-6 max-h-[500px] overflow-y-auto custom-scrollbar">
              <Timeline events={timeline} />
            </div>
          </div>
        </div>

        {/* Right Column (Meta & Sidebar) */}
        <div className="space-y-6">
          {/* Status & Priority Card */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                Request Status
              </h3>
              <div className="flex items-center justify-between">
                <div>
                  <div className="mb-1">{getStatusBadge(pr.status)}</div>
                  {pr.priority && (
                    <span
                      className={cn(
                        "text-[10px] font-bold px-2 py-0.5 rounded border ml-1",
                        getPriorityColor(pr.priority),
                      )}
                    >
                      {pr.priority} Priority
                    </span>
                  )}
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-slate-50 rounded-lg text-slate-500">
                  <Building2 className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-medium">
                    Department
                  </p>
                  <p className="text-sm font-semibold text-slate-900">
                    {pr.department}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 bg-slate-50 rounded-lg text-slate-500">
                  <Tag className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-medium">
                    Budget Category
                  </p>
                  <p className="text-sm font-semibold text-slate-900">
                    {pr.budgetCategory || "Uncategorized"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 bg-slate-50 rounded-lg text-slate-500">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-medium">
                    Required By
                  </p>
                  <p className="text-sm font-semibold text-slate-900">
                    {pr.requiredBy
                      ? format(new Date(pr.requiredBy), "PP")
                      : "ASAP"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Preferred Vendor Card */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <h3 className="font-semibold text-slate-900 text-sm">
                Preferred Vendor
              </h3>
            </div>
            <div className="p-5">
              {pr.preferredVendor ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-lg">
                      {pr.preferredVendor.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">
                        {pr.preferredVendor.name}
                      </p>
                      <p className="text-xs text-slate-500">
                        {pr.preferredVendor.vendorType}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-2 pt-2">
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Mail className="w-3.5 h-3.5 text-slate-400" />
                      <a
                        href={`mailto:${pr.preferredVendor.email}`}
                        className="hover:text-emerald-600 hover:underline"
                      >
                        {pr.preferredVendor.email}
                      </a>
                    </div>
                    {pr.preferredVendor.phone && (
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <Phone className="w-3.5 h-3.5 text-slate-400" />
                        <span>{pr.preferredVendor.phone}</span>
                      </div>
                    )}
                  </div>
                  <Link
                    href={`/dashboard/vendors`}
                    className="block text-center mt-2 text-xs font-semibold text-emerald-600 hover:text-emerald-700 hover:underline"
                  >
                    View Vendor Profile
                  </Link>
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-sm text-slate-500 italic">
                    No vendor specified
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Rejection Note (Conditional) */}
          {pr.status === "REJECTED" && pr.rejectionReason && (
            <div className="bg-rose-50 rounded-2xl border border-rose-100 p-5">
              <h3 className="text-rose-800 font-bold text-sm mb-2 flex items-center gap-2">
                <XCircle className="w-4 h-4" /> Rejection Reason
              </h3>
              <p className="text-sm text-rose-700 leading-relaxed">
                {pr.rejectionReason}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Confirmation Dialogs */}
      <AlertDialog
        open={confirmState.isOpen}
        onOpenChange={(open) =>
          !loading && setConfirmState((prev) => ({ ...prev, isOpen: open }))
        }
      >
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl">
              {confirmState.action === "reject"
                ? "Reject Purchase Request"
                : `Confirm ${confirmState.action}`}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-slate-500">
              {confirmState.action === "reject" ? (
                <div className="space-y-4 pt-2">
                  <p>
                    Are you sure you want to reject this request? This action
                    cannot be undone. Please provide a reason below.
                  </p>
                  <textarea
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    placeholder="E.g., Budget exceeded, item not necessary..."
                    className="w-full min-h-[100px] p-3 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 resize-none"
                    autoFocus
                  />
                </div>
              ) : (
                `Are you sure you want to proceed? This will move the request to the next stage in the workflow.`
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2">
            <AlertDialogCancel disabled={loading} className="rounded-xl">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                handleExecuteAction();
              }}
              disabled={
                loading ||
                (confirmState.action === "reject" && !rejectReason.trim())
              }
              className={cn(
                "rounded-xl",
                confirmState.action === "reject"
                  ? "bg-rose-600 hover:bg-rose-700 focus:ring-rose-600"
                  : "bg-emerald-600 hover:bg-emerald-700 focus:ring-emerald-600",
              )}
            >
              {loading
                ? "Processing..."
                : confirmState.action === "reject"
                  ? "Reject Request"
                  : "Confirm Action"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
