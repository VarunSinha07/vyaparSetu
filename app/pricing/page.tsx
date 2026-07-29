"use client";

import { useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/landing-page/Navbar";
import { Footer } from "@/components/landing-page/Footer";
import { CTA } from "@/components/landing-page/CTA";
import { Check, ArrowRight, CheckCircle2, X, ChevronDown, Sparkles } from "lucide-react";

const COMPARISON_FEATURES = [
  { name: "Vendor Management Registry", starter: true, growth: true, enterprise: true },
  { name: "Purchase Requests & Approvals", starter: true, growth: true, enterprise: true },
  {
    name: "Approval Hierarchy Workflows",
    starter: "Basic",
    growth: "Advanced",
    enterprise: "Custom Rules",
  },
  { name: "Department Budget Controls", starter: false, growth: true, enterprise: true },
  { name: "Live GSTIN & e-Way Verification", starter: true, growth: true, enterprise: true },
  { name: "AI 3-Way Invoice Matching", starter: false, growth: true, enterprise: true },
  { name: "Razorpay / UPI Direct Payouts", starter: false, growth: true, enterprise: true },
  { name: "ERP Integration (Tally / Zoho)", starter: false, growth: false, enterprise: true },
  {
    name: "Dedicated Account Manager & SLA",
    starter: false,
    growth: false,
    enterprise: true,
  },
];

const FAQS = [
  {
    q: "Can I upgrade or downgrade my plan later?",
    a: "Yes, you can change your subscription tier anytime from your company billing settings. Pro-rated differences automatically apply to your next billing cycle.",
  },
  {
    q: "Is there a free trial available?",
    a: "Yes! Every new account gets a 14-day free trial on the Growth plan with full access to purchase requests, 3-way invoice matching, and GST verification. No credit card required.",
  },
  {
    q: "How does VyaparFlow verify vendor GSTINs?",
    a: "VyaparFlow integrates directly with the official GST portal API to verify vendor registration status, filing frequency, and tax credit eligibility automatically.",
  },
  {
    q: "Is my financial & payment data secure?",
    a: "Yes, all payment disbursements are processed through PCI-DSS compliant bank gateways (RazorpayX) with end-to-end 256-bit SSL encryption.",
  },
];

export default function PricingPage() {
  const [isAnnual, setIsAnnual] = useState(true);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const plans = [
    {
      name: "Starter",
      subtitle: "For Small Teams",
      desc: "Essential tools for growing teams starting to digitize purchase requests.",
      priceMonthly: "₹999",
      priceAnnual: "₹799",
      period: "/ month",
      features: [
        "Up to 5 User Seats",
        "50 Active Vendor Profiles",
        "50 Approved POs / month",
        "GSTIN Filing Checks",
        "Standard Email Support",
      ],
      highlight: false,
      cta: "Start 14-Day Free Trial",
      href: "/sign-up",
    },
    {
      name: "Growth",
      subtitle: "Most Popular",
      desc: "Complete spend control for scaling businesses with multi-level approvals.",
      priceMonthly: "₹2,999",
      priceAnnual: "₹2,399",
      period: "/ month",
      features: [
        "Up to 20 User Seats",
        "Unlimited Vendor Profiles",
        "500 Approved POs / month",
        "3-Way Invoice Matching",
        "Department Budget Controls",
        "RazorpayX Bank Payouts",
        "Priority Support (24/7)",
      ],
      highlight: true,
      cta: "Start 14-Day Free Trial",
      href: "/sign-up",
    },
    {
      name: "Enterprise",
      subtitle: "Custom Governance",
      desc: "Tailored procurement operating system for large firms & multi-branch groups.",
      priceMonthly: "Custom",
      priceAnnual: "Custom",
      period: "",
      features: [
        "Unlimited User Seats",
        "Unlimited POs & Invoices",
        "Custom ERP Sync (Tally / Zoho)",
        "Dedicated Account Manager",
        "Custom SLA & Audit Reports",
      ],
      highlight: false,
      cta: "Contact Enterprise Sales",
      href: "mailto:sales@vyaparflow.in",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-emerald-50/60 via-teal-50/20 to-white text-slate-900 font-sans selection:bg-emerald-500/20 selection:text-emerald-900">
      <Navbar />

      <main className="flex-1 pt-28 pb-20">
        {/* Page Hero */}
        <section className="relative py-16 text-center overflow-hidden">
          <div className="container mx-auto px-6 lg:px-12 relative z-10 space-y-4 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-emerald-200 shadow-2xs text-emerald-800 text-xs font-extrabold">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>Predictable & Transparent Pricing</span>
            </div>

            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
              Invest in{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700">
                Procurement Clarity.
              </span>
            </h1>
            <p className="text-slate-600 text-base font-normal">
              Transparent plans tailored for Indian MSMEs. No hidden fees. Cancel anytime during your 14-day free trial.
            </p>

            {/* Monthly / Annual Billing Toggle */}
            <div className="pt-6 flex justify-center items-center gap-4">
              <span className={`text-xs font-bold ${!isAnnual ? "text-slate-900" : "text-slate-500"}`}>
                Monthly Billing
              </span>
              <button
                onClick={() => setIsAnnual(!isAnnual)}
                className="w-13 h-7.5 bg-slate-200 border border-slate-300 rounded-full p-1 transition-colors cursor-pointer"
              >
                <div
                  className={`w-5.5 h-5.5 rounded-full bg-emerald-600 transition-transform ${
                    isAnnual ? "translate-x-5.5" : "translate-x-0"
                  }`}
                />
              </button>
              <div className="flex items-center gap-2">
                <span className={`text-xs font-bold ${isAnnual ? "text-slate-900" : "text-slate-500"}`}>
                  Annual Billing
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-200">
                  SAVE 20%
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Cards Grid */}
        <section className="py-8 relative">
          <div className="container mx-auto px-6 lg:px-12 relative z-10 max-w-6xl">
            <div className="grid md:grid-cols-3 gap-6 items-stretch">
              {plans.map((plan, idx) => (
                <div
                  key={idx}
                  className={`flex flex-col justify-between rounded-3xl p-8 transition-all relative ${
                    plan.highlight
                      ? "bg-gradient-to-br from-emerald-600 via-teal-600 to-emerald-700 text-white shadow-xl shadow-emerald-900/20 md:-translate-y-2 border-2 border-emerald-400"
                      : "bg-white text-slate-900 border border-emerald-200/90 shadow-sm"
                  }`}
                >
                  {plan.highlight && (
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white text-emerald-900 text-[10px] font-extrabold px-3 py-1 rounded-full shadow-md uppercase tracking-wider border border-emerald-200">
                      MOST POPULAR
                    </div>
                  )}

                  <div className="space-y-6">
                    <div>
                      <h3 className="text-2xl font-extrabold mb-1">{plan.name}</h3>
                      <p className={`text-xs font-medium ${plan.highlight ? "text-emerald-100" : "text-slate-500"}`}>
                        {plan.desc}
                      </p>
                    </div>

                    <div className="py-4 border-y border-slate-200/40">
                      <div className="flex items-baseline gap-1">
                        <span className="text-4xl font-extrabold tracking-tight">
                          {isAnnual ? plan.priceAnnual : plan.priceMonthly}
                        </span>
                        <span className={`text-xs font-semibold ${plan.highlight ? "text-emerald-100" : "text-slate-500"}`}>
                          {plan.period}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2.5 text-xs font-semibold">
                      {plan.features.map((f, fIdx) => (
                        <div key={fIdx} className="flex items-center gap-2.5">
                          <CheckCircle2 className={`w-4 h-4 shrink-0 ${plan.highlight ? "text-white" : "text-emerald-600"}`} />
                          <span>{f}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-8">
                    <Link
                      href={plan.href}
                      className={`inline-flex items-center justify-center w-full py-3.5 px-5 rounded-2xl text-xs font-extrabold transition-all shadow-sm ${
                        plan.highlight
                          ? "bg-white text-slate-900 hover:bg-emerald-50"
                          : "bg-emerald-600 hover:bg-emerald-700 text-white"
                      }`}
                    >
                      <span>{plan.cta}</span>
                      <ArrowRight className="w-4 h-4 ml-1.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Feature Matrix & FAQ Accordion */}
        <section className="py-16 relative">
          <div className="container mx-auto px-6 lg:px-12 relative z-10 max-w-4xl">
            <div className="text-center mb-8 space-y-1">
              <h2 className="text-2xl font-bold text-slate-900">Frequently Asked Questions</h2>
            </div>

            <div className="space-y-3">
              {FAQS.map((faq, fIdx) => {
                const isOpen = openFaq === fIdx;
                return (
                  <div key={fIdx} className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-2xs">
                    <button
                      onClick={() => setOpenFaq(isOpen ? null : fIdx)}
                      className="w-full p-5 text-left flex items-center justify-between font-bold text-xs text-slate-900 hover:text-emerald-700 transition-colors"
                    >
                      <span>{faq.q}</span>
                      <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? "rotate-180 text-emerald-600" : ""}`} />
                    </button>
                    {isOpen && (
                      <div className="px-5 pb-5 text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-3 font-normal">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <CTA />
      </main>

      <Footer />
    </div>
  );
}
