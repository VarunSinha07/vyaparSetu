import Link from "next/link";
import { Navbar } from "@/components/landing-page/Navbar";
import { Footer } from "@/components/landing-page/Footer";
import { ArrowRight, CheckCircle, ChevronDown } from "lucide-react";

const STEPS = [
  {
    number: "1",
    title: "Create Company & Invite Team",
    desc: "Set up your company workspace and invite team members with role-based access.",
    details: [
      "Add company details",
      "Invite team members",
      "Set approval hierarchies",
    ],
  },
  {
    number: "2",
    title: "Raise Purchase Request",
    desc: "Department heads create purchase requests with specifications and requirements.",
    details: ["Define requirements", "Attach documents", "Set delivery dates"],
  },
  {
    number: "3",
    title: "Manager Approval",
    desc: "Managers review and approve requests against budget and compliance.",
    details: [
      "Review specifications",
      "Check budget limits",
      "Provide feedback",
    ],
  },
  {
    number: "4",
    title: "Issue Purchase Order",
    desc: "System generates professional PO with tax breakdowns and compliance documentation.",
    details: ["Auto-generated PO", "GST calculations", "Vendor notification"],
  },
  {
    number: "5",
    title: "Upload & Verify Invoice",
    desc: "Vendors submit invoices which are automatically matched with PO and GRN.",
    details: ["3-way matching", "Tax reconciliation", "Discrepancy flagging"],
  },
  {
    number: "6",
    title: "Pay Vendor",
    desc: "Execute secure payments directly through the platform with complete audit trail.",
    details: ["Razorpay integration", "Batch payments", "Payment confirmation"],
  },
];

