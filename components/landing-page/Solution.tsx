import {
  Building2,
  CheckCircle2,
  FileText,
  ScanLine,
  CreditCard,
  History,
} from "lucide-react";

export function Solution() {
  const features = [
    {
      title: "Vendor Management",
      desc: "Centralized registry with compliance tracking & documents.",
      icon: Building2,
      color: "text-blue-500",
      bg: "bg-blue-50",
      border: "hover:border-blue-200",
    },
    {
      title: "Smart Approvals",
      desc: "Multi-level workflows that move fast and enforce policy.",
      icon: CheckCircle2,
      color: "text-emerald-500",
      bg: "bg-emerald-50",
      border: "hover:border-emerald-200",
    },
    {
      title: "Auto PO Generation",
      desc: "Create professional POs from requests in one click.",
      icon: FileText,
      color: "text-purple-500",
      bg: "bg-purple-50",
      border: "hover:border-purple-200",
    },
    {
      title: "Invoice Verification",
      desc: "3-way matching to prevent overpayment and errors.",
      icon: ScanLine,
      color: "text-amber-500",
      bg: "bg-amber-50",
      border: "hover:border-amber-200",
    },
    {
      title: "Secure Payments",
      desc: "Direct bank transfers via Razorpay Integration.",
      icon: CreditCard,
      color: "text-rose-500",
      bg: "bg-rose-50",
      border: "hover:border-rose-200",
      featured: true,
    },
    {
      title: "Audit Trails",
      desc: "Every action logged for complete transparency.",
      icon: History,
      color: "text-cyan-500",
      bg: "bg-cyan-50",
      border: "hover:border-cyan-200",
    },
  ];

  return (
    <section className="relative py-32 bg-slate-50 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -right-[10%] w-[700px] h-[700px] rounded-full bg-emerald-100/40 blur-[100px]" />
        <div className="absolute -bottom-[20%] -left-[10%] w-[600px] h-[600px] rounded-full bg-blue-100/40 blur-[100px]" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <div className="inline-flex items-center justify-center px-4 py-1.5 mb-6 rounded-full bg-white border border-slate-200 shadow-sm">
            <span className="text-sm font-semibold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              End-to-End Procurement
            </span>
          </div>

          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 tracking-tight">
            One Platform. Complete Control.
          </h2>
          <p className="text-lg text-slate-600 leading-relaxed">
            From onboarding vendors to final payments, VyaparFlow centralizes
            every step of your procurement lifecycle in a single, intuitive
            dashboard.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {features.map((feature, i) => (
            <div
              key={i}
              className={`group relative bg-white rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 ${feature.border}`}
            >
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 ${feature.bg} transition-colors`}
              >
                <feature.icon className={`w-6 h-6 ${feature.color}`} />
              </div>

              <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-emerald-700 transition-colors">
                {feature.title}
              </h3>

              <p className="text-slate-600 leading-relaxed">{feature.desc}</p>

              {/* Hover effect arrow */}
              <div className="absolute top-8 right-8 opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-x-1">
                <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-slate-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
