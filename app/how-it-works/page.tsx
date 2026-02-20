import { Navbar } from "@/components/landing-page/Navbar";
import { Footer } from "@/components/landing-page/Footer";
import { CTA } from "@/components/landing-page/CTA";
import {
  CheckCircle,
  ChevronDown,
  UserPlus,
  FileText,
  CheckSquare,
  FileOutput,
  Receipt,
  CreditCard,
  ShieldCheck,
  Zap,
  Clock,
} from "lucide-react";

const STEPS = [
  {
    number: "1",
    title: "Create Workspace",
    desc: "Set up your company profile and invite team members with specific roles (Admin, Manager, Creator).",
    icon: UserPlus,
    details: [
      "Instant workspace setup",
      "Role-based invitations",
      "Approval hierarchy configuration",
    ],
  },
  {
    number: "2",
    title: "Raise Request",
    desc: "Team members create detailed purchase requests with specifications, attachments, and vendor preferences.",
    icon: FileText,
    details: [
      "Standardized request forms",
      "Document attachments",
      "Budget tagging",
    ],
  },
  {
    number: "3",
    title: "Smart Approval",
    desc: "Managers receive instant notifications to review requests against budgets and compliance policies.",
    icon: CheckSquare,
    details: [
      "One-click approvals",
      "Budget visibility",
      "Comment & feedback loop",
    ],
  },
  {
    number: "4",
    title: "Auto-Generate PO",
    desc: "Approved requests are instantly converted into professional, tax-compliant Purchase Orders.",
    icon: FileOutput,
    details: [
      "GST-compliant templates",
      "Auto-HSN/SAC mapping",
      "Vendor email notifications",
    ],
  },
  {
    number: "5",
    title: "Invoice Matching",
    desc: "Upload vendor invoices to automatically match them against the original PO and Goods Received Note (GRN).",
    icon: Receipt,
    details: ["3-way matching", "Duplicate detection", "Variance flagging"],
  },
  {
    number: "6",
    title: "Secure Payment",
    desc: "Initiate payments directly through the dashboard via UPI, NEFT, or RTGS with a complete audit trail.",
    icon: CreditCard,
    details: [
      "Integrated payment gateway",
      "Bulk payouts",
      "Payment reconciliation",
    ],
  },
];

const FAQS = [
  {
    q: "How long does setup take?",
    a: "Setup takes less than 10 minutes. You can import your existing vendors via CSV and invite your team immediately. No technical training is required.",
  },
  {
    q: "Do vendors need to create an account?",
    a: "No. Your vendors receive secure links via email/WhatsApp to interact with POs and upload invoices. We keep it friction-free for them.",
  },
  {
    q: "Is my data secure?",
    a: "Absolutely. We use bank-grade 256-bit encryption and strict data isolation. Your financial data is never shared with third parties.",
  },
  {
    q: "Does it work for service procurement?",
    a: "Yes! VyaparFlow handles both goods and services procurement, including complex milestones and retainer contracts.",
  },
  {
    q: "What about GST compliance?",
    a: "We are built for India. The system automatically validates GSTINs and ensures every PO and Invoice is compliant with current tax laws.",
  },
];

