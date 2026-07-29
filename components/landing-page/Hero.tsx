"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  TrendingUp,
  FileCheck2,
  Sparkles,
  Zap,
  Building2,
  IndianRupee,
  Clock,
  ChevronRight,
  Check,
  Award,
} from "lucide-react";

export function Hero() {
  const [activeTab, setActiveTab] = useState<"matching" | "pr">("matching");

  return (
    <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 bg-gradient-to-b from-emerald-50/80 via-teal-50/40 to-white overflow-hidden border-b border-emerald-100">
      {/* Dynamic Background Glows & Elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-b from-emerald-300/30 via-teal-200/20 to-transparent rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-1/4 -right-20 w-96 h-96 bg-teal-300/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/3 -left-20 w-96 h-96 bg-emerald-300/20 rounded-full blur-[120px] pointer-events-none" />

      {/* Grid Overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:32px_32px] opacity-15 pointer-events-none" />

      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-8 mb-16">
          {/* Vibrant Trust Badge Pill */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-emerald-500/10 border border-emerald-500/30 text-emerald-800 text-xs font-extrabold shadow-xs backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
            <span>India&apos;s Smart Procurement & Spend Platform</span>
            <span className="bg-emerald-600 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">GST READY</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
            Digitize Vendor Spend. <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700">
              Eliminate Leakage & Duplicate Bills.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl text-slate-700 max-w-2xl mx-auto font-normal leading-relaxed">
            VyaparFlow connects purchase requests, 3-way invoice verification, GST credit audits, and Razorpay payouts into one seamless operating system.
          </p>

          {/* Call to Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/sign-up"
              className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold rounded-2xl text-base shadow-lg shadow-emerald-600/25 hover:shadow-emerald-600/40 hover:-translate-y-0.5 transition-all active:scale-95 group"
            >
              <span>Start 14-Day Free Trial</span>
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/how-it-works"
              className="inline-flex items-center justify-center px-8 py-4 bg-white hover:bg-emerald-50/50 text-slate-800 font-bold rounded-2xl text-base border-2 border-emerald-200/80 shadow-xs hover:border-emerald-400 transition-all"
            >
              See How It Works
            </Link>
          </div>

          {/* Vibrant Trust Metric Badges */}
          <div className="pt-4 flex flex-wrap justify-center items-center gap-6 text-xs text-slate-700 font-semibold">
            <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-full border border-emerald-200 shadow-2xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>100% GST Portal Compliant</span>
            </div>
            <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-full border border-teal-200 shadow-2xs">
              <ShieldCheck className="w-4 h-4 text-teal-600" />
              <span>Automated 3-Way Matching</span>
            </div>
            <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-full border border-emerald-200 shadow-2xs">
              <Award className="w-4 h-4 text-emerald-600" />
              <span>Razorpay Bank Secured</span>
            </div>
          </div>
        </div>

        {/* Vibrant Interactive Product UI Showcase */}
        <div className="max-w-5xl mx-auto relative">
          {/* Glowing Ambient Card Border */}
          <div className="absolute -inset-1.5 bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-500 rounded-[32px] blur-md opacity-60" />

          <div className="relative bg-white border border-emerald-200 rounded-3xl shadow-2xl overflow-hidden">
            {/* Window Header Bar */}
            <div className="px-6 py-4 bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-rose-500" />
                  <div className="w-3 h-3 rounded-full bg-amber-500" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500" />
                </div>
                <span className="text-xs font-mono text-emerald-300 font-semibold">vyaparflow.in/spend-dashboard</span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setActiveTab("matching")}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                    activeTab === "matching"
                      ? "bg-emerald-500 text-slate-950 shadow-xs"
                      : "text-slate-300 hover:text-white"
                  }`}
                >
                  3-Way Match Verification
                </button>
                <button
                  onClick={() => setActiveTab("pr")}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                    activeTab === "pr"
                      ? "bg-emerald-500 text-slate-950 shadow-xs"
                      : "text-slate-300 hover:text-white"
                  }`}
                >
                  Purchase Requests
                </button>
              </div>
            </div>

            {/* Dashboard Content Mockup */}
            <div className="p-6 lg:p-8 bg-slate-50/80 space-y-6">
              {/* Vibrant Summary Metric Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-emerald-50 to-white p-5 rounded-2xl border border-emerald-200 shadow-sm relative overflow-hidden">
                  <div className="text-xs font-bold text-emerald-800 uppercase tracking-wider mb-1">Total Verified Spend</div>
                  <div className="text-2xl font-extrabold text-slate-900 flex items-center">
                    <IndianRupee className="w-5 h-5 mr-0.5 text-emerald-600" />
                    24,80,500
                  </div>
                  <div className="text-[11px] font-bold text-emerald-700 mt-1 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> 100% Budget Approved
                  </div>
                </div>

                <div className="bg-gradient-to-br from-teal-50 to-white p-5 rounded-2xl border border-teal-200 shadow-sm relative overflow-hidden">
                  <div className="text-xs font-bold text-teal-800 uppercase tracking-wider mb-1">GST Tax Credit (ITC)</div>
                  <div className="text-2xl font-extrabold text-slate-900 flex items-center">
                    <IndianRupee className="w-5 h-5 mr-0.5 text-teal-600" />
                    4,46,490
                  </div>
                  <div className="text-[11px] font-bold text-teal-700 mt-1 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" /> Verified via GSTIN API
                  </div>
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-white p-5 rounded-2xl border border-blue-200 shadow-sm relative overflow-hidden">
                  <div className="text-xs font-bold text-blue-800 uppercase tracking-wider mb-1">Matching Accuracy</div>
                  <div className="text-2xl font-extrabold text-slate-900">99.9%</div>
                  <div className="text-[11px] font-bold text-blue-700 mt-1 flex items-center gap-1">
                    <Zap className="w-3.5 h-3.5" /> Zero Overbilling Released
                  </div>
                </div>
              </div>

              {/* Dynamic Interactive Tab Preview */}
              {activeTab === "matching" ? (
                <div className="bg-white rounded-2xl p-6 border-2 border-emerald-300/80 shadow-md space-y-4 animate-in fade-in duration-300">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-base font-extrabold text-slate-900">Invoice #INV-2026-984</span>
                        <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-300">
                          AUTOMATED 3-WAY MATCH
                        </span>
                      </div>
                      <div className="text-xs text-slate-600 mt-1 font-medium">Supplier: Mahavir Steel Traders • GSTIN: 27AABCU9603R1ZM</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-extrabold text-slate-900">₹1,85,000</div>
                      <div className="text-[10px] text-slate-500 font-semibold">Approved for Razorpay Payout</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3 text-center text-xs">
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                      <div className="text-[10px] text-slate-500 font-bold uppercase">PO Total</div>
                      <div className="text-slate-900 font-extrabold mt-0.5">₹1,85,000</div>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                      <div className="text-[10px] text-slate-500 font-bold uppercase">Goods Received</div>
                      <div className="text-slate-900 font-extrabold mt-0.5">100% Quantity</div>
                    </div>
                    <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-300 text-emerald-900">
                      <div className="text-[10px] text-emerald-800 font-bold uppercase">Variance</div>
                      <div className="font-extrabold mt-0.5 text-emerald-700">₹0.00 (Exact Match)</div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-2xl p-6 border-2 border-teal-300/80 shadow-md space-y-4 animate-in fade-in duration-300">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                    <div>
                      <div className="text-base font-extrabold text-slate-900">PR-402: Packaging Boxes Batch</div>
                      <div className="text-xs text-slate-600 mt-1 font-medium">Requested by Production Lead • CAPEX Budget</div>
                    </div>
                    <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-amber-100 text-amber-900 border border-amber-300">
                      PENDING MANAGER APPROVAL
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-700">
                    <span>Estimated Amount: <strong className="text-slate-900 font-extrabold">₹62,000</strong></span>
                    <button className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold transition-all shadow-xs">
                      Approve Request
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
