import prisma from "@/lib/prisma";
import { format } from "date-fns";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Download,
  CheckCircle2,
  Receipt,
  Building2,
  CreditCard,
  Calendar,
  IndianRupee,
  FileText,
} from "lucide-react";

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
      company: true,
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
    <div className="min-h-[calc(100vh-4rem)] flex flex-col bg-slate-50 relative">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

      {/* Header Toolbar */}
      <div className="bg-white/80 backdrop-blur-md border-b border-slate-200 px-6 py-4 flex items-center justify-between shadow-sm sticky top-0 z-10 shrink-0">
        <div className="flex items-center gap-4">
          <Link
            href={`/dashboard/invoices/${id}`}
            className="group flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
          >
            <div className="p-1.5 rounded-md group-hover:bg-slate-100 transition-colors">
              <ArrowLeft className="w-4 h-4" />
            </div>
            <span>Back to Invoice</span>
          </Link>
          <div className="h-4 w-px bg-slate-200 mx-2" />
          <div className="flex items-center gap-2 px-3 py-1 bg-slate-100 rounded-full border border-slate-200">
            <Receipt className="w-3.5 h-3.5 text-slate-500" />
            <span className="font-mono text-xs font-semibold text-slate-700 tracking-tight">
              #{payment.razorpayPaymentId.slice(-8).toUpperCase()}
            </span>
          </div>
        </div>

        <a
          href={downloadUrl}
          target="_blank"
          className="flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-medium rounded-lg text-sm shadow-lg shadow-slate-200 transition-all focus:ring-2 focus:ring-slate-900 focus:ring-offset-2 hover:-translate-y-0.5"
        >
          <Download className="w-4 h-4" />
          Download Receipt
        </a>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto p-6 md:p-12 flex justify-center items-start z-0">
        {/* Receipt Card */}
        <div className="w-full max-w-2xl bg-white shadow-2xl shadow-slate-200/50 rounded-2xl overflow-hidden border border-slate-100 relative group transition-all duration-300 hover:shadow-emerald-100/50">
          <div className="bg-emerald-50/50 border-b border-emerald-100/50 p-4 flex justify-between items-center backdrop-blur-sm">
            <div className="flex items-center gap-2 text-emerald-700 font-medium text-sm">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 fill-emerald-100" />
              Payment Successful
            </div>
            <div className="text-xs text-slate-400 font-medium tracking-wide flex items-center gap-1">
              Powered by{" "}
              <span className="font-bold text-slate-600">VyaparFlow</span>
            </div>
          </div>

          <div className="p-8 md:p-10 space-y-10">
            {/* Payment Header */}
            <div className="flex justify-between items-end pb-8 border-b border-slate-100 border-dashed">
              <div>
                <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
                  ₹{invoice.totalAmount.toLocaleString("en-IN")}
                </h1>
                <p className="text-sm font-medium text-slate-500 mt-1">
                  Total Paid Amount
                </p>
              </div>
              <div className="text-right">
                <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center ml-auto mb-2 border border-slate-100">
                  <CreditCard className="w-6 h-6 text-slate-400" />
                </div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                  Method
                </p>
                <p className="text-sm font-medium text-slate-900">
                  Online Trans.
                </p>
              </div>
            </div>

            {/* Details Grid */}
            <div className="grid md:grid-cols-2 gap-10">
              {/* Payer Info */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <Building2 className="w-3 h-3" /> From
                </h3>
                <div className="pl-3 border-l-2 border-slate-100">
                  <p className="font-bold text-slate-900">
                    {invoice.company.name}
                  </p>
                  <p className="text-sm text-slate-500 mt-0.5">
                    {invoice.company.address || "Address Not Available"}
                  </p>
                  <p className="text-sm text-slate-500">
                    {invoice.company.phone || "Phone Not Available"}
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    {invoice.company.email || "Email Not Available"}
                  </p>
                  {invoice.company.gstin && (
                    <div className="mt-2 inline-flex items-center px-2 py-1 bg-slate-50 rounded text-xs text-slate-600 border border-slate-100">
                      <span className="font-semibold mr-1">GSTIN:</span>{" "}
                      {invoice.company.gstin}
                    </div>
                  )}
                </div>
              </div>

              {/* Payee Info */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <Building2 className="w-3 h-3" /> To
                </h3>
                <div className="pl-3 border-l-2 border-slate-100">
                  <p className="font-bold text-slate-900">
                    {invoice.vendor.name}
                  </p>
                  <p className="text-sm text-slate-500 mt-0.5">
                    {invoice.vendor.email}
                  </p>
                  <div className="mt-2 inline-flex items-center px-2 py-1 bg-slate-50 rounded text-xs text-slate-600 border border-slate-100">
                    <span className="font-semibold mr-1">GSTIN:</span>{" "}
                    {invoice.vendor.gstin}
                  </div>
                </div>
              </div>
            </div>

            {/* Transaction Details */}
            <div className="bg-slate-50 rounded-xl p-6 border border-slate-100">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
                Transaction Details
              </h3>

              <div className="space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-500">Transaction ID</span>
                  <span className="font-mono font-medium text-slate-900 select-all">
                    {payment.razorpayPaymentId}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-500">Invoice Number</span>
                  <Link
                    href={`/dashboard/invoices/${id}`}
                    className="font-medium text-emerald-600 hover:underline decoration-emerald-600/30 underline-offset-4"
                  >
                    #{invoice.invoiceNumber}
                  </Link>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-500">Date & Time</span>
                  <span className="font-medium text-slate-900">
                    {format(new Date(payment.paidAt), "PPP p")}
                  </span>
                </div>

                <div className="my-3 border-t border-slate-200 border-dashed" />

                <div className="flex justify-between items-center font-bold text-slate-900 text-lg">
                  <span>Total Paid</span>
                  <span>₹{invoice.totalAmount.toLocaleString("en-IN")}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Card Footer */}
          <div className="bg-slate-50 border-t border-slate-100 p-6 flex flex-col items-center justify-center text-center gap-2">
            <div className="w-full flex items-center gap-4 text-xs text-slate-400 mb-2 px-8">
              <div className="h-px bg-slate-200 flex-1" />
              <span className="uppercase tracking-widest font-semibold text-[10px]">
                End of Receipt
              </span>
              <div className="h-px bg-slate-200 flex-1" />
            </div>
            <p className="text-xs text-slate-500 max-w-md">
              This is a system-generated receipt. For any questions, please
              contact support@vyaparflow.com quoting the Transaction ID above.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
