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
  Zap,
  Shield,
  Smartphone,
} from "lucide-react";

const FEATURES = [
  {
    icon: Users,
    title: "Vendor Management",
    desc: "Centralized registry with compliance tracking, GST verification, and document storage.",
    benefits: [
      "Bulk Vendor Onboarding",
      "Compliance Document Tracking",
      "Performance Scorecards",
    ],
  },
  {
    icon: FileText,
    title: "Purchase Requests",
    desc: "Streamlined internal requests with complete visibility and automated routing.",
    benefits: [
      "Customizable Forms",
      "Real-time Status Tracking",
      "Department-wise Budget Control",
    ],
  },
  {
    icon: CheckSquare,
    title: "Smart Approvals",
    desc: "Multi-level approval workflows with audit trails and mobile-friendly actions.",
    benefits: [
      "Hierarchy-based Routing",
      "One-click Approvals",
      "Audit & Compliance Logs",
    ],
  },
  {
    icon: FileCheck,
    title: "Purchase Orders",
    desc: "Generate professional, GST-compliant POs instantly sent to vendors.",
    benefits: [
      "Auto-HSN/SAC Mapping",
      "One-click PO Generation",
      "WhatsApp & Email Integration",
    ],
  },
  {
    icon: FileSearch,
    title: "Invoice Verification",
    desc: "Automated 3-way matching (PO-GRN-Invoice) to prevent overpayment.",
    benefits: [
      "Duplicate Detection",
      "Tax Reconciliation",
      "Payment Scheduling",
    ],
  },
  {
    icon: CreditCard,
    title: "Integrated Payments",
    desc: "Seamless payments via UPI, NEFT, or RTGS directly from your dashboard.",
    benefits: [
      "Bulk Payment Processing",
      "Vendor Payment Links",
      "Bank Reconciliation",
    ],
  },
  {
    icon: BarChart3,
    title: "Spend Analytics",
    desc: "Actionable insights into spending patterns, category distribution, and savings.",
    benefits: [
      "Real-time Dashboards",
      "Category-wise Split",
      "Cost Saving Reports",
    ],
  },
  {
    icon: Lock,
    title: "Enterprise Controls",
    desc: "Granular permission controls ensuring data security and operational integrity.",
    benefits: [
      "Role-Based Access (RBAC)",
      "Department Isolation",
      "Activity Logs",
    ],
  },
];

export default function FeaturesPage() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50 font-sans selection:bg-emerald-500/30 selection:text-emerald-900">
      <Navbar />

      <main className="flex-1 pt-20">
        {/* Hero Section */}
        <section className="relative py-24 lg:py-32 overflow-hidden bg-emerald-950">
          {/* Background Effects */}
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-soft-light" />
          <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-br from-emerald-500/20 to-teal-500/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-teal-900/40 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2" />

          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto text-center space-y-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-900/50 border border-emerald-500/30 text-emerald-300 text-sm font-medium backdrop-blur-md">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                The Complete Procurement OS
              </div>

              <h1 className="text-5xl lg:text-7xl font-bold tracking-tight text-white">
                Everything you need to <br className="hidden md:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-200">
                  control spend.
                </span>
              </h1>

              <p className="text-xl text-emerald-100/70 max-w-2xl mx-auto leading-relaxed">
                From purchase request to payment, VyaparFlow unifies your entire
                procurement lifecycle into one intelligent platform.
              </p>
            </div>
          </div>
        </section>

        {/* Core Features Grid */}
        <section className="py-24 relative">
          <div className="absolute inset-0 bg-[#F8FAFC]" />
          <div className="container mx-auto px-4 relative z-10">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {FEATURES.map((feature, i) => (
                <div
                  key={i}
                  className="group bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl hover:shadow-emerald-900/5 border border-slate-200 hover:border-emerald-500/30 transition-all duration-300 hover:-translate-y-1 relative overflow-hidden"
                >
                  {/* Hover Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-emerald-50/0 via-emerald-50/0 to-emerald-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  <div className="relative z-10">
                    <div className="w-14 h-14 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-emerald-500 group-hover:text-white transition-all duration-300">
                      <feature.icon className="w-7 h-7 text-emerald-600 group-hover:text-white transition-colors" />
                    </div>

                    <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-emerald-700 transition-colors">
                      {feature.title}
                    </h3>

                    <p className="text-slate-600 mb-6 leading-relaxed text-sm">
                      {feature.desc}
                    </p>

                    <ul className="space-y-3 pt-6 border-t border-slate-100">
                      {feature.benefits.map((benefit, j) => (
                        <li
                          key={j}
                          className="flex items-center gap-3 text-sm text-slate-600 font-medium"
                        >
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* "Why It Matters" Section */}
        <section className="py-24 bg-white border-y border-slate-100">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
                Built for the Speed of Indian Business
              </h2>
              <p className="text-lg text-slate-600">
                We don&apos;t just digitize paperwork; we engineer velocity into your
                supply chain.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {[
                {
                  icon: Zap,
                  title: "Deploy in Minutes",
                  desc: "Zero setup time. Import your vendors and start creating POs instantly.",
                  gradient: "from-amber-500 to-orange-500",
                },
                {
                  icon: Shield,
                  title: "Auditor-Ready",
                  desc: "Every action is logged. Tax and compliance reports are generated automatically.",
                  gradient: "from-emerald-500 to-teal-500",
                },
                {
                  icon: Smartphone,
                  title: "Mobile First",
                  desc: "Approve requests, track orders, and manage payments from anywhere.",
                  gradient: "from-blue-500 to-indigo-500",
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="text-center p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:bg-white hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 group"
                >
                  <div
                    className={`w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br ${item.gradient} flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}
                  >
                    <item.icon className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">
                    {item.title}
                  </h3>
                  <p className="text-slate-600 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Reusing the New CTA Component */}
        <CTA />
      </main>

      <Footer />
    </div>
  );
}
