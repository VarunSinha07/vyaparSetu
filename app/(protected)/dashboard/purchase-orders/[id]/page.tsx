"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { format } from "date-fns";
import { toast } from "sonner";
import {
  Printer,
  Send,
  Save,
  Loader2,
  Building2,
  Mail,
  FileText,
  User,
  History,
  AlertCircle,
  CheckCircle2,
  Ban,
  Phone,
  Edit2,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { Timeline } from "@/components/ui/timeline";
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
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

type POStatus = "DRAFT" | "ISSUED" | "CANCELLED";

interface TimelineEvent {
  id: string;
  action: string;
  actor: string;
  timestamp: string;
  metadata?: Record<string, unknown>;
}

interface PODetails {
  id: string;
  poNumber: string;
  status: POStatus;
  totalAmount: number;
  paymentTerms: string | null;
  notes: string | null;
  createdAt: string;
  issuedAt: string | null;
  vendor: {
    name: string;
    email: string | null;
    address: string | null;
    gstin: string | null;
    phone: string | null;
  };
  createdBy: { name: string; email: string };
  issuedBy: { name: string; email: string } | null;
  purchaseRequest: {
    id: string;
    title: string;
    description: string | null;
    department: string;
    itemName: string | null;
    quantity: number | null;
    unitPrice: number | null;
  };
  company: {
    name: string;
    address: string | null;
    email: string | null;
    phone: string | null;
    gstin: string | null;
  };
}

export default function PODetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const [po, setPo] = useState<PODetails | null>(null);
  const [timeline, setTimeline] = useState<TimelineEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  // Edit State
  const [isEditing, setIsEditing] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    paymentTerms: "",
    notes: "",
  });

  useEffect(() => {
    // Fetch PO details
    fetch(`/api/purchase-orders/${params.id}`)
      .then((res) => res.json())
      .then((data) => {
        setPo(data);
        setEditForm({
          paymentTerms: data.paymentTerms || "",
          notes: data.notes || "",
        });
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });

    // Fetch timeline
    fetch(`/api/purchase-orders/${params.id}/timeline`)
      .then((res) => res.json())
      .then((data) => setTimeline(data))
      .catch((err) => console.error("Failed to fetch timeline:", err));
  }, [params.id]);

  const handleUpdate = async () => {
    setActionLoading(true);
    try {
      const res = await fetch(`/api/purchase-orders/${params.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      });

      if (!res.ok) throw new Error(await res.text());

      toast.success("Purchase Order updated");
      setIsEditing(false);

      // Update local state without full reload
      setPo((prev) =>
        prev
          ? {
              ...prev,
              paymentTerms: editForm.paymentTerms,
              notes: editForm.notes,
            }
          : null,
      );
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Update failed");
    } finally {
      setActionLoading(false);
    }
  };

  const handleIssueClick = () => {
    setIsConfirmOpen(true);
  };

  const handleIssueConfirm = async () => {
    setActionLoading(true);
    setIsConfirmOpen(false); // Close dialog immediately

    try {
      const res = await fetch(`/api/purchase-orders/${params.id}/issue`, {
        method: "POST",
      });

      if (!res.ok) throw new Error(await res.text());

      toast.success("Purchase Order ISSUED successfully");
      const updated = await res.json();
      setPo(updated);

      // Refresh timeline too
      fetch(`/api/purchase-orders/${params.id}/timeline`)
        .then((res) => res.json())
        .then((data) => setTimeline(data));
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Issue failed");
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "DRAFT":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide bg-slate-100 text-slate-600 border border-slate-200">
            <FileText className="w-3.5 h-3.5" /> Draft
          </span>
        );
      case "ISSUED":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5" /> Issued
          </span>
        );
      case "CANCELLED":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide bg-rose-50 text-rose-700 border border-rose-200">
            <Ban className="w-3.5 h-3.5" /> Void
          </span>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="w-10 h-10 animate-spin text-emerald-600" />
        <p className="text-slate-500 font-medium animate-pulse">
          Loading Purchase Order...
        </p>
      </div>
    );
  }

  if (!po) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
        <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center">
          <FileText className="w-10 h-10 text-slate-400" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900">
          Purchase Order Not Found
        </h2>
        <Link href="/dashboard/purchase-orders">
          <Button variant="outline">Back to Orders</Button>
        </Link>
      </div>
    );
  }

  const isDraft = po.status === "DRAFT";

  return (
    <div className="max-w-7xl mx-auto pb-20 space-y-8">
      {/* Header Section */}
      <div className="flex flex-col gap-6 print:hidden">
        {/* Breadcrumb & Back */}
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <Link
            href="/dashboard/purchase-orders"
            className="hover:text-slate-900 transition-colors"
          >
            Purchase Orders
          </Link>
          <span>/</span>
          <span className="text-slate-900 font-medium">{po.poNumber}</span>
        </div>

        {/* Title & Actions Bar */}
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <h1 className="text-3xl font-bold text-slate-900 tracking-tight font-mono">
                {po.poNumber}
              </h1>
              {getStatusBadge(po.status)}
            </div>

            <p className="text-slate-500 flex items-center gap-2">
              Created on {format(new Date(po.createdAt), "PPP")}
            </p>
          </div>

          {/* Action Toolbar */}
          <div className="flex flex-wrap items-center gap-3">
            <Button
              variant="outline"
              onClick={() => window.print()}
              className="gap-2 border-slate-200 text-slate-700"
            >
              <Printer className="w-4 h-4" /> Print
            </Button>

            {isDraft && !isEditing && (
              <Button
                variant="outline"
                onClick={() => setIsEditing(true)}
                className="gap-2 border-slate-200 text-slate-700"
              >
                <Edit2 className="w-4 h-4" /> Edit Terms
              </Button>
            )}

            {isDraft && isEditing && (
              <>
                <Button
                  variant="ghost"
                  onClick={() => {
                    setIsEditing(false);
                    setEditForm({
                      paymentTerms: po.paymentTerms || "",
                      notes: po.notes || "",
                    });
                  }}
                  className="text-slate-500"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleUpdate}
                  disabled={actionLoading}
                  className="gap-2 bg-slate-900 text-white hover:bg-slate-800"
                >
                  <Save className="w-4 h-4" /> Save Changes
                </Button>
              </>
            )}

            {isDraft && (
              <Button
                onClick={handleIssueClick}
                disabled={actionLoading || isEditing}
                className="gap-2 bg-emerald-600 text-white hover:bg-emerald-700 shadow-lg shadow-emerald-200/50"
              >
                <Send className="w-4 h-4" /> Issue Order
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Column (Main Document) */}
        <div className="lg:col-span-2 space-y-8">
          {/* Document Card */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden print:shadow-none print:border-none">
            {/* Header Strip */}
            <div className="bg-slate-50/50 border-b border-slate-100 p-6 flex justify-between items-center print:hidden">
              <h2 className="font-semibold text-slate-900 flex items-center gap-2">
                <FileText className="w-4 h-4 text-emerald-600" />
                Order Details
              </h2>
            </div>

            <div className="p-8 space-y-8 print:p-0">
              {/* Addresses Grid */}
              <div className="grid grid-cols-2 gap-12">
                {/* Bill To / Company */}
                <div className="space-y-4">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                    Bill To
                  </h3>
                  <div className="space-y-1">
                    <p className="font-bold text-slate-900 text-lg">
                      {po.company.name}
                    </p>
                    <p className="text-sm text-slate-600 whitespace-pre-line">
                      {po.company.address || "Address not available"}
                    </p>
                    {po.company.gstin && (
                      <p className="text-sm text-slate-600 pt-2">
                        GSTIN: {po.company.gstin}
                      </p>
                    )}
                    <div className="pt-2 space-y-1">
                      {po.company.email && (
                        <div className="flex items-center gap-2 text-sm text-slate-500">
                          <Mail className="w-3.5 h-3.5" /> {po.company.email}
                        </div>
                      )}
                      {po.company.phone && (
                        <div className="flex items-center gap-2 text-sm text-slate-500">
                          <Phone className="w-3.5 h-3.5" /> {po.company.phone}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Ship From / Vendor */}
                <div className="space-y-4">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                    Vendor
                  </h3>
                  <div className="space-y-1">
                    <p className="font-bold text-slate-900 text-lg">
                      {po.vendor.name}
                    </p>
                    <p className="text-sm text-slate-600 whitespace-pre-line">
                      {po.vendor.address || "Address not available"}
                    </p>
                    {po.vendor.gstin && (
                      <p className="text-sm text-slate-600 pt-2">
                        GSTIN: {po.vendor.gstin}
                      </p>
                    )}
                    <div className="pt-2 space-y-1">
                      {po.vendor.email && (
                        <div className="flex items-center gap-2 text-sm text-slate-500">
                          <Mail className="w-3.5 h-3.5" /> {po.vendor.email}
                        </div>
                      )}
                      {po.vendor.phone && (
                        <div className="flex items-center gap-2 text-sm text-slate-500">
                          <Phone className="w-3.5 h-3.5" /> {po.vendor.phone}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Line Items Table */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                  Line Items
                </h3>
                <div className="border border-slate-200 rounded-lg overflow-hidden">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-slate-50 border-b border-slate-200 text-xs uppercase text-slate-500 font-semibold">
                      <tr>
                        <th className="px-4 py-3">Description</th>
                        <th className="px-4 py-3 text-right">Qty</th>
                        <th className="px-4 py-3 text-right">Unit Price</th>
                        <th className="px-4 py-3 text-right">Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      <tr>
                        <td className="px-4 py-4">
                          <p className="font-medium text-slate-900">
                            {po.purchaseRequest.itemName ||
                              po.purchaseRequest.title}
                          </p>
                          <p className="text-xs text-slate-500 mt-0.5">
                            PR Ref: {po.purchaseRequest.title}
                          </p>
                        </td>
                        <td className="px-4 py-4 text-right text-slate-600">
                          {po.purchaseRequest.quantity || 1}
                        </td>
                        <td className="px-4 py-4 text-right text-slate-600">
                          ₹
                          {(
                            po.purchaseRequest.unitPrice || po.totalAmount
                          ).toLocaleString("en-IN")}
                        </td>
                        <td className="px-4 py-4 text-right font-medium text-slate-900">
                          ₹{po.totalAmount.toLocaleString("en-IN")}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Totals */}
                <div className="flex justify-end pt-4">
                  <div className="w-full sm:w-1/2 lg:w-1/3 space-y-3">
                    <div className="flex justify-between items-center py-2 border-b border-slate-100 text-sm">
                      <span className="text-slate-500">Subtotal</span>
                      <span className="font-medium text-slate-900">
                        ₹{po.totalAmount.toLocaleString("en-IN")}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2 text-base">
                      <span className="font-bold text-slate-900">Total</span>
                      <span className="font-bold text-emerald-700 text-xl">
                        ₹{po.totalAmount.toLocaleString("en-IN")}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Terms & Notes (Editable) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                    Payment Terms
                  </h3>
                  {isEditing ? (
                    <textarea
                      value={editForm.paymentTerms}
                      onChange={(e) =>
                        setEditForm((prev) => ({
                          ...prev,
                          paymentTerms: e.target.value,
                        }))
                      }
                      className="w-full p-3 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none"
                      rows={3}
                      placeholder="Enter payment terms (e.g. Net 30)"
                    />
                  ) : (
                    <p className="text-sm text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-100 min-h-[80px]">
                      {po.paymentTerms || "No specific payment terms defined."}
                    </p>
                  )}
                </div>

                <div className="space-y-3">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                    Notes / Instructions
                  </h3>
                  {isEditing ? (
                    <textarea
                      value={editForm.notes}
                      onChange={(e) =>
                        setEditForm((prev) => ({
                          ...prev,
                          notes: e.target.value,
                        }))
                      }
                      className="w-full p-3 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none"
                      rows={3}
                      placeholder="Enter internal notes or instructions..."
                    />
                  ) : (
                    <p className="text-sm text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-100 min-h-[80px]">
                      {po.notes || "No additional notes."}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (Sidebar) */}
        <div className="space-y-6 print:hidden">
          {/* Status Card */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              Order Status
            </h3>
            <div>{getStatusBadge(po.status)}</div>
            {po.issuedAt && (
              <p className="text-xs text-slate-500 flex items-center gap-1.5 bg-emerald-50/50 p-2 rounded border border-emerald-100 text-emerald-700">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Issued on {format(new Date(po.issuedAt), "PPP")}
              </p>
            )}
          </div>

          {/* Meta Card */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-6">
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                Created By
              </h3>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                  <User className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-900">
                    {po.createdBy.name}
                  </p>
                  <p className="text-xs text-slate-500">{po.createdBy.email}</p>
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-3">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                Department
              </h3>
              <div className="flex items-center gap-2 text-sm text-slate-700">
                <Building2 className="w-4 h-4 text-slate-400" />
                {po.purchaseRequest.department}
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
              <History className="w-3.5 h-3.5" /> Audit History
            </h3>
            <div className="max-h-[400px] overflow-y-auto">
              <Timeline events={timeline} />
            </div>
          </div>

          {/* Footer Help */}
          <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
            <h4 className="text-sm font-semibold text-blue-900 flex items-center gap-2 mb-1">
              <AlertCircle className="w-4 h-4" /> Need Help?
            </h4>
            <p className="text-xs text-blue-700 mb-2">
              Contact procurement for changes to issued orders.
            </p>
            <a
              href="mailto:support@vyaparflow.com"
              className="text-xs font-semibold text-blue-800 hover:underline"
            >
              Contact Support
            </a>
          </div>
        </div>
      </div>

      <AlertDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Issue Purchase Order?</AlertDialogTitle>
            <AlertDialogDescription>
              This will finalize the order and change its status to{" "}
              <strong>ISSUED</strong>. The vendor will be notified and no
              further edits can be made.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={actionLoading}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                handleIssueConfirm();
              }}
              className="bg-emerald-600 hover:bg-emerald-700"
              disabled={actionLoading}
            >
              {actionLoading ? "Issuing..." : "Confirm Issue"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
