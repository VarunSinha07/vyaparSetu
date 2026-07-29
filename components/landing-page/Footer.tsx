"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Building2,
  Linkedin,
  Twitter,
  Mail,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Heart,
  Send,
} from "lucide-react";
import { toast } from "sonner";

export function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
    toast.success("Thank you for subscribing to VyaparFlow updates!");
  };

  return (
    <footer className="bg-slate-900 text-slate-300 font-sans border-t border-slate-800 relative overflow-hidden">
      <div className="container mx-auto px-6 lg:px-12 py-16 lg:py-20 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-12 pb-16 border-b border-slate-800">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-6">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="bg-emerald-600 text-white p-2.5 rounded-xl shadow-md">
                <Building2 className="w-5 h-5" />
              </div>
              <span className="text-xl font-extrabold text-white tracking-tight">VyaparFlow</span>
            </Link>

            <p className="text-xs text-slate-300 leading-relaxed max-w-sm font-normal">
              VyaparFlow is the modern spend management operating system built for Indian MSMEs. Digitize purchase requests, 3-way invoice matching, GST tax credit verification, and vendor payouts in one place.
            </p>

            {/* Operational Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-800 rounded-full border border-slate-700 text-xs text-slate-200">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>GST Portal & Bank API: Operational</span>
            </div>
          </div>

          {/* Column 1: Product */}
          <div className="space-y-4">
            <h4 className="text-white font-extrabold text-xs uppercase tracking-wider">Product & Solution</h4>
            <ul className="space-y-2.5 text-xs">
              {[
                { label: "Capabilities", href: "/features" },
                { label: "How It Works", href: "/how-it-works" },
                { label: "Pricing & Plans", href: "/pricing" },
                { label: "3-Way Matching", href: "/features" },
                { label: "GST Verification", href: "/features" },
              ].map((item, idx) => (
                <li key={idx}>
                  <Link href={item.href} className="hover:text-emerald-400 transition-colors font-medium">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 2: Governance & Trust */}
          <div className="space-y-4">
            <h4 className="text-white font-extrabold text-xs uppercase tracking-wider">Trust & Security</h4>
            <ul className="space-y-2.5 text-xs">
              {[
                { label: "Role-Based Access (RBAC)", href: "/how-it-works" },
                { label: "Audit Log Security", href: "/features" },
                { label: "Razorpay Payout Sync", href: "/features" },
                { label: "14-Day Free Trial", href: "/sign-up" },
                { label: "Customer Sign In", href: "/sign-in" },
              ].map((item, idx) => (
                <li key={idx}>
                  <Link href={item.href} className="hover:text-emerald-400 transition-colors font-medium">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter Box */}
          <div className="space-y-4">
            <h4 className="text-white font-extrabold text-xs uppercase tracking-wider">Stay Informed</h4>
            <p className="text-xs text-slate-300">
              Subscribe for monthly updates on Indian GST compliance & spend efficiency tips.
            </p>

            {subscribed ? (
              <div className="p-3 bg-emerald-900/60 border border-emerald-500/40 rounded-xl text-xs text-emerald-300 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Subscribed successfully!</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <div className="relative">
                  <input
                    type="email"
                    required
                    placeholder="name@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-400 focus:border-emerald-500 outline-none transition-colors"
                  />
                  <button
                    type="submit"
                    className="absolute right-1 top-1 bottom-1 px-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg text-xs transition-all"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Bottom Copyright Bar */}
        <div className="pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-400">
          <p>© {new Date().getFullYear()} VyaparFlow Technologies Inc. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1 text-slate-300 font-semibold">
              Made with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> for Indian Businesses
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
