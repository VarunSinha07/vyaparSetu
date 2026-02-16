import { ShieldCheck, Building2, FileText, Lock, Shield } from "lucide-react";

export function Security() {
  return (
    <section id="security" className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto group relative">
          {/* Main Card */}
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-10 md:p-16 text-white overflow-hidden relative shadow-2xl border border-gray-700">
            {/* Background Effects */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />

            <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-900/50 border border-indigo-700/50 text-indigo-300 text-sm font-semibold mb-6">
                  <ShieldCheck className="w-4 h-4" />
                  Enterprise-Grade Security
                </div>
                <h2 className="text-4xl font-bold mb-6">
                  Your Data is Fort Knox.
                </h2>
                <p className="text-gray-300 mb-8 text-lg leading-relaxed">
                  Banking-grade encryption and data isolation protocols ensure
                  your business data stays secure and compliant.
                </p>

                <ul className="space-y-4">
                  {[
                    {
                      text: "Role-Based Access Control (RBAC)",
                      icon: ShieldCheck,
                    },
                    {
                      text: "Strict Data Isolation per Company",
                      icon: Building2,
                    },
                    { text: "Immutable Audit Logs", icon: FileText },
                    { text: "256-bit SSL Encryption", icon: Lock },
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-4 group/item">
                      <div className="p-2 rounded-lg bg-gray-700 group-hover/item:bg-indigo-600 transition-colors">
                        <item.icon className="w-5 h-5 text-gray-300 group-hover/item:text-white" />
                      </div>
                      <span className="text-gray-200 font-medium">
                        {item.text}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Visual Element */}
              <div className="hidden md:flex justify-center relative">
                <Shield className="w-64 h-64 text-gray-700 absolute -right-4 -bottom-4" />

                <div className="relative z-10 transform transition-transform duration-500 hover:scale-105 hover:rotate-2">
                  <ShieldCheck className="w-48 h-48 text-indigo-400 drop-shadow-[0_0_20px_rgba(79,70,229,0.4)]" />
                  <div className="absolute inset-0 bg-indigo-500 blur-3xl opacity-20 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