export default function HowItWorksPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />

      <main className="flex-1">
        {/* Hero */}
        <section className="pt-20 pb-12 lg:pt-24 lg:pb-16 bg-gradient-to-br from-gray-50 to-white">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
                How VyaparFlow Works
              </h1>
              <p className="text-lg lg:text-xl text-gray-600">
                A simple, structured 6-step process that replaces chaos with
                clarity.
              </p>
            </div>
          </div>
        </section>

        {/* Steps */}
        <section className="py-20 lg:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto space-y-6">
              {STEPS.map((step, i) => (
                <div key={i} className="relative">
                  {/* Connection line */}
                  {i < STEPS.length - 1 && (
                    <div className="absolute left-6 top-24 w-0.5 h-24 bg-gradient-to-b from-indigo-300 to-emerald-300"></div>
                  )}

                  <div className="bg-white rounded-xl border-2 border-gray-200 hover:border-indigo-400 hover:shadow-xl p-6 shadow-sm transition-all duration-300 hover:-translate-y-2 relative z-10">
                    <div className="grid md:grid-cols-3 gap-6 items-start">
                      {/* Step Number */}
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-emerald-600 text-white rounded-full flex items-center justify-center font-bold text-lg shadow-lg shadow-indigo-600/30 flex-shrink-0">
                          {step.number}
                        </div>
                        <div className="pt-1">
                          <h3 className="text-2xl font-bold text-gray-900 mb-2">
                            {step.title}
                          </h3>
                          <p className="text-gray-600 mb-4 leading-relaxed">
                            {step.desc}
                          </p>
                        </div>
                      </div>

                      {/* Details */}
                      <div className="md:col-span-2">
                        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                          <p className="text-sm font-semibold text-gray-700 mb-3">
                            What happens in this step
                          </p>
                          <ul className="space-y-2">
                            {step.details.map((detail, j) => (
                              <li
                                key={j}
                                className="flex items-center gap-2 text-sm text-gray-600"
                              >
                                <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                                {detail}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Timeline Visual */}
        <section className="py-16 lg:py-20 bg-gradient-to-br from-indigo-50 to-emerald-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-3">
                The Complete Cycle
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                From request to payment, VyaparFlow handles every step
                efficiently.
              </p>
            </div>

            <div className="max-w-6xl mx-auto">
              <div className="hidden lg:grid grid-cols-6 gap-4">
                {[
                  "Request",
                  "Approve",
                  "Order",
                  "Invoice",
                  "Verify",
                  "Pay",
                ].map((label, i) => (
                  <div key={i} className="text-center">
                    <div className="h-24 bg-gradient-to-br from-indigo-50 to-emerald-50 rounded-lg border-2 border-indigo-200 flex items-center justify-center font-bold text-indigo-600 mb-4 relative">
                      {label}
                      {i < 5 && (
                        <div className="absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2 w-8 h-1 bg-amber-400 rounded-full shadow-sm"></div>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">Step {i + 1}</p>
                  </div>
                ))}
              </div>

              <div className="lg:hidden space-y-4">
                {[
                  "Request",
                  "Approve",
                  "Order",
                  "Invoice",
                  "Verify",
                  "Pay",
                ].map((label, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                      {i + 1}
                    </div>
                    <div className="flex-1 bg-indigo-50 rounded-lg p-3 border border-indigo-200">
                      <p className="font-semibold text-gray-900">{label}</p>
                    </div>
                    {i < 5 && (
                      <ArrowRight className="w-5 h-5 text-amber-500 flex-shrink-0" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* What You Get */}
        <section className="py-20 lg:py-24 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-3">
                What You Get
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                A complete procurement operating system designed for Indian
                businesses.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {[
                {
                  title: "100% Audit Trail",
                  desc: "Every action logged for compliance.",
                  icon: "📋",
                },
                {
                  title: "Real-Time Visibility",
                  desc: "Know every request, PO, and payment status instantly.",
                  icon: "👁️",
                },
                {
                  title: "GST Compliance",
                  desc: "Built-in tax calculations and reporting.",
                  icon: "✅",
                },
                {
                  title: "Secure Payments",
                  desc: "Razorpay-powered with complete encryption.",
                  icon: "🔒",
                },
                {
                  title: "Role-Based Access",
                  desc: "Control who can see and do what.",
                  icon: "👤",
                },
                {
                  title: "Detailed Reports",
                  desc: "Spend analysis and performance insights.",
                  icon: "📊",
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="group bg-gradient-to-br from-indigo-50 to-emerald-50 rounded-lg p-6 border-2 border-indigo-200 hover:border-indigo-400 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-default"
                >
                  <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">
                    {item.icon}
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-600">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20 lg:py-24 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-3">
                Frequently Asked Questions
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Everything you need to know about getting started.
              </p>
            </div>

            <div className="max-w-3xl mx-auto space-y-4">
              {[
                {
                  q: "How long does setup take?",
                  a: "Setup takes just 10-15 minutes. Add your company, invite your team, and start managing procurement immediately.",
                  color: "indigo",
                },
                {
                  q: "Can existing vendors access the platform?",
                  a: "No, your vendors don't need accounts. They receive secure invoice upload links and payment notifications via email.",
                  color: "emerald",
                },
                {
                  q: "Is the data encrypted and secure?",
                  a: "Yes. We use 256-bit SSL encryption with complete data isolation per company. Banking-grade security standards.",
                  color: "amber",
                },
                {
                  q: "Can I migrate my existing data?",
                  a: "We provide data migration support for Enterprise plans. Standard plans include a migration guide and support.",
                  color: "indigo",
                },
                {
                  q: "What payment methods are supported?",
                  a: "UPI, NEFT, RTGS, and other methods via Razorpay. All transactions are fully encrypted and audited.",
                  color: "emerald",
                },
                {
                  q: "Do you offer training and support?",
                  a: "Yes. All plans include onboarding. Enterprise customers get dedicated training sessions and a dedicated account manager.",
                  color: "amber",
                },
              ].map((item, i) => {
                const colorClasses = {
                  indigo:
                    "border-indigo-200 hover:border-indigo-400 bg-indigo-50",
                  emerald:
                    "border-emerald-200 hover:border-emerald-400 bg-emerald-50",
                  amber: "border-amber-200 hover:border-amber-400 bg-amber-50",
                };
                const colorDot = {
                  indigo: "bg-indigo-500",
                  emerald: "bg-emerald-500",
                  amber: "bg-amber-500",
                };

                return (
                  <details
                    key={i}
                    className={`group bg-white rounded-lg px-6 py-5 border-2 ${colorClasses[item.color as keyof typeof colorClasses]} hover:shadow-md transition-all duration-300 cursor-pointer`}
                  >
                    <summary className="flex items-center justify-between font-bold text-gray-900 list-none">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-3 h-3 rounded-full ${colorDot[item.color as keyof typeof colorDot]}`}
                        />
                        <span className="group-hover:text-indigo-600 transition-colors">
                          {item.q}
                        </span>
                      </div>
                      <ChevronDown className="w-5 h-5 text-gray-600 group-open:rotate-180 transition-transform duration-300" />
                    </summary>
                    <div className="mt-4 pl-9 text-gray-600 leading-relaxed animate-in fade-in duration-300">
                      {item.a}
                    </div>
                  </details>
                );
              })}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 lg:py-28 bg-gradient-to-r from-indigo-600 to-emerald-500 relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-[-100px] right-[-100px] w-80 h-80 bg-white rounded-full blur-[80px]" />
          </div>

          <div className="container mx-auto px-4 text-center relative z-10">
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-lg text-emerald-50 max-w-2xl mx-auto mb-10 leading-relaxed">
              Join the growing community of Indian MSMEs transforming their
              procurement workflows.
            </p>
            <Link
              href="/sign-up"
              className="group inline-flex items-center justify-center px-8 py-4 bg-white text-indigo-600 font-bold rounded-lg shadow-xl shadow-indigo-950/50 hover:shadow-emerald-500/50 hover:bg-emerald-50 transition-all duration-300 hover:-translate-y-2 gap-2"
            >
              Start Free Trial
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
