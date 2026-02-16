import Link from "next/link";
import { Navbar } from "@/components/landing-page/Navbar";
import { Footer } from "@/components/landing-page/Footer";
import { Check, ArrowRight, ChevronDown } from "lucide-react";

const PRICING_PLANS = [
  {
    name: "Starter",
    subtitle: "For Small Teams",
    price: "₹999",
    period: "per month",
    desc: "Perfect for teams just starting their procurement journey.",
    features: [
      "Up to 5 users",
      "5 vendors",
      "50 POs/month",
      "Basic reporting",
      "Email support",
    ],
    cta: "Start Free Trial",
    highlight: false,
  },
  {
    name: "Growth",
    subtitle: "For Growing Businesses",
    price: "₹2,999",
    period: "per month",
    desc: "For businesses scaling their procurement operations.",
    features: [
      "Up to 20 users",
      "Unlimited vendors",
      "500 POs/month",
      "Advanced analytics",
      "Priority support",
      "Custom workflows",
      "API access",
    ],
    cta: "Start Free Trial",
    highlight: true,
  },
  {
    name: "Enterprise",
    subtitle: "For Large Organizations",
    price: "Custom",
    period: "pricing",
    desc: "Unlimited everything with dedicated support and custom features.",
    features: [
      "Unlimited users",
      "Unlimited vendors",
      "Unlimited transactions",
      "Custom integrations",
      "Dedicated account manager",
      "SLA guarantees",
      "On-premise option",
    ],
    cta: "Schedule Demo",
    highlight: false,
  },
];

const FAQ = [
  {
    q: "Do vendors need accounts?",
    a: "No. Vendors can submit invoices and receive payments via secure links without creating accounts.",
  },
  {
    q: "Is payment secure?",
    a: "Yes. All payments are processed through Razorpay with 256-bit SSL encryption. Your data is completely safe.",
  },
  {
    q: "Can I cancel anytime?",
    a: "Yes. No contracts, no lock-ins. Cancel anytime from your account settings.",
  },
  {
    q: "What happens to my data after cancellation?",
    a: "Your data remains accessible for 30 days. You can export all records at any time.",
  },
  {
    q: "Do you offer training?",
    a: "Yes. All plans include onboarding support. Enterprise customers get dedicated training.",
  },
  {
    q: "Can I upgrade or downgrade plans?",
    a: "Yes. Change plans anytime. We'll prorate the charges based on your cycle.",
  },
];

