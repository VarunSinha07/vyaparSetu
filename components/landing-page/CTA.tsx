import Link from "next/link";
import { ArrowRight, Zap, ShieldCheck, TrendingUp } from "lucide-react";

export function CTA() {
  return (
    <section className="relative py-24 bg-white overflow-hidden">
      {/* Background Subtle Pattern for Context */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

      <div className="container mx-auto px-4 max-w-5xl relative z-10">
        {/* Glass Card Container */}
        <div className="relative overflow-hidden rounded-3xl border border-emerald-500/20 shadow-2xl shadow-emerald-900/20 isolate group">
          {/* Glass Background */}
          <div className="absolute inset-0 bg-emerald-950/90 backdrop-blur-xl -z-20" />

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/50 via-teal-900/50 to-emerald-950/80 -z-10" />

          {/* Noise Texture */}
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-soft-light -z-10" />

          {/* Moving Shine Effect */}
          <div className="absolute inset-0 overflow-hidden rounded-3xl pointer-events-none">
            <div className="absolute top-0 left-0 h-full w-1/2 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 animate-shine" />
          </div>

          {/* Decorative Glows */}
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-emerald-500/30 rounded-full blur-3xl -z-10 pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-teal-500/30 rounded-full blur-3xl -z-10 pointer-events-none" />

          <div className="px-6 py-16 md:px-12 md:py-20 text-center relative z-10">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 mb-8 rounded-full bg-emerald-800/40 border border-emerald-500/30 text-emerald-100/90 text-sm font-medium backdrop-blur-md shadow-lg shadow-emerald-900/10">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
              </span>
              Join 500+ High-Growth MSMEs
            </div>

            <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight mb-6">
              Ready to{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-200">
                Modernize
              </span>{" "}
              Your Procurement?
            </h2>

            <p className="text-lg text-emerald-100/80 max-w-2xl mx-auto leading-relaxed mb-10">
              Replace chaos with structure. Start your free trial today and
              experience the difference clarity makes.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/sign-up"
                className="w-full sm:w-auto px-8 py-3.5 bg-white text-emerald-950 font-bold rounded-lg hover:bg-emerald-50 transition-all shadow-lg hover:shadow-emerald-500/20 hover:-translate-y-0.5 flex items-center justify-center gap-2 group/btn"
              >
                Start Free Trial
                <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
              </Link>

              <Link
                href="mailto:demo@vyaparflow.in"
                className="w-full sm:w-auto px-8 py-3.5 bg-emerald-900/40 text-white font-semibold rounded-lg border border-emerald-500/30 hover:bg-emerald-800/50 hover:border-emerald-400/50 backdrop-blur-md transition-all flex items-center justify-center gap-2"
              >
                Book a Demo
              </Link>
            </div>

            {/* Stats Divider */}
            <div className="pt-10 mt-12 border-t border-emerald-500/20 grid grid-cols-1 md:grid-cols-3 gap-6 text-left md:text-center">
              {[
                {
                  icon: Zap,
                  label: "Fast Setup",
                  desc: "Ready in minutes",
                },
                {
                  icon: ShieldCheck,
                  label: "Secure",
                  desc: "Bank-grade encryption",
                },
                {
                  icon: TrendingUp,
                  label: "Efficient",
                  desc: "40% faster processing",
                },
              ].map((stat, i) => (
                <div
                  key={i}
                  className="flex md:flex-col items-center gap-3 md:gap-2"
                >
                  <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                    <stat.icon className="w-5 h-5 text-emerald-400 shrink-0" />
                  </div>
                  <div className="flex flex-row md:flex-col gap-1 md:gap-0 items-baseline md:items-center">
                    <span className="font-semibold text-emerald-50 text-sm">
                      {stat.label}
                    </span>
                    <span className="hidden md:inline text-xs text-emerald-200/50">
                      -
                    </span>
                    <span className="text-xs text-emerald-200/50">
                      {stat.desc}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
