"use client";

import { useState } from "react";
import {
  FilePlus,
  CheckCircle2,
  FileInput,
  ScanLine,
  IndianRupee,
  ArrowRight,
  ShieldCheck,
  Building2,
  Users,
} from "lucide-react";

export function HowItWorks() {
  const [activeStep, setActiveStep] = useState<number>(0);

  const steps = [
    {
      number: "01",
      title: "Raise Request",
      persona: "Department Staff & Leads",
      icon: FilePlus,
      desc: "Employees submit digital purchase requests with budget tags (CAPEX/OPEX), vendor quotes, and specifications.",
      benefits: ["Auto-checks budget availability", "No paperwork or verbal promises"],
    },
    {
      number: "02",
      title: "Role-Based Approvals",
      persona: "Managers & Finance Leads",
      icon: CheckCircle2,
      desc: "Approvers review requests on web or mobile with threshold-based routing (e.g. requests > ₹1L escalate to CFO).",
      benefits: ["1-click Approve / Reject with notes", "Full timestamped audit trail"],
    },
    {
      number: "03",
      title: "Auto-Generate PO",
      persona: "Procurement Officer",
      icon: FileInput,
      desc: "System converts approved requests into GST-compliant Purchase Orders sent directly to suppliers via email/WhatsApp.",
      benefits: ["Branded PDF generation", "Tracks vendor fulfillment & delivery"],
    },
    {
      number: "04",
      title: "3-Way Match & Pay",
      persona: "Finance & Accounting",
      icon: ScanLine,
      desc: "Reconciles vendor invoice against original PO and Goods Received Note (GRN), verifies GSTIN filing, and releases payout.",
      benefits: ["Stops overbilling & price creep", "100% Tax Credit (ITC) compliance"],
    },
  ];

  return (
    <section id="how-it-works" className="py-24 bg-white border-b border-slate-200/80">
      <div className="container mx-auto px-6 lg:px-12 max-w-6xl">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-800 text-xs font-semibold">
            <span>Simple 4-Step Lifecycle</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            How VyaparFlow Powers Your Spend
          </h2>
          <p className="text-slate-600 text-base">
            Replace chaotic emails and WhatsApp threads with a clear, 4-step digital workflow.
          </p>
        </div>

        {/* Step Navigation Pill Tabs */}
        <div className="max-w-4xl mx-auto mb-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
            {steps.map((step, idx) => {
              const isActive = activeStep === idx;
              return (
                <button
                  key={step.number}
                  onClick={() => setActiveStep(idx)}
                  className={`py-3 px-4 rounded-xl text-xs font-bold transition-all text-center ${
                    isActive
                      ? "bg-white text-slate-900 shadow-sm border border-slate-200"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <span className="text-slate-400 font-mono mr-1.5">{step.number}</span>
                  <span>{step.title}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Active Step Card */}
        <div className="max-w-4xl mx-auto bg-slate-50 border border-slate-200 rounded-3xl p-8 lg:p-10 shadow-sm grid md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-8 space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-emerald-600 text-white font-bold">
                {(() => {
                  const Icon = steps[activeStep].icon;
                  return <Icon className="w-6 h-6" />;
                })()}
              </div>
              <div>
                <span className="text-xs font-mono font-bold text-emerald-700 uppercase">Step {steps[activeStep].number}</span>
                <h3 className="text-2xl font-bold text-slate-900">{steps[activeStep].title}</h3>
              </div>
            </div>

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-slate-200 text-xs text-slate-700 font-medium">
              <Users className="w-3.5 h-3.5 text-slate-500" />
              <span>Persona: {steps[activeStep].persona}</span>
            </div>

            <p className="text-slate-700 text-sm leading-relaxed">{steps[activeStep].desc}</p>

            <div className="space-y-2 pt-2">
              {steps[activeStep].benefits.map((b, bIdx) => (
                <div key={bIdx} className="flex items-center gap-2.5 text-xs text-slate-800 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{b}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="md:col-span-4 bg-white p-6 rounded-2xl border border-slate-200 text-center space-y-4 shadow-2xs">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto">
              {(() => {
                const Icon = steps[activeStep].icon;
                return <Icon className="w-6 h-6" />;
              })()}
            </div>
            <div className="text-sm font-bold text-slate-900">{steps[activeStep].title} Module</div>
            <div className="text-xs text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full font-semibold border border-emerald-100">
              Active & Audit Ready
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