export default function PricingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />

      <main className="flex-1">
        {/* Hero */}
        <section className="pt-20 pb-12 bg-gradient-to-br from-gray-50 to-white">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-5xl font-bold text-gray-900 mb-6">
                Simple, Transparent Pricing
              </h1>
              <p className="text-xl text-gray-600">
                Scale from 5 to 500 users without hidden fees. 14-day free trial
                for all plans.
              </p>
            </div>
          </div>
        </section>

        {/* Pricing Cards */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-3 gap-6 max-w-7xl mx-auto">
              {PRICING_PLANS.map((plan, i) => (
                <div
                  key={i}
                  className={`rounded-2xl p-8 transition-all duration-300 hover:-translate-y-2 ${
                    plan.highlight
                      ? "bg-gradient-to-br from-indigo-600 to-emerald-600 text-white ring-2 ring-indigo-300 shadow-2xl hover:shadow-2xl hover:ring-indigo-400"
                      : "bg-white border-2 border-gray-200 hover:border-indigo-400 shadow-sm hover:shadow-xl"
                  }`}
                >
                  {/* Badge */}
                  {plan.highlight && (
                    <div className="inline-block px-4 py-1 bg-white/20 rounded-full text-white text-sm font-bold mb-4 border border-white/30">
                      Most Popular
                    </div>
                  )}

                  <div className="mb-6">
                    <h3
                      className={`text-3xl font-bold mb-1 ${plan.highlight ? "text-white" : "text-gray-900"}`}
                    >
                      {plan.name}
                    </h3>
                    <p
                      className={`text-sm mb-4 ${plan.highlight ? "text-indigo-100" : "text-gray-600"}`}
                    >
                      {plan.subtitle}
                    </p>

                    <div className="flex items-baseline gap-1 mb-4">
                      <div
                        className={`text-4xl font-bold ${plan.highlight ? "text-white" : "text-gray-900"}`}
                      >
                        {plan.price}
                      </div>
                      <div
                        className={`text-sm ${plan.highlight ? "text-indigo-100" : "text-gray-500"}`}
                      >
                        {plan.period}
                      </div>
                    </div>

                    <p
                      className={`text-sm ${plan.highlight ? "text-indigo-100" : "text-gray-600"}`}
                    >
                      {plan.desc}
                    </p>
                  </div>

                  {/* CTA Button */}
                  <Link
                    href={
                      plan.name === "Enterprise"
                        ? "mailto:demo@vyaparflow.in"
                        : "/sign-up"
                    }
                    className={`w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-bold mb-8 transition-all hover:-translate-y-1 ${
                      plan.highlight
                        ? "bg-white text-indigo-600 hover:bg-indigo-50 shadow-lg hover:shadow-xl"
                        : "bg-indigo-600 text-white hover:bg-indigo-700 shadow-md hover:shadow-lg"
                    }`}
                  >
                    {plan.cta}
                    <ArrowRight className="w-4 h-4" />
                  </Link>

                  {/* Features */}
                  <ul className="space-y-3">
                    {plan.features.map((feature, j) => (
                      <li
                        key={j}
                        className={`flex items-center gap-3 text-sm ${
                          plan.highlight ? "text-indigo-100" : "text-gray-600"
                        }`}
                      >
                        <Check
                          className={`w-5 h-5 flex-shrink-0 ${plan.highlight ? "text-white" : "text-emerald-500"}`}
                        />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* Fine Print */}
            <div className="text-center mt-12">
              <p className="text-gray-600 text-sm">
                All plans include 14-day free trial. No credit card required.
              </p>
              <p className="text-gray-500 text-xs mt-2">
                For demonstration purposes. Pricing is subject to change.
              </p>
            </div>
          </div>
        </section>

        {/* What's Included */}
        <section className="py-20 bg-gradient-to-br from-indigo-50 to-emerald-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                All Plans Include
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-4 max-w-4xl mx-auto">
              {[
                "Vendor management",
                "Purchase requests",
                "Approval workflows",
                "Purchase orders",
                "Invoice verification",
                "Secure payments",
                "Audit logs",
                "Role-based access",
                "GST compliance",
                "Analytics dashboard",
                "Mobile app access",
                "API documentation",
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/60 transition-colors"
                >
                  <Check className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                  <span className="text-gray-700">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Frequently Asked Questions
              </h2>
            </div>

            <div className="max-w-3xl mx-auto space-y-4">
              {FAQ.map((item, i) => {
                const colors = ["indigo", "emerald", "amber"] as const;
                const colorClass = colors[i % colors.length];
                const colorClasses = {
                  indigo:
                    "border-indigo-200 group-open:border-indigo-400 group-open:bg-indigo-50",
                  emerald:
                    "border-emerald-200 group-open:border-emerald-400 group-open:bg-emerald-50",
                  amber:
                    "border-amber-200 group-open:border-amber-400 group-open:bg-amber-50",
                };
                const colorDot = {
                  indigo: "bg-indigo-500",
                  emerald: "bg-emerald-500",
                  amber: "bg-amber-500",
                };
                const textColor = {
                  indigo: "group-open:text-indigo-600",
                  emerald: "group-open:text-emerald-600",
                  amber: "group-open:text-amber-600",
                };

                return (
                  <details
                    key={i}
                    className={`group bg-white rounded-xl border-2 ${colorClasses[colorClass]} p-6 cursor-pointer transition-all duration-300 hover:shadow-md`}
                  >
                    <summary
                      className={`flex items-center justify-between font-bold text-gray-900 ${textColor[colorClass]} transition-colors`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-3 h-3 rounded-full ${colorDot[colorClass]}`}
                        />
                        <span>{item.q}</span>
                      </div>
                      <ChevronDown className="w-5 h-5 group-open:rotate-180 transition-transform" />
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
        <section className="py-28 bg-gradient-to-r from-indigo-600 to-emerald-500 relative overflow-hidden">
          {/* Animated background orbs */}
          <div className="absolute top-10 right-20 w-72 h-72 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 left-10 w-96 h-96 bg-white/5 rounded-full blur-3xl" />

          <div className="container mx-auto px-4 relative z-10 text-center">
            <h2 className="text-4xl font-bold text-white mb-6">
              Questions About Pricing?
            </h2>
            <p className="text-indigo-100 max-w-2xl mx-auto mb-8 text-lg leading-relaxed">
              Our team is here to help. Send us a message and we will get back
              to you within 24 hours.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/sign-up"
                className="px-8 py-4 bg-white text-indigo-600 font-bold rounded-lg hover:bg-indigo-50 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1"
              >
                Start Free Trial
              </Link>
              <Link
                href="mailto:hello@vyaparflow.in"
                className="px-8 py-4 bg-indigo-700/40 text-white font-semibold rounded-lg border border-white/30 hover:bg-indigo-700/60 hover:border-white/50 transition-all"
              >
                Get in Touch
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