export default function HowItWorksPage() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50 font-sans selection:bg-emerald-500/30 selection:text-emerald-900">
      <Navbar />

      <main className="flex-1 pt-20">
        {/* Hero Section */}
        <section className="relative py-24 lg:py-32 overflow-hidden bg-emerald-950">
          {/* Background Effects */}
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-soft-light" />
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-emerald-500/20 to-teal-500/10 rounded-full blur-[100px] translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-teal-900/40 rounded-full blur-[100px] -translate-x-1/2 translate-y-1/2" />

          <div className="container mx-auto px-4 relative z-10 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 mb-8 rounded-full bg-emerald-900/50 border border-emerald-500/30 text-emerald-300 text-sm font-medium backdrop-blur-md">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              Simple. Structured. Secure.
            </div>

            <h1 className="text-4xl lg:text-7xl font-bold tracking-tight text-white mb-6">
              From Chaos to Clarity in <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-200">
                6 Simple Steps
              </span>
            </h1>
            <p className="text-xl text-emerald-100/70 max-w-2xl mx-auto leading-relaxed">
              Replace endless email threads and scattered spreadsheets with a
              single, unified workflow designed for Indian MSMEs.
            </p>
          </div>
        </section>

        {/* Process Steps */}
        <section className="py-24 relative overflow-hidden">
          <div className="container mx-auto px-4 max-w-5xl relative z-10">
            {/* Connecting Line (Desktop) */}
            <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-emerald-200/50 via-emerald-500/20 to-transparent hidden md:block" />

            <div className="space-y-12 md:space-y-24">
              {STEPS.map((step, i) => (
                <div
                  key={i}
                  className={`flex flex-col md:flex-row items-center gap-8 md:gap-16 relative ${i % 2 === 0 ? "" : "md:flex-row-reverse"}`}
                >
                  {/* Timeline Dot (Desktop) */}
                  <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-4 border-white bg-emerald-500 shadow-lg hidden md:block z-20" />

                  {/* Icon Side */}
                  <div className="w-full md:w-1/2 flex justify-center md:justify-end group">
                    {/* For even items on desktop, justify-start is handled by flex-row-reverse */}
                    <div
                      className={`relative w-24 h-24 md:w-32 md:h-32 rounded-3xl bg-white border border-slate-100 shadow-xl shadow-emerald-900/5 flex items-center justify-center rotate-3 transition-transform duration-500 group-hover:rotate-6 group-hover:scale-110 ${i % 2 !== 0 ? "md:mr-auto" : "md:ml-auto"}`}
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 to-transparent opacity-50 rounded-3xl" />
                      <step.icon className="w-10 h-10 md:w-14 md:h-14 text-emerald-600" />
                      <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-emerald-900 text-white flex items-center justify-center font-bold text-sm border-2 border-white">
                        {step.number}
                      </div>
                    </div>
                  </div>

                  {/* Content Side */}
                  <div className="w-full md:w-1/2 text-center md:text-left">
                    <h3 className="text-2xl font-bold text-slate-900 mb-4">
                      {step.title}
                    </h3>
                    <p className="text-slate-600 mb-6 leading-relaxed">
                      {step.desc}
                    </p>

                    <ul className="space-y-2 inline-block text-left">
                      {step.details.map((detail, j) => (
                        <li
                          key={j}
                          className="flex items-center gap-3 text-sm text-slate-700 font-medium"
                        >
                          <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                          {detail}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Value Props Grid */}
        <section className="py-24 bg-white border-y border-slate-100">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-slate-900 mb-4">
                Why It Works
              </h2>
              <p className="text-slate-600 max-w-2xl mx-auto">
                Designed to remove friction, not add complexity.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {[
                {
                  icon: Clock,
                  title: "Save 15 Hours/Week",
                  desc: "Automate manual data entry and follow-ups so you can focus on strategy.",
                },
                {
                  icon: ShieldCheck,
                  title: "100% Compliance",
                  desc: "Never worry about missing documents or tax errors again.",
                },
                {
                  icon: Zap,
                  title: "Instant Visibility",
                  desc: "Know exactly where every rupee is going in real-time.",
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="bg-slate-50 rounded-2xl p-8 border border-slate-100 text-center hover:bg-white hover:shadow-xl hover:shadow-emerald-900/5 transition-all duration-300"
                >
                  <div className="w-12 h-12 mx-auto bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-700 mb-6">
                    <item.icon className="w-6 h-6" />
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

        {/* FAQ Section */}
        <section className="py-24 bg-slate-50">
          <div className="container mx-auto px-4 max-w-3xl">
            <h2 className="text-3xl font-bold text-slate-900 mb-12 text-center">
              Frequently Asked Questions
            </h2>

            <div className="space-y-4">
              {FAQS.map((faq, i) => (
                <details
                  key={i}
                  className="group bg-white rounded-xl border border-slate-200 overflow-hidden [&_summary::-webkit-details-marker]:hidden"
                >
                  <summary className="flex items-center justify-between p-6 cursor-pointer font-semibold text-slate-900 hover:text-emerald-700 transition-colors">
                    {faq.q}
                    <div className="ml-4 p-1 bg-slate-100 rounded-full group-open:bg-emerald-100 text-slate-400 group-open:text-emerald-600 transition-colors">
                      <ChevronDown className="w-4 h-4 transition-transform duration-300 group-open:rotate-180" />
                    </div>
                  </summary>
                  <div className="px-6 pb-6 text-slate-600 leading-relaxed animate-in slide-in-from-top-2 fade-in duration-200">
                    {faq.a}
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* Reusing the Global CTA */}
        <CTA />
      </main>

      <Footer />
    </div>
  );
}
