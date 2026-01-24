import {
  Briefcase,
  FileSpreadsheet,
  FileText,
  CheckCircle,
  CreditCard,
  BarChart,
  ArrowUpRight,
} from "lucide-react";

export function Features() {
  return (
    <section id="features" className="py-24 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-extrabold text-gray-900 mb-6">
            Power-Packed Features
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Everything you need to run a world-class procurement operation.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {[
            {
              icon: Briefcase,
              title: "Vendor Management",
              desc: "Onboard vendors with GST verification, document storage, and performance tracking.",
            },
            {
              icon: FileSpreadsheet,
              title: "Purchase Requests",
              desc: "Standardized request forms that capture the right data every single time.",
            },
            {
              icon: FileText,
              title: "Purchase Orders",
              desc: "Auto-generate PDF POs with terms, tax breakdowns, and branding.",
            },
            {
              icon: CheckCircle,
              title: "3-Way Matching",
              desc: "Automatically reconcile Invoices against POs and Goods Received Notes (GRN).",
            },
            {
              icon: CreditCard,
              title: "Integrated Payments",
              desc: "Execute single or batch payments via UPI, NEFT, or RTGS directly from the dashboard.",
            },
            {
              icon: BarChart,
              title: "Spend Analytics",
              desc: "Real-time dashboards showing category spend, vendor performance, and savings.",
            },
          ].map((item, i) => (
            <div
              key={i}
              className="group bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl hover:border-blue-100 transition-all duration-300"
            >
              <div className="flex justify-between items-start mb-6">
                <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 shadow-inner">
                  <item.icon className="w-7 h-7" />
                </div>
                <ArrowUpRight className="w-5 h-5 text-gray-300 group-hover:text-blue-500 transition-colors" />
              </div>

              <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                {item.title}
              </h3>
              <p className="text-gray-600 leading-relaxed text-sm">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
