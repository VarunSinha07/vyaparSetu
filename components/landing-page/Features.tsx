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
  const features = [
    {
      icon: Users,
      title: "Vendor Management",
      desc: "Centralized vendor database with compliance tracking, document storage, and performance ratings.",
      color: "emerald",
      span: "md:col-span-2 lg:col-span-1",
    },
    {
      icon: FileText,
      title: "Smart Purchase Requests",
      desc: "Streamlined internal requests with budgetary controls and real-time status tracking.",
      color: "teal",
      span: "md:col-span-1 lg:col-span-1",
    },
    {
      icon: CheckSquare,
      title: "Advanced Workflows",
      desc: "Multi-level approval hierarchies based on amount, department, or category rules.",
      color: "green",
      span: "md:col-span-1 lg:col-span-1",
    },
    {
      icon: FileCheck,
      title: "Automated POs",
      desc: "One-click PO generation from approved requests with custom templates and branding.",
      color: "emerald",
      span: "md:col-span-2 lg:col-span-2",
    },
    {
      icon: FileSearch,
      title: "Invoice Matching",
      desc: "AI-powered 3-way matching to automatically reconcile invoices with POs and GRNs.",
      color: "teal",
      span: "md:col-span-1 lg:col-span-1",
    },
    {
      icon: CreditCard,
      title: "Integrated Payments",
      desc: "Seamless vendor payouts via Razorpay/UPI directly from the validated invoice screen.",
      color: "green",
      span: "md:col-span-1 lg:col-span-1",
    },
    {
      icon: BarChart3,
      title: "Real-time Analytics",
      desc: "Deep insights into spending patterns, vendor performance, and procurement efficiency.",
      color: "emerald",
      span: "md:col-span-2 lg:col-span-2",
    },
  ];

  return (
    <section id="features" className="py-32 bg-gray-50/30">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-20 max-w-3xl mx-auto">
          
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 tracking-tight leading-tight">
            Powerful Procurement, <br />
            <span className="bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
              Simplified for Growth.
            </span>
          </h2>
          <p className="text-xl text-gray-600 leading-relaxed">
            Replace scattered spreadsheets with a unified operating system built
            for modern Indian businesses.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto group/bento">
          {features.map((item, i) => {
            const colors = {
              emerald:
                "text-emerald-600 bg-emerald-50 group-hover:bg-emerald-600 group-hover:text-white border-emerald-100",
              teal: "text-teal-600 bg-teal-50 group-hover:bg-teal-600 group-hover:text-white border-teal-100",
              green:
                "text-green-600 bg-green-50 group-hover:bg-green-600 group-hover:text-white border-green-100",
            };

            const colorKey = item.color as keyof typeof colors;

            return (
              <div
                key={i}
                className={`group relative p-8 bg-white rounded-3xl border border-gray-100 hover:border-emerald-200 shadow-sm hover:shadow-xl hover:shadow-emerald-100/50 transition-all duration-300 ${item.span} flex flex-col justify-between overflow-hidden group-hover/bento:hover:opacity-100 group-hover/bento:opacity-50`}
              >
                {/* Hover Gradient Background */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br from-${item.color}-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                />

                <div className="relative z-10">
                  {/* Icon Header */}
                  <div className="flex justify-between items-start mb-6">
                    <div
                      className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 ${colors[colorKey]}`}
                    >
                      <item.icon className="w-7 h-7" strokeWidth={1.5} />
                    </div>
                  </div>

                  {/* Text Content */}
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-emerald-700 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-gray-500 leading-relaxed text-sm font-medium group-hover:text-gray-600">
                    {item.desc}
                  </p>
                </div>

                {/* Decorative Bottom Line */}
                <div
                  className={`absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-${item.color}-400 to-${item.color}-200 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left`}
                />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
