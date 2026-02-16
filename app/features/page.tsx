import Link from "next/link";
import { Navbar } from "@/components/landing-page/Navbar";
import { Footer } from "@/components/landing-page/Footer";
import {
  Users,
  FileText,
  CheckSquare,
  FileCheck,
  FileSearch,
  CreditCard,
  BarChart3,
  TrendingUp,
  Lock,
  Zap,
  ArrowRight,
} from "lucide-react";

const FEATURES = [
  {
    icon: Users,
    title: "Vendor Management",
    desc: "Maintain a centralized registry with compliance tracking, GST verification, and document storage.",
    benefits: [
      "Add vendors in bulk",
      "Track compliance documents",
      "Performance metrics",
    ],
    color: "indigo",
  },
  {
    icon: FileText,
    title: "Purchase Requests",
    desc: "Create, track, and manage purchase requests with complete visibility across teams.",
    benefits: [
      "Structured forms",
      "Real-time tracking",
      "Department-wide visibility",
    ],
    color: "emerald",
  },
  {
    icon: CheckSquare,
    title: "Approval Workflows",
    desc: "Multi-level approvals with complete audit trails and compliance documentation.",
    benefits: [
      "Hierarchy-based approvals",
      "Digital signatures",
      "Complete audit logs",
    ],
    color: "amber",
  },
  {
    icon: FileCheck,
    title: "Purchase Orders",
    desc: "Generate professional POs instantly with tax breakdowns and vendor compliance checks.",
    benefits: [
      "Auto-HSQN generation",
      "GST-compliant",
      "Vendor acknowledgment",
    ],
    color: "indigo",
  },
  {
    icon: FileSearch,
    title: "Invoice Verification",
    desc: "3-way matching to prevent overpayment and automatically reconcile invoices.",
    benefits: ["PO matching", "GRN matching", "Tax reconciliation"],
    color: "emerald",
  },
  {
    icon: CreditCard,
    title: "Integrated Payments",
    desc: "Execute secure payments via UPI, NEFT, or RTGS directly through the platform.",
    benefits: [
      "Single & batch payments",
      "Payment verification",
      "Razorpay integrated",
    ],
    color: "amber",
  },
  {
    icon: BarChart3,
    title: "Spend Analytics",
    desc: "Real-time dashboards showing vendor performance, category spend, and savings.",
    benefits: ["Live dashboards", "Category analysis", "Vendor scorecards"],
    color: "indigo",
  },
  {
    icon: Lock,
    title: "Role-Based Access",
    desc: "Control who can see what with granular permission controls.",
    benefits: ["Department isolation", "Custom permissions", "User management"],
    color: "emerald",
  },
];

export default function FeaturesPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />

      <main className="flex-1">
        {/* Hero */}
        <section className="pt-20 pb-12 lg:pt-24 lg:pb-16 bg-gradient-to-br from-gray-50 to-white">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
                Powerful Procurement, Simplified
              </h1>
              <p className="text-lg lg:text-xl text-gray-600 mb-8">
                Every feature is built for efficiency, compliance, and
                transparency. See what you get.
              </p>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-20 lg:py-24">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-6 max-w-6xl mx-auto">
              {FEATURES.map((feature, i) => {
                const colorClasses = {
                  indigo: "bg-indigo-50 text-indigo-600 border-indigo-200",
                  emerald: "bg-emerald-50 text-emerald-600 border-emerald-200",
                  amber: "bg-amber-50 text-amber-600 border-amber-200",
                };

                return (
                  <div
                    key={i}
                    className="group bg-white rounded-lg border-2 border-gray-200 hover:border-indigo-400 hover:shadow-xl p-6 shadow-sm transition-all duration-300 hover:-translate-y-2"
                  >
                    <div
                      className={`w-14 h-14 rounded-lg flex items-center justify-center mb-6 ${colorClasses[feature.color as keyof typeof colorClasses]}`}
                    >
                      <feature.icon className="w-7 h-7" />
                    </div>

                    <h3 className="text-2xl font-bold text-gray-900 mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 mb-6 leading-relaxed">
                      {feature.desc}
                    </p>

                    <ul className="space-y-2">
                      {feature.benefits.map((benefit, j) => (
                        <li
                          key={j}
                          className="flex items-center gap-2 text-sm text-gray-700"
                        >
                          <div className="w-1.5 h-1.5 rounded-full bg-indigo-600" />
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Additional Features */}
        <section className="py-20 lg:py-24 bg-gradient-to-br from-indigo-50 to-emerald-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-3">
                Why Teams Choose VyaparFlow
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Beyond features, we provide a complete procurement operating
                system designed for Indian businesses.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {[
                {
                  icon: Zap,
                  title: "Lightning Fast",
                  desc: "Deploy in minutes, not months. Start managing your procurement today.",
                },
                {
                  icon: TrendingUp,
                  title: "Scalable Architecture",
                  desc: "Grows with your business from 10 to 10,000 transactions per day.",
                },
                {
                  icon: Lock,
                  title: "Bank-Grade Security",
                  desc: "256-bit encryption with complete data isolation per company.",
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="group bg-white rounded-lg p-6 shadow-sm border-2 border-gray-200 text-center hover:shadow-lg hover:border-indigo-400 transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                    <item.icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 text-sm">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 lg:py-28 bg-gradient-to-r from-indigo-600 to-emerald-500 relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-[-100px] right-[-100px] w-96 h-96 bg-white rounded-full blur-[80px]" />
          </div>

          <div className="container mx-auto px-4 text-center relative z-10">
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              Transform Your Procurement Today
            </h2>
            <p className="text-lg text-emerald-50 max-w-2xl mx-auto mb-10 leading-relaxed">
              Join Indian MSMEs who have already streamlined their operations
              with VyaparFlow.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/sign-up"
                className="group px-8 py-4 bg-white text-indigo-600 font-bold rounded-lg hover:bg-emerald-50 shadow-xl shadow-indigo-950/50 hover:shadow-emerald-500/50 transition-all hover:-translate-y-2 flex items-center justify-center gap-2"
              >
                Get Started Free
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/"
                className="px-8 py-4 bg-white/15 text-white font-semibold rounded-lg border-2 border-white/30 hover:bg-white/25 hover:border-white/60 transition-all"
              >
                Learn More
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
