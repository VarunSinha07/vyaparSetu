import { ShieldCheck, Building2, FileText, Lock, Shield } from "lucide-react";

export function Security() {
  return (
    <section id="security" className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto group relative">
          {/* Main Card */}
          <div className="bg-[#111827] rounded-3xl p-10 md:p-16 text-white overflow-hidden relative shadow-2xl">
            {/* Background Grid & Effects */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150"></div>
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-600/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />

            <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-900/50 border border-blue-700/50 text-blue-300 text-sm font-semibold mb-6">
                  <ShieldCheck className="w-4 h-4" />
                  Enterprise-Grade Security
                </div>
                <h2 className="text-4xl font-bold mb-6">
                  Your Data is Fort Knox.
                </h2>
                <p className="text-gray-400 mb-8 text-lg">
                  We use banking-grade encryption and isolation protocols to
                  ensure your business data never leaks.
                </p>

                <ul className="space-y-5">
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
                      <div className="p-2 rounded-lg bg-gray-800 group-hover/item:bg-blue-600 transition-colors">
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
                <div className="absolute inset-0 bg-gradient-to-t from-[#111827] to-transparent z-20 h-full w-full pointer-events-none" />

                <Shield className="w-64 h-64 text-gray-800 absolute -right-4 -bottom-4 animate-pulse duration-1000" />

                <div className="relative z-10 transform transition-transform duration-500 hover:scale-105 hover:rotate-2">
                  <div className="relative">
                    <ShieldCheck className="w-48 h-48 text-blue-500 drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]" />
                    <div className="absolute inset-0 bg-blue-400 blur-2xl opacity-20 rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
