import {
  FileText,
  Smartphone,
  Users,
  Layout,
  IndianRupee,
  LucideIcon,
} from "lucide-react";

interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
  color: string;
  bg: string;
  border: string;
}

export function IndianContext() {
  const features: Feature[] = [
    {
      icon: FileText,
      title: "GST Compliance & Validation",
      description:
        "Automated GSTIN verification and seamless GSTR-2A reconciliation built-in.",
      color: "text-orange-600",
      bg: "bg-orange-100",
      border: "border-orange-200",
    },
    {
      icon: Smartphone,
      title: "Mobile-First Approvals",
      description:
        "Approve purchase orders and invoices instantly via our mobile app.",
      color: "text-emerald-700",
      bg: "bg-emerald-100",
      border: "border-emerald-200",
    },
    {
      icon: Users,
      title: "Hierarchical Workflows",
      description:
        "Custom approval chains that mirror your org chart, not rigid software rules.",
      color: "text-green-700",
      bg: "bg-green-100",
      border: "border-green-200",
    },
    {
      icon: Layout,
      title: "No-Training Interface",
      description:
        "Consumer-grade UI that your team can start using immediately without manuals.",
      color: "text-teal-700",
      bg: "bg-teal-100",
      border: "border-teal-200",
    },
    {
      icon: IndianRupee,
      title: "Pay via UPI / IMPS",
      description:
        "Direct vendor payments using India's fastest payment rails securely.",
      color: "text-blue-700",
      bg: "bg-blue-100",
      border: "border-blue-200",
    },
  ];

  return (
    <section className="py-24 bg-gradient-to-br from-emerald-50 via-white to-teal-50 border-y border-emerald-100 overflow-hidden relative">
      <div className="absolute right-0 top-0 w-96 h-96 bg-orange-100/50 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
      <div className="absolute left-0 bottom-0 w-96 h-96 bg-emerald-100/50 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2 pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 tracking-tight">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-500 via-emerald-600 to-green-600 animate-gradient-x">
              India-Ready
            </span>{" "}
            Procurement
          </h2>
          <p className="text-xl text-gray-600 leading-relaxed">
            Foreign ERPs struggle with Indian business nuances. We built
            VyaparFlow specifically for the unique needs of Indian enterprises.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {features.slice(0, 3).map((feature, i) => (
            <FeatureCard key={i} feature={feature} />
          ))}
          {/* Center the last two items on large screens */}
          <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 lg:w-2/3 lg:mx-auto">
            {features.slice(3, 5).map((feature, i) => (
              <FeatureCard key={i + 3} feature={feature} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function FeatureCard({ feature }: { feature: Feature }) {
  return (
    <div className="group relative bg-white/60 backdrop-blur-sm rounded-2xl p-8 shadow-sm border border-emerald-100/50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden">
      <div
        className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-transparent to-emerald-50/50 rounded-bl-[100px] -mr-8 -mt-8 transition-transform group-hover:scale-110 duration-500`}
      />

      <div
        className={`w-14 h-14 rounded-2xl ${feature.bg} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 relative z-10`}
      >
        <feature.icon className={`w-7 h-7 ${feature.color}`} />
      </div>

      <h3 className="text-xl font-bold text-gray-900 mb-3 relative z-10 group-hover:text-emerald-700 transition-colors">
        {feature.title}
      </h3>

      <p className="text-gray-600 leading-relaxed relative z-10">
        {feature.description}
      </p>
    </div>
  );
}
