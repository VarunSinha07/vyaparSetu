import Link from "next/link";
import {
  Building2,
  Linkedin,
  Twitter,
  Mail,
} from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-emerald-950 text-emerald-200/80 py-20 border-t border-emerald-900 font-sans relative overflow-hidden">
      {/* Background Texture */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5 mix-blend-overlay" />
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-emerald-900/40 rounded-full blur-[120px] pointer-events-none -translate-y-1/2 translate-x-1/2" />

      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-12 mb-20">
          {/* Brand Section (Wide) */}
          <div className="col-span-1 md:col-span-2 lg:col-span-2 space-y-8">
            <div className="flex items-center gap-3">
              <div className="bg-white/10 rounded-xl p-2.5 shadow-lg shadow-emerald-900/20 backdrop-blur-sm border border-emerald-500/20">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-white tracking-tight">
                VyaparFlow
              </span>
            </div>

            <p className="text-base leading-relaxed max-w-sm">
              The modern operating system for Indian MSME procurement. We
              replace chaos with clarity, ensuring every purchase order drives
              growth, not delays.
            </p>

            <div className="flex items-center gap-4">
              {/* Status Indicator */}
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-900/50 rounded-full border border-emerald-700/50">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="text-xs font-medium text-emerald-100">
                  All Systems Operational
                </span>
              </div>
            </div>
          </div>

          {/* Navigation Columns */}
          <div className="lg:col-span-1">
            <h4 className="text-white font-bold mb-6 text-sm uppercase tracking-wider opacity-80">
              Product
            </h4>
            <ul className="space-y-4 text-sm">
              {[
                "Features",
                "Integrations",
                "Pricing",
                "Enterprise",
                "Security",
              ].map((item) => (
                <li key={item}>
                  <Link
                    href="#"
                    className="hover:text-white transition-colors flex items-center gap-2 group"
                  >
                    <span className="w-1 h-1 rounded-full bg-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-1">
            <h4 className="text-white font-bold mb-6 text-sm uppercase tracking-wider opacity-80">
              Company
            </h4>
            <ul className="space-y-4 text-sm">
              {["About Us", "Careers", "Blog", "Press Kit", "Contact"].map(
                (item) => (
                  <li key={item}>
                    <Link
                      href="#"
                      className="hover:text-white transition-colors flex items-center gap-2 group"
                    >
                      <span className="w-1 h-1 rounded-full bg-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                      {item}
                    </Link>
                  </li>
                ),
              )}
            </ul>
          </div>

          {/* Contact / Newsletter */}
          <div className="col-span-1 md:col-span-2 lg:col-span-2 space-y-6">
            <h4 className="text-white font-bold text-sm uppercase tracking-wider opacity-80">
              Stay Updated
            </h4>
            <p className="text-sm">
              Get the latest updates on procurement trends and platform
              features.
            </p>

            <form className="flex gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="bg-emerald-900/50 border border-emerald-800 rounded-lg px-4 py-3 text-sm text-white placeholder-emerald-200/50 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 w-full transition-all"
              />
              <button className="bg-white hover:bg-emerald-50 text-emerald-900 px-5 py-3 rounded-lg text-sm font-bold transition-colors">
                Subscribe
              </button>
            </form>

            <div className="pt-6 mt-6 border-t border-emerald-900/50 flex gap-4">
              <Link
                href="#"
                className="p-2 bg-emerald-900/50 rounded-lg hover:bg-emerald-800 hover:text-white transition-all"
              >
                <Twitter className="w-5 h-5" />
              </Link>
              <Link
                href="#"
                className="p-2 bg-emerald-900/50 rounded-lg hover:bg-emerald-800 hover:text-white transition-all"
              >
                <Linkedin className="w-5 h-5" />
              </Link>
              <Link
                href="mailto:contact@vyaparflow.in"
                className="p-2 bg-emerald-900/50 rounded-lg hover:bg-emerald-800 hover:text-white transition-all"
              >
                <Mail className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-emerald-900/50 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-emerald-200/60">
          <p>© 2026 VyaparFlow. All rights reserved.</p>
          <div className="flex gap-8">
            <Link
              href="/privacy"
              className="hover:text-white transition-colors"
            >
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-white transition-colors">
              Terms of Service
            </Link>
            <Link href="#" className="hover:text-white transition-colors">
              Sitemap
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
