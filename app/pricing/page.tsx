import Link from "next/link";
import { Navbar } from "@/components/landing-page/Navbar";
import { Footer } from "@/components/landing-page/Footer";
import { CTA } from "@/components/landing-page/CTA";
import { Check, ArrowRight, CheckCircle2, X } from "lucide-react";

const PRICING_PLANS = [
  {
    name: "Starter",
    subtitle: "For Small Teams",
    desc: "Perfect for teams just starting their procurement journey.",
    price: "₹999",
    period: "/ month",
    features: [
      "Up to 5 users",
      "50 Vendors",
      "50 POs / month",
      "Basic Analytics",
      "Email Support",
    ],
    highlight: false,
    cta: "Start Free Trial",
    href: "/sign-up",
  },
  {
    name: "Growth",
    subtitle: "Most Popular",
    desc: "Scale your operations with advanced controls and limitless potential.",
    price: "₹2,999",
    period: "/ month",
    features: [
      "Up to 20 users",
      "Unlimited Vendors",
      "500 POs / month",
      "Advanced Budgeting",
      "Priority Email & Chat Support",
      "Custom Approval Workflows",
      "Vendor Portal Access",
    ],
    highlight: true,
    cta: "Start Free Trial",
    href: "/sign-up",
  },
  {
    name: "Enterprise",
    subtitle: "For Large Organizations",
    desc: "Custom solutions for complex compliance and security needs.",
    price: "Custom",
    period: "",
    features: [
      "Unlimited Users",
      "Unlimited Transactions",
      "Dedicated Account Manager",
      "Custom ERP Integrations",
      "On-Premise Deployment Option",
      "SLA Guarantees",
      "Audit & Compliance Reports",
    ],
    highlight: false,
    cta: "Contact Sales",
    href: "mailto:sales@vyaparflow.in",
  },
];

const COMPARISON_FEATURES = [
  { name: "Vendor Management", starter: true, growth: true, enterprise: true },
  { name: "Purchase Requests", starter: true, growth: true, enterprise: true },
  {
    name: "Approval Workflows",
    starter: "Basic",
    growth: "Advanced",
    enterprise: "Custom",
  },
  { name: "Budget Controls", starter: false, growth: true, enterprise: true },
  { name: "GST Verification", starter: true, growth: true, enterprise: true },
  { name: "3-Way Matching", starter: false, growth: true, enterprise: true },
  { name: "ERP Integration", starter: false, growth: false, enterprise: true },
  {
    name: "Dedicated Support",
    starter: false,
    growth: false,
    enterprise: true,
  },
];

