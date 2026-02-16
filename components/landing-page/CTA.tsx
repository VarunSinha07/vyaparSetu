import Link from "next/link";
import { ArrowRight, Check, Zap, Shield, TrendingUp } from "lucide-react";

export function CTA() {
  return (
    <section className="relative overflow-hidden py-40 px-4">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-indigo-500 to-emerald-500 z-0">
        {/* Floating orbs */}
        <div className="absolute top-[-200px] right-[-100px] w-[500px] h-[500px] bg-white/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-200px] left-[-100px] w-[400px] h-[400px] bg-emerald-300/10 rounded-full blur-[100px]" />
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,transparent_1px,rgba(255,255,255,.03)_1px)] bg-[length:40px_40px]" />
      </div>

      <div className="container mx-auto relative z-10 max-w-4xl">
        {/* Main Content */}
        <div className="text-center mb-12">
          <h2 className="text-5xl sm:text-6xl font-bold text-white mb-6 tracking-tight drop-shadow-lg">
            Ready to Modernize Your Procurement?
          </h2>
          <p className="text-lg sm:text-xl text-emerald-50 mb-10 leading-relaxed max-w-2xl mx-auto drop-shadow">
            Join 500+ Indian MSMEs who replaced chaos with structure,
            spreadsheets with clarity, and delays with confidence.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-4 mb-12">
          {[
            { icon: Zap, label: "Setup in minutes", value: "Not months" },
            {
              icon: Shield,
              label: "Bank-grade security",
              value: "Your data is safe",
            },
            {
              icon: TrendingUp,
              label: "40% faster",
              value: "Than spreadsheets",
            },
          ].map((stat, i) => (
            <div
              key={i}
              className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg px-4 py-3 hover:bg-white/15 hover:border-white/40 transition-all duration-300 group cursor-default"
            >
              <stat.icon className="w-5 h-5 text-emerald-300 mx-auto mb-2 group-hover:scale-110 transition-transform" />
              <p className="text-white font-semibold text-sm">{stat.label}</p>
              <p className="text-emerald-100 text-xs">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
          <Link
            href="/sign-up"
            className="group relative px-8 py-4 bg-white text-indigo-600 font-bold rounded-xl shadow-2xl shadow-indigo-950/50 hover:shadow-emerald-500/50 transition-all duration-300 hover:-translate-y-2 flex items-center justify-center gap-2 overflow-hidden"
          >
            {/* Glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-white to-emerald-100 opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
            {/* Content */}
            <span className="relative">Create Company Account</span>
            <ArrowRight className="w-5 h-5 relative group-hover:translate-x-1 transition-transform duration-300" />
          </Link>

          <Link
            href="mailto:demo@vyaparflow.in"
            className="group relative px-8 py-4 bg-white/15 backdrop-blur-xl text-white font-semibold rounded-xl border-2 border-white/30 hover:border-white/60 hover:bg-white/25 transition-all duration-300 hover:-translate-y-1"
          >
            <span className="relative flex items-center justify-center gap-2">
              Schedule Demo Call
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
            </span>
          </Link>
        </div>

        {/* Trust Indicators */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 px-8 py-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
            {[
              { icon: Check, text: "14-day free trial", color: "emerald" },
              {
                icon: Check,
                text: "No credit card required",
                color: "emerald",
              },
              { icon: Check, text: "GST-ready platform", color: "emerald" },
            ].map((item, i) => (
              <div
                key={i}
                className="flex items-center gap-3 text-sm font-medium text-white hover:text-emerald-200 transition-colors group cursor-default"
              >
                <div className="flex-shrink-0 p-2 bg-emerald-500/20 rounded-lg group-hover:bg-emerald-500/40 transition-colors">
                  <item.icon className="w-4 h-4 text-emerald-300 group-hover:scale-110 transition-transform" />
                </div>
                <span>{item.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer text */}
        <div className="text-center mt-8 text-emerald-100 text-sm">
          <p>
            Join the MSMEs transforming procurement. Get setup in minutes, not
            weeks.
          </p>
        </div>
      </div>
    </section>
  );
}
