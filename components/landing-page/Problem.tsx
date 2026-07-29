"use client";

import { AlertCircle, CheckCircle2, FileX, ShieldCheck, XCircle, Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";

export function Problem() {
  return (
    <section className="py-24 bg-white border-b border-emerald-100 relative overflow-hidden">
      {/* Background Accent */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-100/40 rounded-full blur-[100px] pointer-events-none" />

      <div className="container mx-auto px-6 lg:px-12 max-w-6xl relative z-10">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-extrabold">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>Before vs. After Transformation</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
            Why Indian MSMEs Switch to VyaparFlow
          </h2>

          <p className="text-slate-600 text-base font-normal">
            See how automating your spend lifecycle replaces manual paperwork and invoice leakages with complete audit-ready clarity.
          </p>
        </div>

        {/* Side-by-Side Comparison Cards */}
        <div className="grid md:grid-cols-2 gap-8 items-stretch">
          {/* Old Way Card */}
          <div className="bg-gradient-to-br from-rose-50/80 to-orange-50/40 border border-rose-200 rounded-3xl p-8 space-y-6 flex flex-col justify-between shadow-xs">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-rose-100 text-rose-700 shadow-2xs">
                  <XCircle className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-extrabold text-slate-900">The Old Manual Way</h3>
                  <p className="text-xs text-rose-700 font-bold">Paper receipts, WhatsApp threads & Excel</p>
                </div>
              </div>

              <div className="space-y-3.5 text-xs text-slate-700 font-medium">
                {[
                  "Approvals lost in WhatsApp chats with zero audit history.",
                  "Duplicate or overstated vendor bills slip through manual checks.",
                  "Lost GST input tax credits due to unverified supplier tax filings.",
                  "Finance team spends 5+ days reconciling POs and bank transfers.",
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3.5 bg-white/90 rounded-xl border border-rose-200/80 shadow-2xs">
                    <XCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-rose-200 text-xs text-rose-800 font-bold flex items-center justify-between">
              <span>Result: Invoice leakage & compliance risk</span>
              <span className="px-2.5 py-0.5 bg-rose-100 rounded-md text-[10px] uppercase">Manual Chaos</span>
            </div>
          </div>

          {/* VyaparFlow Way Card */}
          <div className="bg-gradient-to-br from-emerald-50/90 via-teal-50/40 to-white border-2 border-emerald-300 rounded-3xl p-8 space-y-6 flex flex-col justify-between shadow-lg shadow-emerald-900/5">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-emerald-600 text-white shadow-sm">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-extrabold text-slate-900">The VyaparFlow Engine</h3>
                  <p className="text-xs text-emerald-800 font-bold">Automated 3-way match & GST verified</p>
                </div>
              </div>

              <div className="space-y-3.5 text-xs text-slate-800 font-semibold">
                {[
                  "Role-based approval hierarchy with 1-click approvals & full logs.",
                  "Automated 3-way matching (PO vs. GRN vs. Invoice) stops overpayments.",
                  "Real-time GSTIN & e-Way verification guarantees 100% tax credit.",
                  "Release vendor payouts directly via Razorpay/UPI in minutes.",
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3.5 bg-white rounded-xl border border-emerald-200 shadow-2xs">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span className="text-slate-900">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-emerald-200 text-xs text-emerald-900 font-extrabold flex items-center justify-between">
              <span>Result: 100% spend control & 5x faster cycle</span>
              <span className="px-2.5 py-0.5 bg-emerald-200/80 rounded-md text-[10px] uppercase text-emerald-900">Audit Ready</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
