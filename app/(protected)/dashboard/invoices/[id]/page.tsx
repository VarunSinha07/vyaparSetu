"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import {
  Loader2,
  FileText,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Building2,
  Calendar,
  ExternalLink,
  ArrowLeft,
} from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";

interface DetailInvoice {
  id: string;
  invoiceNumber: string;
  invoiceDate: string;
  fileUrl: string;
  status: string;
  totalAmount: number;
  subtotal: number;
  cgst: number;
  sgst: number;
  igst: number;
  comments?: string;
  vendor: {
    name: string;
    email: string;
    gstin: string;
  };
  purchaseOrder: {
    poNumber: string;
    totalAmount: number;
    paymentTerms: string;
    vendor: {
      name: string;
    };
  };
  uploadedBy: { name: string };
  verifiedBy?: { name: string };
}

export default function InvoiceDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const [invoice, setInvoice] = useState<DetailInvoice | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);

  // Action States
  const [showRejectInput, setShowRejectInput] = useState(false);
  const [showMismatchInput, setShowMismatchInput] = useState(false);
  const [reason, setReason] = useState("");

  useEffect(() => {
    if (id) fetchInvoice();
    fetchRole();
  }, [id]);

  const fetchRole = async () => {
    try {
      const res = await fetch("/api/user/role");
      if (res.ok) {
        const data = await res.json();
        setUserRole(data.role);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchInvoice = async () => {
    try {
      const res = await fetch(`/api/invoices/${id}`);
      if (res.ok) {
        const data = await res.json();
        setInvoice(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (action: "verify" | "mismatch" | "reject") => {
    if ((action === "mismatch" || action === "reject") && !reason) {
      alert("Please provide a reason/comment.");
      return;
    }

    setActionLoading(true);
    try {
      let body = {};
      if (action === "mismatch") body = { comment: reason };
      if (action === "reject") body = { reason: reason };

      const res = await fetch(`/api/invoices/${id}/${action}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg);
      }

      // Reset and refresh
      setShowRejectInput(false);
      setShowMismatchInput(false);
      setReason("");
      fetchInvoice();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (!invoice) return <div>Invoice not found</div>;

  const canVerify =
    userRole === "FINANCE" &&
    (invoice.status === "UPLOADED" || invoice.status === "UNDER_VERIFICATION");

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard/invoices"
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <ArrowLeft className="w-5 h-5 text-gray-500" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              Invoice #{invoice.invoiceNumber}
              <span
                className={`text-sm px-3 py-1 rounded-full border ${
                  invoice.status === "VERIFIED"
                    ? "bg-green-50 text-green-700 border-green-200"
                    : invoice.status === "REJECTED"
                      ? "bg-red-50 text-red-700 border-red-200"
                      : invoice.status === "MISMATCH"
                        ? "bg-orange-50 text-orange-700 border-orange-200"
                        : "bg-blue-50 text-blue-700 border-blue-200"
                }`}
              >
                {invoice.status.replace("_", " ")}
              </span>
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Uploaded on {format(new Date(invoice.invoiceDate), "MMM d, yyyy")}{" "}
              by {invoice.uploadedBy.name}
            </p>
          </div>
        </div>
        {canVerify && (
          <div className="flex gap-3">
            <button
              onClick={() => {
                setShowMismatchInput(true);
                setShowRejectInput(false);
              }}
              className="px-4 py-2 bg-white border border-yellow-300 text-yellow-700 font-medium rounded-lg hover:bg-yellow-50 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2"
            >
              Mark Mismatch
            </button>
            <button
              onClick={() => {
                setShowRejectInput(true);
                setShowMismatchInput(false);
              }}
              className="px-4 py-2 bg-white border border-red-200 text-red-700 font-medium rounded-lg hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            >
              Reject
            </button>
            <button
              onClick={() => handleAction("verify")}
              disabled={actionLoading}
              className="px-4 py-2 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 flex items-center gap-2"
            >
              {actionLoading && <Loader2 className="w-4 h-4 animate-spin" />}
              Verify Invoice
            </button>
          </div>
        )}
      </div>

      {/* Action Inputs */}
      {(showRejectInput || showMismatchInput) && (
        <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 animate-in fade-in slide-in-from-top-2">
          <h3 className="text-sm font-bold text-gray-900 mb-2">
            {showRejectInput ? "Rejection Reason" : "Mismatch Comments"}
          </h3>
          <textarea
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
            rows={3}
            placeholder="Please describe the issue..."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
          <div className="flex justify-end gap-3 mt-3">
            <button
              onClick={() => {
                setShowRejectInput(false);
                setShowMismatchInput(false);
              }}
              className="px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-gray-900"
            >
              Cancel
            </button>
            <button
              onClick={() =>
                handleAction(showRejectInput ? "reject" : "mismatch")
              }
              disabled={!reason || actionLoading}
              className={`px-4 py-1.5 text-sm font-bold text-white rounded-md ${showRejectInput ? "bg-red-600 hover:bg-red-700" : "bg-yellow-600 hover:bg-yellow-700"}`}
            >
              Confirm {showRejectInput ? "Rejection" : "Mismatch"}
            </button>
          </div>
        </div>
      )}

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left: Invoice Details */}
        <div className="bg-white rounded-2xl shadow-sm ring-1 ring-gray-900/5 overflow-hidden">
          <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex justify-between items-center">
            <h2 className="font-semibold text-gray-900 flex items-center gap-2">
              <FileText className="w-5 h-5 text-gray-400" />
              Invoice Details
            </h2>
            <a
              href={invoice.fileUrl}
              target="_blank"
              rel="noreferrer"
              className="text-sm text-indigo-600 hover:underline flex items-center gap-1"
            >
              View PDF <ExternalLink className="w-3 h-3" />
            </a>
          </div>
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider">
                  Vendor
                </p>
                <p className="font-medium text-gray-900 mt-1">
                  {invoice.vendor.name}
                </p>
                <p className="text-sm text-gray-500">{invoice.vendor.gstin}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider">
                  Invoice No
                </p>
                <p className="font-medium text-gray-900 mt-1">
                  {invoice.invoiceNumber}
                </p>
              </div>
            </div>

            <div className="border-t border-gray-100 pt-4">
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-3">
                Amount Breakdown
              </p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Taxable Value</span>
                  <span className="font-medium">
                    ₹{invoice.subtotal.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">CGST</span>
                  <span className="text-gray-900">
                    ₹{(invoice.cgst || 0).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">SGST</span>
                  <span className="text-gray-900">
                    ₹{(invoice.sgst || 0).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">IGST</span>
                  <span className="text-gray-900">
                    ₹{(invoice.igst || 0).toLocaleString()}
                  </span>
                </div>
                <div className="border-t border-gray-100 pt-2 flex justify-between text-base font-bold text-gray-900">
                  <span>Total Amount</span>
                  <span>₹{invoice.totalAmount.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: PO Comparison */}
        <div className="bg-white rounded-2xl shadow-sm ring-1 ring-gray-900/5 overflow-hidden">
          <div className="bg-indigo-50 px-6 py-4 border-b border-indigo-100 flex justify-between items-center">
            <h2 className="font-semibold text-indigo-900 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-indigo-400" />
              Reference PO
            </h2>
            <span className="text-xs font-medium bg-indigo-200 text-indigo-800 px-2 py-1 rounded">
              {invoice.purchaseOrder.poNumber}
            </span>
          </div>
          <div className="p-6 space-y-6">
            <div>
              <h3 className="text-sm font-medium text-gray-900">PO Summary</h3>
              <p className="text-sm text-gray-500 mt-1">
                Issued to {invoice.purchaseOrder.vendor.name}
              </p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600">PO Total Value</span>
                <span className="text-lg font-bold text-gray-900">
                  ₹{invoice.purchaseOrder.totalAmount.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Invoice Total</span>
                <span
                  className={`text-lg font-bold ${invoice.totalAmount > invoice.purchaseOrder.totalAmount ? "text-red-600" : "text-emerald-600"}`}
                >
                  ₹{invoice.totalAmount.toLocaleString()}
                </span>
              </div>
              {invoice.totalAmount > invoice.purchaseOrder.totalAmount && (
                <p className="text-xs text-red-600 mt-2 flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" /> Warning: Invoice amount
                  exceeds PO amount.
                </p>
              )}
            </div>

            {invoice.comments && (
              <div className="border-t border-gray-100 pt-4">
                <h4 className="text-sm font-medium text-red-700 mb-2">
                  Rejection/Mismatch Notes
                </h4>
                <div className="bg-red-50 p-3 rounded-md text-sm text-red-800 border border-red-100">
                  {invoice.comments}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
