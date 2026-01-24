import Link from "next/link";
import {
  Briefcase,
  CheckCircle,
  FileText,
  CreditCard,
  BarChart,
} from "lucide-react";

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-20 pb-20 lg:pt-32 lg:pb-32 bg-white">
      {/* Background Blobs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div
          className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-blue-100 rounded-full blur-[80px] opacity-60 animate-pulse"
          style={{ animationDuration: "4s" }}
        />
        <div className="absolute bottom-[-10%] left-[-5%] w-[40%] h-[40%] bg-indigo-50 rounded-full blur-[80px] opacity-60" />
      </div>

      <div className="container mx-auto px-4 text-center relative z-10">
        <div className="max-w-4xl mx-auto">

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-gray-900 tracking-tight mb-8 drop-shadow-sm">
            Procurement, Without the{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              Chaos
            </span>
            .
          </h1>
          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
            VyaparFlow helps Indian MSMEs manage vendors, approvals, invoices,
            and payments through a secure, role-based platform — no
            spreadsheets, no confusion, no delays.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
            <Link
              href="/sign-up"
              className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 border border-transparent text-lg font-bold rounded-xl text-white bg-blue-600 hover:bg-blue-700 hover:-translate-y-1 transition-all shadow-xl shadow-blue-200"
            >
              Get Started for Your Company
            </Link>
            <Link
              href="#problem"
              className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 border border-gray-200 text-lg font-bold rounded-xl text-gray-700 bg-white hover:bg-gray-50 hover:-translate-y-1 transition-all"
            >
              See the Transformation
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-left max-w-5xl mx-auto">
            {[
              { icon: Briefcase, text: "Vendor & Purchase Management" },
              { icon: CheckCircle, text: "Approval Workflows" },
              { icon: FileText, text: "GST-Aware Invoicing" },
              { icon: CreditCard, text: "Razorpay-Powered Payments" },
              { icon: BarChart, text: "Audit-Ready Reports" },
            ].map((item, i) => (
              <div
                key={i}
                className="flex items-center gap-3 p-4 rounded-xl bg-white hover:bg-blue-50/50 hover:shadow-md transition-all border border-gray-100 cursor-default group"
              >
                <div className="p-2 bg-blue-100 rounded-lg text-blue-600 group-hover:scale-110 transition-transform">
                  <item.icon className="w-5 h-5 flex-shrink-0" />
                </div>
                <span className="text-gray-700 font-semibold text-sm">
                  {item.text}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
