"use client";

import { useState } from "react";
import {
  FilePlus,
  CheckCircle2,
  FileInput,
  ScanLine,
  IndianRupee,
} from "lucide-react";

export function HowItWorks() {
  const [activeStep, setActiveStep] = useState<number | null>(null);

  const steps = [
    {
      number: "01",
      title: "Request",
      icon: FilePlus,
      desc: "Raise a digital purchase request in seconds.",
      color: "emerald",
    },
    {
      number: "02",
      title: "Approve",
      icon: CheckCircle2,
      desc: "Managers approve via mobile with one tap.",
      color: "teal",
    },
    {
      number: "03",
      title: "Order",
      icon: FileInput,
      desc: "Auto-generate & send professional POs.",
      color: "green",
    },
    {
      number: "04",
      title: "Verify",
      icon: ScanLine,
      desc: "AI-match invoices against POs automatically.",
      color: "emerald",
    },
    {
      number: "05",
      title: "Pay",
      icon: IndianRupee,
      desc: "Settle payments directly via Razorpay.",
      color: "teal",
    },
  ];

  return (
    <section id="how-it-works" className="py-24 bg-gray-50/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-20">
          <h2 className="text-4xl font-extrabold text-gray-900 mb-6 tracking-tight">
            How VyaparFlow Works
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            A seamless, paperless workflow designed to replace chaos with
            control.
          </p>
        </div>

        <div className="max-w-7xl mx-auto">
          {/* Desktop Timeline */}
          <div
            className="hidden lg:flex justify-between items-start relative px-4 isolate"
            onMouseLeave={() => setActiveStep(null)}
          >
            {/* Background Line (Gray) */}
            <div className="absolute top-12 left-0 right-0 h-1 bg-gray-200 rounded-full mx-32 -z-10" />

            {/* Active Progress Line (Animated Gradient) */}
            <div
              className="absolute top-12 left-32 h-1 bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-400 rounded-full transition-all duration-500 ease-out bg-[length:200%_100%] animate-shimmer -z-10"
              style={{
                width:
                  activeStep !== null
                    ? `calc(${(activeStep / (steps.length - 1)) * 100}% - 8rem)`
                    : "0%",
                opacity: activeStep !== null ? 1 : 0,
              }}
            />

            {steps.map((step, i) => (
              <div
                key={i}
                className={`group relative flex flex-col items-center w-64 transition-all duration-300 ${activeStep !== null && i > activeStep ? "opacity-50 grayscale" : "opacity-100"}`}
                onMouseEnter={() => setActiveStep(i)}
              >
                {/* Icon Circle */}
                <div
                  className={`w-24 h-24 rounded-2xl bg-white border-4 shadow-xl flex items-center justify-center mb-8 relative z-10 transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 ${activeStep !== null && i <= activeStep ? "border-emerald-500 scale-110 shadow-emerald-200" : "border-white"}`}
                >
                  {/* Gradient Background */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-br from-${step.color}-50 to-${step.color}-100 rounded-xl opacity-100 transition-opacity duration-300`}
                  />

                  {/* Icon */}
                  <step.icon
                    className={`w-10 h-10 text-${step.color}-600 relative z-10 transition-transform duration-500 group-hover:scale-110`}
                    strokeWidth={1.5}
                  />

                  {/* Floating Number Badge */}
                  <div
                    className={`absolute -top-3 -right-3 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 border-white shadow-lg transition-colors duration-300 ${activeStep !== null && i <= activeStep ? "bg-emerald-600 text-white" : "bg-gray-900 text-white"}`}
                  >
                    {step.number}
                  </div>
                </div>

                {/* Content */}
                <div className="text-center px-2">
                  <h3
                    className={`text-2xl font-bold mb-3 transition-colors duration-300 ${activeStep !== null && i <= activeStep ? "text-emerald-700" : "text-gray-900"}`}
                  >
                    {step.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed text-sm font-medium">
                    {step.desc}
                  </p>
                </div>

                {/* Hover Glow Effect */}
                <div
                  className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-emerald-400/20 rounded-full blur-3xl transition-opacity duration-500 -z-20 pointer-events-none ${activeStep === i ? "opacity-100" : "opacity-0"}`}
                />
              </div>
            ))}
          </div>

          {/* Mobile Timeline */}
          <div className="lg:hidden relative pl-8 border-l-2 border-emerald-100 space-y-12">
            {steps.map((step, i) => (
              <div key={i} className="relative group">
                {/* Timeline Dot */}
                <div className="absolute -left-[41px] top-0 w-5 h-5 rounded-full bg-white border-4 border-emerald-500 shadow-md group-hover:scale-125 transition-transform duration-300" />

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden group-hover:shadow-md transition-all duration-300">
                  {/* Decorative Gradient Background */}
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-emerald-50 to-transparent rounded-bl-full opacity-50" />

                  <div className="flex items-start gap-4 relative z-10">
                    <div
                      className={`w-12 h-12 rounded-xl bg-${step.color}-50 flex items-center justify-center flex-shrink-0`}
                    >
                      <step.icon className={`w-6 h-6 text-${step.color}-600`} />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-emerald-600 mb-1 tracking-wider uppercase">
                        Step {step.number}
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        {step.title}
                      </h3>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {step.desc}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
