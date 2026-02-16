import {
  Users,
  FileText,
  CheckSquare,
  FileCheck,
  FileSearch,
  CreditCard,
  BarChart3,
} from "lucide-react";

export function Features() {
  return (
    <section id="features" className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Powerful Procurement, Simplified
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Every feature is built for efficiency, compliance, and transparency.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {[
            {
              icon: Users,
              title: "Vendor Management",
              desc: "Add vendors, manage compliance details, track performance.",
              color: "indigo",
            },
            {
              icon: FileText,
              title: "Purchase Requests",
              desc: "Create and track internal demands with full visibility.",
              color: "emerald",
            },
            {
              icon: CheckSquare,
              title: "Approval Workflows",
              desc: "Multi-level approvals with complete audit trails.",
              color: "amber",
            },
            {
              icon: FileCheck,
              title: "Purchase Orders",
              desc: "Generate formal POs instantly from verified requests.",
              color: "indigo",
            },
            {
              icon: FileSearch,
              title: "Invoice Verification",
              desc: "Match invoices with POs and ensure tax compliance.",
              color: "emerald",
            },
            {
              icon: CreditCard,
              title: "Secure Payments",
              desc: "Pay vendors via Razorpay with complete traceability.",
              color: "amber",
            },
            {
              icon: BarChart3,
              title: "Analytics & Reports",
              desc: "Track spending, performance, and procurement health.",
              color: "indigo",
            },
          ].map((item, i) => {
            const colorClasses = {
              indigo:
                "bg-indigo-50 group-hover:bg-indigo-600 text-indigo-600 group-hover:text-white border-indigo-100 group-hover:border-indigo-600 shadow-sm shadow-indigo-100",
              emerald:
                "bg-emerald-50 group-hover:bg-emerald-600 text-emerald-600 group-hover:text-white border-emerald-100 group-hover:border-emerald-600 shadow-sm shadow-emerald-100",
              amber:
                "bg-amber-50 group-hover:bg-amber-600 text-amber-600 group-hover:text-white border-amber-100 group-hover:border-amber-600 shadow-sm shadow-amber-100",
            };

            return (
              <div
                key={i}
                className="group bg-white p-8 rounded-xl shadow-sm border border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <div
                  className={`w-12 h-12 rounded-lg flex items-center justify-center mb-6 transition-all duration-300 ${colorClasses[item.color as keyof typeof colorClasses]}`}
                >
                  <item.icon className="w-6 h-6" />
                </div>

                <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">
                  {item.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
