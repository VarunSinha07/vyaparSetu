import prisma from "@/lib/prisma";
import { format } from "date-fns";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Download, CheckCircle2 } from "lucide-react";

// Format currency helper
const formatCurrency = (amount: number) => {
  return (
    "Rs. " +
    amount.toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  );
};

export default async function ReceiptPage(props: {
  params: Promise<{ id: string }>;
}) {
  const params = await props.params;
  const { id } = params;

  // Fetch invoice details with payment and vendor info
  const invoice = await prisma.invoice.findUnique({
    where: { id },
    include: {
      vendor: true,
      payments: {
        where: { status: "SUCCESS" },
        take: 1,
      },
      purchaseOrder: true,
    },
  });

  if (!invoice || invoice.payments.length === 0) {
    return notFound();
  }

  const payment = invoice.payments[0];
  const downloadUrl = `/api/invoices/${id}/receipt?download=true`;

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col bg-gray-50 overflow-hidden">
      {/* Header Toolbar */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between shadow-sm z-10 shrink-0">
        <div className="flex items-center gap-4">
          <Link
            href={`/dashboard/invoices/${id}`}
            className="p-2 hover:bg-gray-100 rounded-full text-gray-500 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Payment Receipt</h1>
            <p className="text-sm text-gray-500">Official transaction record</p>
          </div>
        </div>

        <div className="flex gap-3">
          <a
            href={downloadUrl}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 shadow-sm transition-colors"
          >
            <Download className="w-4 h-4" />
            Download PDF
          </a>
        </div>
      </div>

      {/* Main Scrollable Area */}
      <div className="flex-1 overflow-auto p-8 flex justify-center">
        {/* Receipt Card (Mimics the PDF Design) */}
        <div className="w-full max-w-3xl bg-white shadow-xl rounded-xl border border-gray-100 overflow-hidden h-fit mb-8">
          {/* Receipt Header */}
          <div className="flex flex-row justify-between p-10 bg-slate-50 border-b border-slate-100">
            <div>
              <div className="text-3xl font-bold text-indigo-600 tracking-tight">
                VyaparSetu
              </div>
              <div className="text-xs text-slate-500 mt-1 uppercase tracking-wide">
                Finance Automation Platform
              </div>
            </div>
            <div className="flex items-center">
              <div className="text-2xl font-black text-slate-300 tracking-[0.2em] uppercase">
                Receipt
              </div>
            </div>
          </div>

          <div className="p-10">
            {/* Status Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-50 rounded-md mb-8 border border-green-100">
              <CheckCircle2 className="w-4 h-4 text-green-700" />
              <span className="text-xs font-bold text-green-800 uppercase tracking-wide">
                Payment Successful
              </span>
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-2 gap-12 mb-10">
              {/* Paid To */}
              <div>
                <div className="text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-2">
                  Paid To
                </div>
                <div className="text-slate-900 font-bold text-lg mb-1">
                  {invoice.vendor.name}
                </div>
                <div className="text-slate-600 text-sm mb-1">
                  {invoice.vendor.email}
                </div>
                {invoice.vendor.gstin && (
                  <div className="text-slate-600 text-sm">
                    GSTIN: {invoice.vendor.gstin}
                  </div>
                )}
              </div>

              {/* Payment Details */}
              <div>
                <div className="text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-4">
                  Transaction Details
                </div>

                <div className="grid grid-cols-2 gap-x-4 gap-y-4">
                  <div>
                    <div className="text-[10px] text-slate-400 uppercase tracking-wide mb-1">
                      Date Paid
                    </div>
                    <div className="text-slate-700 text-sm font-medium">
                      {payment.paidAt
                        ? format(new Date(payment.paidAt), "dd MMM yyyy")
                        : "-"}
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400 uppercase tracking-wide mb-1">
                      Transaction ID
                    </div>
                    <div
                      className="text-slate-700 text-sm font-mono tracking-tighttruncate"
                      title={payment.razorpayPaymentId || "-"}
                    >
                      {payment.razorpayPaymentId?.slice(-12) || "-"}...
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400 uppercase tracking-wide mb-1">
                      Invoice Ref
                    </div>
                    <div className="text-slate-700 text-sm font-medium">
                      #{invoice.invoiceNumber}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Line Items Table */}
            <div className="mt-4 mb-8">
              {/* Table Header */}
              <div className="flex bg-slate-50 py-3 px-4 rounded-t-lg border-b border-slate-100">
                <div className="flex-grow text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  Description
                </div>
                <div className="w-32 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  Reference
                </div>
                <div className="w-32 text-right text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  Amount
                </div>
              </div>

              {/* Table Row */}
              <div className="flex py-4 px-4 border-b border-slate-50">
                <div className="flex-grow text-sm text-slate-700">
                  Payment for Invoice{" "}
                  <span className="font-medium">#{invoice.invoiceNumber}</span>
                </div>
                <div className="w-32 text-sm text-slate-500 font-mono text-xs pt-0.5">
                  {invoice.invoiceNumber}
                </div>
                <div className="w-32 text-right text-sm font-bold text-slate-900">
                  {formatCurrency(payment.amount)}
                </div>
              </div>
            </div>

            {/* Total Box */}
            <div className="flex justify-end">
              <div className="bg-slate-50 border border-slate-100 rounded-lg p-6 w-64 text-right">
                <div className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold mb-1">
                  Total Paid
                </div>
                <div className="text-2xl font-bold text-indigo-600">
                  {formatCurrency(payment.amount)}
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-white border-t border-slate-50 p-8">
            <div className="text-center text-[10px] text-slate-400 leading-relaxed">
              This receipt is electronically generated and is valid without a
              signature.
              <br />
              Generated on {format(new Date(), "PPP")} via VyaparSetu Platform.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
