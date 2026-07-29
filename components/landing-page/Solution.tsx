import {
  Building2,
  CheckCircle2,
  FileText,
  ScanLine,
  CreditCard,
  History,
  Sparkles,
} from "lucide-react";

export function Solution() {
  const capabilities = [
    {
      title: "Vendor Registry & Onboarding",
      desc: "Centralize supplier profiles, bank accounts, GST tax certificates, and historical fulfillment ratings.",
      icon: Building2,
      badge: "GSTIN API",
      bg: "bg-emerald-50 border-emerald-200 text-emerald-700",
    },
    {
      title: "Role-Based Approval Hierarchies",
      desc: "Set spending thresholds by department, CAPEX/OPEX category, or manager role with instant notifications.",
      icon: CheckCircle2,
      badge: "RBAC SECURED",
      bg: "bg-blue-50 border-blue-200 text-blue-700",
    },
    {
      title: "1-Click Purchase Orders",
      desc: "Convert approved PRs into professional, GST-compliant POs dispatched automatically via WhatsApp & email.",
      icon: FileText,
      badge: "INSTANT PDF",
      bg: "bg-teal-50 border-teal-200 text-teal-700",
    },
    {
      title: "Automated 3-Way Invoice Matching",
      desc: "Reconcile vendor invoices against PO terms and GRN received quantities to stop overpayments.",
      icon: ScanLine,
      badge: "ZERO OVERBILL",
      bg: "bg-emerald-50 border-emerald-200 text-emerald-700",
    },
    {
      title: "Razorpay & Bank Disbursal",
      desc: "Schedule and release vendor payouts straight from your verified invoice workflow.",
      icon: CreditCard,
      badge: "RAZORPAY SECURED",
      bg: "bg-indigo-50 border-indigo-200 text-indigo-700",
    },
    {
      title: "GST Tax Credit (ITC) Audit",
      desc: "Direct GST portal API checks ensure 100% tax credit compliance before payout release.",
      icon: History,
      badge: "100% ITC CLAIM",
      bg: "bg-teal-50 border-teal-200 text-teal-700",
    },
  ];

  return (
    <section className="py-24 bg-gradient-to-b from-slate-50/80 to-emerald-50/30 border-b border-emerald-100 relative">
      <div className="container mx-auto px-6 lg:px-12 max-w-7xl">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-emerald-200 shadow-2xs text-emerald-800 text-xs font-extrabold">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>Built for Modern Operations</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            One Platform. Total Spend Transparency.
          </h2>
          <p className="text-slate-600 text-base font-normal">
            From purchase request to final bank transfer, every transaction is logged, verified, and audit-ready.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {capabilities.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="bg-white border border-slate-200/90 rounded-2xl p-7 shadow-xs hover:shadow-md hover:border-emerald-300 transition-all space-y-5 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="p-3 rounded-xl bg-emerald-100 text-emerald-800 font-bold shadow-2xs">
                      <Icon className="w-5 h-5 text-emerald-700" />
                    </div>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border ${item.bg}`}>
                      {item.badge}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">{item.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed font-normal">{item.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
