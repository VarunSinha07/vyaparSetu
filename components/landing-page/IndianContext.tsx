import { FileText, Smartphone, Users, Layout, IndianRupee } from "lucide-react";

export function IndianContext() {
  return (
    <section className="py-24 bg-gradient-to-br from-blue-50 to-indigo-50 border-y border-blue-100 overflow-hidden relative">
      <div className="absolute right-0 top-0 w-64 h-64 bg-orange-100 rounded-full blur-[100px] opacity-40 -translate-y-1/2 translate-x-1/2 pointer-events-none" />
      <div className="absolute left-0 bottom-0 w-64 h-64 bg-green-100 rounded-full blur-[100px] opacity-40 translate-y-1/2 -translate-x-1/2 pointer-events-none" />

      <div className="container mx-auto px-4 text-center relative z-10">
        <h2 className="text-4xl font-extrabold text-gray-900 mb-6">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-500 via-blue-600 to-green-600">
            India-Ready
          </span>{" "}
          Procurement
        </h2>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-16">
          Foreign ERPs don&apos;t understand Indian businesses. We do.
        </p>

        <div className="flex flex-wrap justify-center gap-6 max-w-5xl mx-auto">
          {[
            {
              icon: FileText,
              text: "GST Compliance & Validation",
              color: "text-blue-700",
              bg: "bg-blue-100",
            },
            {
              icon: Smartphone,
              text: "Mobile-First Approvals",
              color: "text-indigo-700",
              bg: "bg-indigo-100",
            },
            {
              icon: Users,
              text: "Hierarchical Workflows",
              color: "text-purple-700",
              bg: "bg-purple-100",
            },
            {
              icon: Layout,
              text: "No-Training Interface",
              color: "text-pink-700",
              bg: "bg-pink-100",
            },
            {
              icon: IndianRupee,
              text: "Pay via UPI / IMPS",
              color: "text-green-700",
              bg: "bg-green-100",
            },
          ].map((item, i) => (
            <div
              key={i}
              className="bg-white pl-3 pr-6 py-3 rounded-full shadow-md border hover:border-blue-300 flex items-center gap-3 font-semibold transition-all hover:scale-105 cursor-default group"
            >
              <div className={`p-2 rounded-full ${item.bg} ${item.color}`}>
                <item.icon className="w-5 h-5" />
              </div>
              <span className="text-gray-800">{item.text}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