export default function PricingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50 font-sans selection:bg-emerald-500/30 selection:text-emerald-900">
      <Navbar />

      <main className="flex-1 pt-20">
        {/* Hero Section */}
        <section className="relative py-24 lg:py-32 overflow-hidden bg-emerald-950 text-center">
          {/* Background Effects */}
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-soft-light" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-gradient-to-b from-emerald-500/10 via-teal-500/5 to-transparent rounded-full blur-[100px] pointer-events-none" />

          <div className="container mx-auto px-4 relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 rounded-full bg-white/5 border border-white/10 text-emerald-300 text-sm font-medium backdrop-blur-md">
              Simple, Transparent Pricing
            </div>

            <h1 className="text-4xl lg:text-7xl font-bold tracking-tight text-white mb-6">
              Invest in{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-200">
                Clarity
              </span>
              , Not Chaos.
            </h1>
            <p className="text-xl text-emerald-100/70 max-w-2xl mx-auto leading-relaxed mb-10">
              Choose the plan that fits your growth stage. No hidden fees. No
              credit card required for trial.
            </p>
          </div>
        </section>

        {/* Pricing Cards */}
        <section className="py-24 relative">
          <div className="container mx-auto px-4 relative z-20">
            <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
              {PRICING_PLANS.map((plan, i) => (
                <div
                  key={i}
                  className={`
                    flex flex-col rounded-3xl p-8 relative transition-all duration-300
                    ${
                      plan.highlight
                        ? "bg-emerald-900 text-white ring-1 ring-emerald-500/50 shadow-2xl shadow-emerald-900/40 translate-y-[-16px] z-10"
                        : "bg-white text-slate-900 border border-slate-200 shadow-xl shadow-slate-200/50"
                    }
                  `}
                >
                  {/* Popular Badge */}
                  {plan.highlight && (
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-emerald-400 to-teal-400 text-emerald-950 text-xs font-bold px-4 py-1.5 rounded-full shadow-lg">
                      MOST POPULAR
                    </div>
                  )}

                  <div className="mb-8">
                    <h3
                      className={`text-xl font-semibold mb-2 ${plan.highlight ? "text-white" : "text-slate-900"}`}
                    >
                      {plan.name}
                    </h3>
                    <p
                      className={`text-sm ${plan.highlight ? "text-emerald-200/80" : "text-slate-500"}`}
                    >
                      {plan.desc}
                    </p>
                  </div>

                  <div className="mb-8">
                    <div className="flex items-baseline gap-1">
                      <span
                        className={`text-5xl font-bold tracking-tight ${plan.highlight ? "text-white" : "text-slate-900"}`}
                      >
                        {plan.price}
                      </span>
                      <span
                        className={`text-sm font-medium ${plan.highlight ? "text-emerald-200/60" : "text-slate-400"}`}
                      >
                        {plan.period}
                      </span>
                    </div>
                  </div>

                  <hr
                    className={`border-t mb-8 ${plan.highlight ? "border-white/10" : "border-slate-100"}`}
                  />

                  <ul className="space-y-4 mb-8 flex-1">
                    {plan.features.map((feature, j) => (
                      <li key={j} className="flex items-start gap-3 text-sm">
                        <CheckCircle2
                          className={`w-5 h-5 shrink-0 ${plan.highlight ? "text-emerald-400" : "text-emerald-600"}`}
                        />
                        <span
                          className={
                            plan.highlight
                              ? "text-emerald-100"
                              : "text-slate-600"
                          }
                        >
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <Link
                    href={plan.href}
                    className={`
                      w-full py-4 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 group
                      ${
                        plan.highlight
                          ? "bg-white text-emerald-900 hover:bg-emerald-50 hover:shadow-lg hover:shadow-white/10"
                          : "bg-emerald-950 text-white hover:bg-emerald-900 hover:shadow-lg hover:shadow-emerald-900/20"
                      }
                    `}
                  >
                    {plan.cta}
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Comparison Table */}
        <section className="py-24 bg-white border-b border-slate-100">
          <div className="container mx-auto px-4 max-w-5xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-slate-900 mb-4">
                Compare Features
              </h2>
              <p className="text-slate-600">
                Detailed breakdown of what&apos;s included.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr>
                    <th className="p-4 border-b-2 border-slate-100 w-1/3"></th>
                    <th className="p-4 border-b-2 border-slate-100 font-bold text-slate-900 text-center">
                      Starter
                    </th>
                    <th className="p-4 border-b-2 border-slate-100 font-bold text-emerald-700 text-center bg-emerald-50/50 rounded-t-xl">
                      Growth
                    </th>
                    <th className="p-4 border-b-2 border-slate-100 font-bold text-slate-900 text-center">
                      Enterprise
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {COMPARISON_FEATURES.map((row, i) => (
                    <tr
                      key={i}
                      className="group hover:bg-slate-50/50 transition-colors"
                    >
                      <td className="p-4 border-b border-slate-100 font-medium text-slate-700">
                        {row.name}
                      </td>
                      <td className="p-4 border-b border-slate-100 text-center text-slate-600">
                        {row.starter === true ? (
                          <Check className="w-5 h-5 text-emerald-500 mx-auto" />
                        ) : row.starter === false ? (
                          <X className="w-5 h-5 text-slate-300 mx-auto" />
                        ) : (
                          <span className="text-sm font-medium">
                            {row.starter}
                          </span>
                        )}
                      </td>
                      <td className="p-4 border-b border-slate-100 text-center text-slate-600 bg-emerald-50/30 group-hover:bg-emerald-50/80 transition-colors">
                        {row.growth === true ? (
                          <Check className="w-5 h-5 text-emerald-600 mx-auto" />
                        ) : row.growth === false ? (
                          <X className="w-5 h-5 text-slate-300 mx-auto" />
                        ) : (
                          <span className="text-sm font-medium text-emerald-900">
                            {row.growth}
                          </span>
                        )}
                      </td>
                      <td className="p-4 border-b border-slate-100 text-center text-slate-600">
                        {row.enterprise === true ? (
                          <Check className="w-5 h-5 text-emerald-500 mx-auto" />
                        ) : row.enterprise === false ? (
                          <X className="w-5 h-5 text-slate-300 mx-auto" />
                        ) : (
                          <span className="text-sm font-medium">
                            {row.enterprise}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-24 bg-slate-50">
          <div className="container mx-auto px-4 max-w-3xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-slate-900 mb-4">
                Frequently Asked Questions
              </h2>
              <p className="text-slate-600">
                Everything you need to know about billing.
              </p>
            </div>

            <div className="space-y-6">
              {[
                {
                  q: "Can I cancel my subscription anytime?",
                  a: "Yes, you can cancel your subscription at any time. Your access will continue until the end of your current billing period.",
                },
                {
                  q: "Is there a free trial?",
                  a: "We offer a 14-day free trial on the Starter and Growth plans. No credit card required to start.",
                },
                {
                  q: "What payment methods do you accept?",
                  a: "We accept all major credit cards, debit cards, UPI, and net banking via our secure payment partner Razorpay.",
                },
                {
                  q: "Do you offer GST invoices?",
                  a: "Yes, you will receive a GST-compliant invoice for every payment made on the platform.",
                },
              ].map((faq, i) => (
                <div
                  key={i}
                  className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow"
                >
                  <h3 className="font-bold text-slate-900 text-lg mb-2">
                    {faq.q}
                  </h3>
                  <p className="text-slate-600 leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <CTA />
      </main>

      <Footer />
    </div>
  );
}
