"use client";

import { useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  FileX,
  MessageSquareOff,
  MailWarning,
  Ban,
  ArrowRight,
  Database,
  Workflow,
  Receipt,
  IndianRupee,
} from "lucide-react";

export function Problem() {
  const [activeTab, setActiveTab] = useState<"problem" | "solution">("problem");

  return (
    <section
      className="py-24 bg-gray-50 border-y border-gray-200 overflow-hidden relative"
      id="problem"
    >
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 opacity-5 pointer-events-none">
        <div className="absolute -top-[20%] -right-[10%] w-[50%] h-[50%] bg-blue-400 rounded-full blur-[100px]" />
        <div className="absolute -bottom-[20%] -left-[10%] w-[50%] h-[50%] bg-red-400 rounded-full blur-[100px]" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-4xl font-extrabold text-gray-900 mb-6 tracking-tight">
            Evolution of a Purchase
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Stop battling with chaos. Flip the switch to see the transformation.
          </p>

          {/* Interactive Toggle */}
          <div className="inline-flex items-center bg-white rounded-full p-1.5 shadow-md border border-gray-200 mb-8 transition-colors duration-300">
            <button
              onClick={() => setActiveTab("problem")}
              className={`px-8 py-3 rounded-full text-sm font-bold transition-all duration-300 flex items-center gap-2 ${activeTab === "problem" ? "bg-red-50 text-red-600 shadow-sm ring-1 ring-red-100" : "text-gray-500 hover:text-gray-900"}`}
            >
              <AlertCircle className="w-4 h-4" />
              The Chaos
            </button>
            <button
              onClick={() => setActiveTab("solution")}
              className={`px-8 py-3 rounded-full text-sm font-bold transition-all duration-300 flex items-center gap-2 ${activeTab === "solution" ? "bg-indigo-600 text-white shadow-md" : "text-gray-500 hover:text-gray-900"}`}
            >
              <CheckCircle2 className="w-4 h-4" />
              The Solution
            </button>
          </div>
        </div>

        {/* Morphing Card */}
        <div className="max-w-5xl mx-auto">
          <div className={`relative transition-all duration-500 transform`}>
            {/* Content Container */}
            <div
              className={`bg-white rounded-3xl shadow-xl border overflow-hidden transition-colors duration-500 ${activeTab === "problem" ? "border-red-100 shadow-red-100/50" : "border-indigo-100 shadow-indigo-100/50"}`}
            >
              <div className="grid md:grid-cols-2">
                {/* Left Side: Visual/Context */}
                <div
                  className={`p-10 flex flex-col justify-center relative overflow-hidden transition-colors duration-500 ${activeTab === "problem" ? "bg-red-50" : "bg-indigo-600"}`}
                >
                  {activeTab === "problem" ? (
                    <div className="space-y-6 animate-in slide-in-from-left-4 fade-in duration-500">
                      <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center text-red-600 mb-4 shadow-sm">
                        <AlertCircle className="w-8 h-8" />
                      </div>
                      <h3 className="text-3xl font-bold text-gray-900">
                        Fragmentation & Risk
                      </h3>
                      <p className="text-gray-700 leading-relaxed font-medium text-lg">
                        Relying on scattered tools creates a breeding ground for
                        errors, fraud, and delays. It&apos;s a house of cards
                        waiting to fall.
                      </p>
                      <div className="grid grid-cols-2 gap-4 mt-8">
                        <div className="bg-white/80 p-4 rounded-xl backdrop-blur-sm border border-red-200 shadow-sm">
                          <div className="text-2xl font-bold text-red-600 mb-1">
                            40%
                          </div>
                          <div className="text-xs text-red-800 font-bold uppercase tracking-wide">
                            Time Wasted
                          </div>
                        </div>
                        <div className="bg-white/80 p-4 rounded-xl backdrop-blur-sm border border-red-200 shadow-sm">
                          <div className="text-2xl font-bold text-red-600 mb-1">
                            High
                          </div>
                          <div className="text-xs text-red-800 font-bold uppercase tracking-wide">
                            Compliance Risk
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-6 text-white animate-in slide-in-from-right-4 fade-in duration-500">
                      <div className="w-16 h-16 bg-indigo-500 rounded-2xl flex items-center justify-center text-white mb-4 shadow-lg shadow-indigo-900/40">
                        <CheckCircle2 className="w-8 h-8" />
                      </div>
                      <h3 className="text-3xl font-bold">Unified Control</h3>
                      <p className="text-indigo-100 leading-relaxed font-medium text-lg">
                        VyaparFlow centralizes everything. Vendors, invoices,
                        and payments speak the same language in one secure
                        ecosystem.
                      </p>
                      <div className="grid grid-cols-2 gap-4 mt-8">
                        <div className="bg-indigo-700/40 p-4 rounded-xl backdrop-blur-sm border border-indigo-400/30">
                          <div className="text-2xl font-bold text-white mb-1">
                            100%
                          </div>
                          <div className="text-xs text-indigo-200 font-bold uppercase tracking-wide">
                            Audit Trail
                          </div>
                        </div>
                        <div className="bg-indigo-700/40 p-4 rounded-xl backdrop-blur-sm border border-indigo-400/30">
                          <div className="text-2xl font-bold text-white mb-1">
                            0%
                          </div>
                          <div className="text-xs text-indigo-200 font-bold uppercase tracking-wide">
                            Data Loss
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Right Side: List Items */}
                <div className="p-10 bg-white">
                  <div className="space-y-8">
                    {COMPARISON_DATA.map((item, index) => (
                      <div key={index} className="group min-h-[70px]">
                        {activeTab === "problem" ? (
                          <div
                            className="flex items-start gap-4 animate-in fade-in slide-in-from-bottom-2 duration-500 fill-mode-both"
                            style={{ animationDelay: `${index * 100}ms` }}
                          >
                            <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center flex-shrink-0 group-hover:bg-red-100 transition-colors border border-red-100">
                              <item.problemIcon className="w-6 h-6 text-red-400 group-hover:text-red-600 transition-colors" />
                            </div>
                            <div>
                              <h4 className="font-bold text-gray-900 text-lg mb-1">
                                {item.problemTitle}
                              </h4>
                              <p className="text-gray-500 text-sm leading-relaxed">
                                {item.problemDesc}
                              </p>
                            </div>
                          </div>
                        ) : (
                          <div
                            className="flex items-start gap-4 animate-in fade-in slide-in-from-bottom-2 duration-500 fill-mode-both"
                            style={{ animationDelay: `${index * 100}ms` }}
                          >
                            <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0 group-hover:bg-blue-100 transition-colors border border-blue-100">
                              <item.solutionIcon className="w-6 h-6 text-blue-600 group-hover:text-blue-700 transition-colors" />
                            </div>
                            <div>
                              <h4 className="font-bold text-gray-900 text-lg mb-1">
                                {item.solutionTitle}
                              </h4>
                              <p className="text-gray-500 text-sm leading-relaxed">
                                {item.solutionDesc}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {activeTab === "problem" && (
                    <div className="mt-12 pt-8 border-t border-gray-100 text-center animate-in fade-in duration-700">
                      <button
                        onClick={() => setActiveTab("solution")}
                        className="inline-flex items-center gap-2 text-indigo-600 font-bold hover:text-indigo-800 transition-colors group px-6 py-2 rounded-lg hover:bg-indigo-50"
                      >
                        See how we fix this
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

const COMPARISON_DATA = [
  {
    problemTitle: "Spreadsheet & Paper Tracking",
    problemDesc:
      "Data hidden in offline files, prone to version errors and loss.",
    problemIcon: FileX,
    solutionTitle: "Centralized Vendor Database",
    solutionDesc:
      "Real-time cloud database accessible to all authorized team members.",
    solutionIcon: Database,
  },
  {
    problemTitle: "WhatsApp Approvals",
    problemDesc:
      "Informal sign-offs that get lost in chat history with no accountability.",
    problemIcon: MessageSquareOff,
    solutionTitle: "Structured Approval Workflows",
    solutionDesc:
      "Automated hierarchy-based approvals with digital signatures.",
    solutionIcon: Workflow,
  },
  {
    problemTitle: "Email Invoice Chaos",
    problemDesc:
      "Invoices buried in spam folders or lost in long email threads.",
    problemIcon: MailWarning,
    solutionTitle: "Dedicated Invoice Portal",
    solutionDesc: "Vendors upload directly; system auto-matches with POs.",
    solutionIcon: Receipt,
  },
  {
    problemTitle: "Manual Bank Transfers",
    problemDesc:
      "Time-consuming data entry with high risk of typo-based payment errors.",
    problemIcon: Ban,
    solutionTitle: "Integrated Vendor Payments",
    solutionDesc:
      "One-click payments via Razorpay/UPI directly from the dashboard.",
    solutionIcon: IndianRupee,
  },
];
