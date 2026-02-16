import Link from "next/link";
import { Navbar } from "@/components/landing-page/Navbar";
import { Footer } from "@/components/landing-page/Footer";
import { CheckCircle, Globe, Lock, Users } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />

      <main className="flex-1">
        {/* Hero */}
        <section className="pt-20 pb-12 bg-gradient-to-br from-gray-50 to-white">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-5xl font-bold text-gray-900 mb-6">
                Why VyaparFlow?
              </h1>
              <p className="text-xl text-gray-600">
                Built for the unique challenges of Indian businesses. By MSMEs,
                for MSMEs.
              </p>
            </div>
          </div>
        </section>

        {/* Mission */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="bg-gradient-to-br from-indigo-50 to-emerald-50 rounded-2xl p-12 border-2 border-indigo-200 hover:border-indigo-400 transition-colors">
                <h2 className="text-4xl font-bold text-gray-900 mb-6">
                  Our Mission
                </h2>
                <p className="text-xl text-gray-700 leading-relaxed mb-6">
                  We help Indian MSMEs replace informal procurement systems with
                  structured, compliant workflows. Our platform turns chaos into
                  clarity — enabling businesses to focus on growth instead of
                  managing spreadsheets.
                </p>
                <p className="text-lg text-gray-600 leading-relaxed">
                  Every feature is built with GST compliance, role-based access,
                  and audit trails in mind. We understand the Indian business
                  landscape and have built VyaparFlow specifically for your
                  needs.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Core Principles */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Our Core Principles
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
              {[
                {
                  icon: Globe,
                  title: "India-Focused",
                  desc: "Built from the ground up for Indian MSMEs. We understand GST, compliance, and your business context.",
                },
                {
                  icon: Lock,
                  title: "Secure",
                  desc: "Bank-grade encryption, data isolation, and compliance documentation. Your data is safe.",
                },
                {
                  icon: CheckCircle,
                  title: "Compliance-Ready",
                  desc: "Every process designed with audit trails, compliance checks, and regulatory requirements in mind.",
                },
                {
                  icon: Users,
                  title: "Human-Centered",
                  desc: "Designed for real users. We listen to feedback and iterate constantly to improve.",
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="bg-white rounded-xl p-8 shadow-sm border-2 border-gray-200 hover:border-indigo-400 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="w-14 h-14 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center mb-4 group-hover:bg-emerald-100 group-hover:text-emerald-600">
                    <item.icon className="w-7 h-7" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {item.title}
                  </h3>
                  <p className="text-gray-600">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Technical Advantages */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Built on Modern Architecture
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                We use the latest technology to ensure reliability, scalability,
                and security.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
              {[
                {
                  title: "Cloud-Native",
                  desc: "Runs on secure cloud infrastructure. 99.9% uptime guarantee.",
                },
                {
                  title: "Multi-Tenant",
                  desc: "Each company's data completely isolated. Zero cross-contamination.",
                },
                {
                  title: "API-First",
                  desc: "Integrate with your existing systems via REST APIs and webhooks.",
                },
                {
                  title: "Real-Time Sync",
                  desc: "Live updates across all devices. See changes as they happen.",
                },
                {
                  title: "Mobile-Ready",
                  desc: "Fully responsive design. Manage on desktop, tablet, or phone.",
                },
                {
                  title: "Performance",
                  desc: "Optimized for speed. Pages load in milliseconds even with large datasets.",
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="bg-indigo-50 rounded-xl p-6 border-2 border-indigo-200 hover:border-indigo-400 hover:shadow-lg hover:bg-indigo-100/50 transition-all duration-300"
                >
                  <h3 className="font-bold text-lg text-gray-900 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-gray-600">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* You Can Trust Us */}
        <section className="py-20 bg-gradient-to-br from-indigo-50 to-emerald-50">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center">
                You Can Trust Us
              </h2>

              <div className="grid md:grid-cols-2 gap-12">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">
                    Security First
                  </h3>
                  <ul className="space-y-4">
                    {[
                      "256-bit SSL encryption for all data in transit",
                      "AES-256 encryption for data at rest",
                      "Role-based access control with fine permissions",
                      "Regular security audits and penetration testing",
                      "ISO 27001 compliance standards",
                      "GDPR and data privacy compliant",
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">
                    Reliability & Support
                  </h3>
                  <ul className="space-y-4">
                    {[
                      "99.9% uptime SLA with dedicated monitoring",
                      "Automatic daily backups with point-in-time recovery",
                      "Disaster recovery with failover systems",
                      "24/7 technical support for Enterprise customers",
                      "Transparent status page and incident communication",
                      "Regular feature updates and improvements",
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Success Stories Stats */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto text-center">
              {[
                {
                  number: "500+",
                  label: "Businesses",
                  sub: "using VyaparFlow",
                },
                {
                  number: "₹500Cr+",
                  label: "Transactions",
                  sub: "processed monthly",
                },
                { number: "99.9%", label: "Uptime", sub: "guaranteed" },
              ].map((item, i) => (
                <div
                  key={i}
                  className="bg-gradient-to-br from-indigo-50 to-emerald-50 rounded-xl p-8 border-2 border-indigo-200 hover:border-indigo-400 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="text-4xl font-bold text-indigo-600 mb-2">
                    {item.number}
                  </div>
                  <div className="text-xl font-bold text-gray-900 mb-1">
                    {item.label}
                  </div>
                  <div className="text-sm text-gray-600">{item.sub}</div>
                </div>
              ))}
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
              Join the Movement
            </h2>
            <p className="text-indigo-100 max-w-2xl mx-auto mb-8 text-lg leading-relaxed">
              Hundreds of Indian MSMEs are already transforming their
              procurement operations. Are you next?
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/sign-up"
                className="px-8 py-4 bg-white text-indigo-600 font-bold rounded-lg hover:bg-indigo-50 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1"
              >
                Start Free Now
              </Link>
              <Link
                href="/"
                className="px-8 py-4 bg-indigo-700/40 text-white font-semibold rounded-lg border border-white/30 hover:bg-indigo-700/60 hover:border-white/50 transition-all"
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
