"use client";

import Link from "next/link";
import {
  Building2,
  Menu,
  X,
  ArrowRight,
  Sparkles,
  Workflow,
  CreditCard,
  ChevronRight,
} from "lucide-react";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "Features", href: "/features", icon: Sparkles },
    { label: "How It Works", href: "/how-it-works", icon: Workflow },
    { label: "Pricing", href: "/pricing", icon: CreditCard },
  ];

  return (
    <header
      className={`fixed top-3 sm:top-4 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-1.5rem)] max-w-6xl transition-all duration-300 ${
        isScrolled
          ? "bg-white/95 backdrop-blur-xl border border-emerald-200/90 shadow-xl shadow-emerald-900/5 py-2.5 px-5 sm:px-6 rounded-2xl"
          : "bg-white/85 backdrop-blur-md border border-emerald-200/60 shadow-md shadow-emerald-900/5 py-3 px-5 sm:px-6 rounded-2xl"
      }`}
    >
      <div className="flex items-center justify-between">
        {/* Brand Logo with Live Pulse Accent */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative">
            <div className="bg-gradient-to-br from-emerald-600 via-teal-600 to-emerald-700 text-white p-2.5 rounded-xl shadow-md shadow-emerald-600/20 group-hover:scale-105 transition-all duration-300">
              <Building2 className="w-5 h-5" />
            </div>
            {/* Live Indicator Pulse */}
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 border-2 border-white"></span>
            </span>
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="text-lg font-extrabold text-slate-900 tracking-tight leading-none group-hover:text-emerald-700 transition-colors">
                VyaparFlow
              </span>
            </div>
            <span className="text-[10px] font-bold text-emerald-700 tracking-wide uppercase mt-0.5">
              Procurement & Spend
            </span>
          </div>
        </Link>

        {/* Desktop Interactive Nav Items */}
        <nav className="hidden md:flex items-center gap-1 bg-emerald-50/60 p-1 rounded-xl border border-emerald-100">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 ${
                  isActive
                    ? "bg-white text-emerald-800 shadow-xs font-bold"
                    : "text-slate-700 hover:text-emerald-800 hover:bg-white/80"
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? "text-emerald-600" : "text-slate-400"}`} />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Desktop Action Buttons */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/sign-in"
            className="px-4 py-2 text-xs font-bold text-slate-700 hover:text-emerald-700 hover:bg-emerald-50 rounded-xl transition-colors"
          >
            Sign In
          </Link>
          <Link
            href="/sign-up"
            className="group relative inline-flex items-center justify-center px-5 py-2.5 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white text-xs font-extrabold rounded-xl shadow-md shadow-emerald-600/20 hover:shadow-lg hover:shadow-emerald-600/35 hover:-translate-y-0.5 transition-all duration-300 active:scale-95 overflow-hidden"
          >
            <span className="relative z-10 flex items-center gap-1.5">
              <span>Start Free Trial</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </span>
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden p-2 text-slate-700 hover:bg-emerald-50 rounded-xl transition-colors"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="w-5 h-5 text-emerald-700" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-3 pt-3 border-t border-emerald-100 space-y-3 animate-in slide-in-from-top-2 duration-200">
          <div className="space-y-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-slate-700 text-xs font-bold hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <div className="flex items-center gap-2">
                    <Icon className="w-4 h-4 text-emerald-600" />
                    <span>{link.label}</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                </Link>
              );
            })}
          </div>

          <div className="pt-2 flex gap-2">
            <Link
              href="/sign-in"
              className="flex-1 py-2.5 text-center rounded-xl border border-emerald-200 text-slate-700 font-bold hover:bg-emerald-50 transition-colors text-xs"
              onClick={() => setMobileMenuOpen(false)}
            >
              Sign In
            </Link>
            <Link
              href="/sign-up"
              className="flex-1 py-2.5 text-center rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-extrabold hover:from-emerald-700 transition-all text-xs shadow-md"
              onClick={() => setMobileMenuOpen(false)}
            >
              Start Free
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
