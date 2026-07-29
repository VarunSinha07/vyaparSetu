"use client";

import {
  Users,
  FileText,
  CheckSquare,
  FileCheck,
  FileSearch,
  CreditCard,
  BarChart3,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

export function Features() {
  const features = [
    {
      icon: FileSearch,
      title: "Automatic 3-Way Invoice Matching",
      desc: "Cross-references vendor invoices against original PO terms and received Goods Received Notes (GRN) to catch line-item discrepancies.",
      tag: "Eliminates Overbilling",
    },
    {
      icon: ShieldCheck,
      title: "Live GSTIN & Tax Credit (ITC) Verification",
      desc: "Integrates with official GST APIs to verify vendor tax filings, e-Way bills, and input tax credit claims before releasing payments.",
      tag: "100% Tax Compliant",
    },
    {
      icon: CheckSquare,
      title: "Role-Based Approval Hierarchies",
      desc: "Define custom approval rules based on department, budget thresholds, or CAPEX/OPEX categories with instant notifications.",
      tag: "Role Security",
    },
    {
      icon: FileCheck,
      title: "Instant Purchase Order Dispatch",
      desc: "Convert approved requests into branded POs in 1-click and send them directly to vendors via email or WhatsApp.",
      tag: "1-Click PDF",
    },
    {
      icon: CreditCard,
      title: "Direct Bank & UPI Payouts",
      desc: "Disburse approved vendor payments via RazorpayX bank integration straight from your verified invoice dashboard.",
      tag: "Razorpay Integrated",
    },
    {
      icon: Users,
      title: "Centralized Vendor Directory",
      desc: "Store supplier bank details, tax certificates, contract terms, and historical fulfillment ratings in one place.",
      tag: "Vendor Profiles",
    },
  ];

  return (
    <section id="features" className="py-24 bg-slate-50/60 border-b border-slate-200/80">
      <div className="container mx-auto px-6 lg:px-12 max-w-7xl">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-slate-200 shadow-2xs text-slate-800 text-xs font-semibold">
            <span>Built for Modern Businesses</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
            Everything You Need for Complete Spend Control
          </h2>
          <p className="text-slate-600 text-base">
            Replace scattered Excel files and manual checks with a single, audit-ready platform.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="bg-white border border-slate-200/90 rounded-2xl p-7 shadow-xs hover:shadow-md hover:border-slate-300 transition-all flex flex-col justify-between space-y-6"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="p-3 rounded-xl bg-slate-100 text-slate-900">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-100">
                      {item.tag}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900">{item.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{item.desc}</p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                  <Link
                    href="/features"
                    className="text-emerald-700 hover:text-emerald-800 font-semibold inline-flex items-center gap-1"
                  >
                    <span>Learn more</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
