import { Navbar } from "@/components/landing-page/Navbar";
import { Footer } from "@/components/landing-page/Footer";
import { CTA } from "@/components/landing-page/CTA";
import {
  Users,
  FileText,
  CheckSquare,
  FileCheck,
  FileSearch,
  CreditCard,
  BarChart3,
  Lock,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

const FEATURES = [
  {
    icon: Users,
    title: "Centralized Vendor Directory",
    desc: "Maintain complete vendor profiles, compliance documents, bank details, and historical ratings in one secure place.",
    benefits: [
      "Bulk Vendor Import & GSTIN Auto-fetch",
      "Document Renewal & Expiry Alerts",
      "Vendor Performance Scorecards",
    ],
  },
  {
    icon: FileText,
    title: "Digital Purchase Requests (PR)",
    desc: "Empower staff to raise spending requests with structured line-item estimates, attachments, and budget tags.",
    benefits: [
      "CAPEX & OPEX Budget Allocation",
      "Real-Time Request Status Tracking",
      "Department-wise Spending Limits",
    ],
  },
  {
    icon: CheckSquare,
    title: "Smart Hierarchy Approvals",
    desc: "Multi-level approval matrices that automatically route requests based on value thresholds and department rules.",
    benefits: [
      "Custom Multi-Role Escalation Matrix",
      "1-Tap Web & Mobile Approvals",
      "Immutable Timestamped Audit Logs",
    ],
  },
  {
    icon: FileCheck,
    title: "Automated PO Generation",
    desc: "Convert approved requests into branded, GST-compliant Purchase Orders dispatched automatically to suppliers.",
    benefits: [
      "Auto-HSN/SAC Code Resolution",
      "Direct Email & WhatsApp PO Dispatch",
      "Vendor Acceptance Tracking",
    ],
  },
  {
    icon: FileSearch,
    title: "3-Way Invoice Matching",
    desc: "Automatically reconcile vendor invoices against PO terms and Goods Received Notes (GRN) to catch overbilling.",
    benefits: [
      "Line-item Quantity & Price Cross-check",
      "Live GST Credit (ITC) Verification",
      "Zero Duplicate Invoice Release",
    ],
  },
  {
    icon: CreditCard,
    title: "Integrated Bank & UPI Payouts",
    desc: "Disburse approved vendor invoices straight from your verified dashboard via RazorpayX or UPI integration.",
    benefits: [
      "1-Click Bulk Payout Execution",
      "Instant Payment Receipts & Slips",
      "Automatic Bank Reconciliation",
    ],
  },
  {
    icon: BarChart3,
    title: "Spend Analytics & Reporting",
    desc: "Gain deep real-time visibility into spending trends, department budgets, and procurement turnaround times.",
    benefits: [
      "Category & Department Breakdown",
      "Savings & Variance Leakage Reports",
      "Exportable Audit CSV & PDF Sheets",
    ],
  },
  {
    icon: Lock,
    title: "Role-Based Security (RBAC)",
    desc: "Enterprise granular permissions ensuring each user only accesses authorized files, approvals, and reports.",
    benefits: [
      "Admin, Manager, Finance, Procurement Roles",
      "Multi-Tenant Company Isolation",
      "256-bit SSL Encryption",
    ],
  },
];

export default function FeaturesPage() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50/50 text-slate-900 font-sans selection:bg-emerald-500/20 selection:text-emerald-900">
      <Navbar />

      <main className="flex-1 pt-28 pb-20">
        {/* Page Hero */}
        <section className="relative py-16 text-center overflow-hidden">
          <div className="container mx-auto px-6 lg:px-12 relative z-10 space-y-4 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-slate-200 shadow-2xs text-slate-800 text-xs font-semibold">
              <span>Platform Capabilities</span>
            </div>

            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900">
              Built to Eliminate Procurement Chaos
            </h1>
            <p className="text-slate-600 text-base">
              Explore VyaparFlow&apos;s modular capabilities designed specifically for Indian MSMEs and growing teams.
            </p>
          </div>
        </section>

        {/* Feature Grid */}
        <section className="py-8 relative">
          <div className="container mx-auto px-6 lg:px-12 relative z-10 max-w-6xl">
            <div className="grid md:grid-cols-2 gap-6">
              {FEATURES.map((feature, idx) => {
                const Icon = feature.icon;
                return (
                  <div
                    key={idx}
                    className="bg-white border border-slate-200 rounded-3xl p-8 shadow-xs flex flex-col justify-between space-y-6"
                  >
                    <div className="space-y-4">
                      <div className="p-3 rounded-xl bg-slate-100 text-slate-900 w-fit">
                        <Icon className="w-5 h-5" />
                      </div>

                      <h3 className="text-xl font-bold text-slate-900">{feature.title}</h3>
                      <p className="text-xs text-slate-600 leading-relaxed font-normal">{feature.desc}</p>

                      <div className="space-y-2 pt-3 border-t border-slate-100">
                        {feature.benefits.map((b, bIdx) => (
                          <div key={bIdx} className="flex items-center gap-2.5 text-xs text-slate-700 font-medium">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                            <span>{b}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="pt-4">
                      <Link
                        href="/sign-up"
                        className="inline-flex items-center text-xs font-semibold text-emerald-700 hover:text-emerald-800"
                      >
                        <span>Start 14-day trial</span>
                        <ArrowRight className="w-3.5 h-3.5 ml-1" />
                      </Link>
                    </div>
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
