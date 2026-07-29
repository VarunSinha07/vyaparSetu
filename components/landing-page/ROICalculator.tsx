"use client";

import { useState } from "react";
import { Calculator, IndianRupee, Clock, ShieldAlert, ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";

export function ROICalculator() {
  const [invoiceCount, setInvoiceCount] = useState<number>(75);
  const [avgInvoiceValue, setAvgInvoiceValue] = useState<number>(40000);

  const totalVolume = invoiceCount * avgInvoiceValue;
  const hoursSaved = Math.round(invoiceCount * 0.45);
  const leakagesPrevented = Math.round(totalVolume * 0.022);
  const totalSavingsPerMonth = leakagesPrevented + hoursSaved * 350;

  return (
    <section className="py-24 bg-white border-b border-emerald-100 relative overflow-hidden">
      <div className="container mx-auto px-6 lg:px-12 max-w-5xl relative z-10">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-extrabold">
            <Calculator className="w-3.5 h-3.5 text-emerald-600" />
            <span>Interactive Financial Calculator</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            See How Much Your Company Saves Every Month
          </h2>
          <p className="text-slate-600 text-base font-normal">
            Adjust the sliders below to estimate time recovered and invoice leakages prevented with VyaparFlow.
          </p>
        </div>

        <div className="bg-gradient-to-br from-emerald-50/60 via-teal-50/30 to-white border-2 border-emerald-200/90 rounded-3xl p-8 lg:p-10 shadow-lg shadow-emerald-900/5 grid lg:grid-cols-12 gap-10 items-center">
          {/* Sliders Area */}
          <div className="lg:col-span-7 space-y-8">
            <div className="space-y-4">
              <div className="flex justify-between items-center text-sm font-extrabold text-slate-900">
                <span>Monthly Vendor Invoices</span>
                <span className="bg-white px-3.5 py-1 rounded-xl border border-emerald-300 text-emerald-800 font-extrabold shadow-2xs">
                  {invoiceCount} Invoices
                </span>
              </div>
              <input
                type="range"
                min="10"
                max="500"
                step="5"
                value={invoiceCount}
                onChange={(e) => setInvoiceCount(Number(e.target.value))}
                className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
              />
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center text-sm font-extrabold text-slate-900">
                <span>Average Invoice Value (₹)</span>
                <span className="bg-white px-3.5 py-1 rounded-xl border border-teal-300 text-teal-800 font-extrabold shadow-2xs">
                  ₹{avgInvoiceValue.toLocaleString("en-IN")}
                </span>
              </div>
              <input
                type="range"
                min="5000"
                max="200000"
                step="5000"
                value={avgInvoiceValue}
                onChange={(e) => setAvgInvoiceValue(Number(e.target.value))}
                className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-teal-600"
              />
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-emerald-200/80">
              <div className="bg-white p-4 rounded-2xl border border-emerald-200 shadow-2xs">
                <div className="flex items-center gap-1.5 text-xs text-slate-600 font-bold mb-1">
                  <Clock className="w-4 h-4 text-emerald-600" />
                  <span>Manual Hours Saved</span>
                </div>
                <div className="text-xl font-extrabold text-slate-900">{hoursSaved} hrs / mo</div>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-teal-200 shadow-2xs">
                <div className="flex items-center gap-1.5 text-xs text-slate-600 font-bold mb-1">
                  <ShieldAlert className="w-4 h-4 text-teal-600" />
                  <span>Leakage Prevented</span>
                </div>
                <div className="text-xl font-extrabold text-slate-900">₹{leakagesPrevented.toLocaleString("en-IN")}</div>
              </div>
            </div>
          </div>

          {/* Vibrant Results Summary Box (No Black) */}
          <div className="lg:col-span-5 bg-gradient-to-br from-emerald-600 via-teal-600 to-emerald-700 text-white p-8 rounded-3xl text-center space-y-6 shadow-xl shadow-emerald-900/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 px-3 py-1 bg-white/20 rounded-bl-xl text-[10px] font-extrabold uppercase text-white">
              Net Savings
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold text-emerald-100 uppercase tracking-wider">
                Estimated Net Monthly Savings
              </span>
              <div className="text-4xl font-extrabold text-white flex items-center justify-center tracking-tight">
                <IndianRupee className="w-8 h-8 text-white" />
                {totalSavingsPerMonth.toLocaleString("en-IN")}
              </div>
              <p className="text-[11px] text-emerald-100/90 font-medium">Calculated based on time recovery & leakage prevention</p>
            </div>

            <Link
              href="/sign-up"
              className="inline-flex items-center justify-center w-full py-3.5 px-6 bg-white hover:bg-emerald-50 text-slate-900 font-extrabold rounded-2xl text-xs transition-all shadow-md active:scale-95"
            >
              <span>Unlock These Savings Now</span>
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
