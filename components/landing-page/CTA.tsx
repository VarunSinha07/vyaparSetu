import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function CTA() {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background with Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-indigo-700 z-0">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay"></div>
      </div>

      {/* Glow Effects */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white opacity-10 blur-[120px] rounded-full pointer-events-none translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-900 opacity-20 blur-[120px] rounded-full pointer-events-none -translate-x-1/2 translate-y-1/2" />

      <div className="container mx-auto px-4 text-center relative z-10">
        <h2 className="text-4xl sm:text-5xl font-extrabold text-white mb-8 tracking-tight drop-shadow-sm">
          Bring Order to Your Business.
        </h2>
        <p className="text-xl text-blue-100 mb-12 max-w-2xl mx-auto leading-relaxed font-medium">
          Stop chasing approvals on WhatsApp. Stop losing money to manual
          errors. Start managing procurement professionally today.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
          <Link
            href="/sign-up"
            className="w-full sm:w-auto px-10 py-4 bg-white text-blue-700 font-bold rounded-xl hover:bg-gray-50 transition-all shadow-xl shadow-blue-900/20 hover:-translate-y-1 flex items-center justify-center gap-2 group"
          >
            Start Free Trial
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            href="mailto:demo@vyaparflow.in"
            className="w-full sm:w-auto px-10 py-4 bg-blue-800/40 backdrop-blur-sm text-white font-semibold rounded-xl hover:bg-blue-800/60 transition-all border border-blue-400/30 hover:border-blue-400/50"
          >
            Book a Clarity Call
          </Link>
        </div>

        <div className="mt-8 flex items-center justify-center gap-6 text-sm text-blue-200 font-medium opacity-80">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-300" /> No credit
            card required
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-300" /> 14-day
            free trial
          </span>
        </div>
      </div>
    </section>
  );
}
