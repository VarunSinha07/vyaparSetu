"use client";

import Link from "next/link";
import { Building2, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        isScrolled
          ? "bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm py-3"
          : "bg-white border-transparent py-5"
      }`}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="bg-gradient-to-br from-indigo-600 to-indigo-700 p-2 rounded-lg group-hover:shadow-lg group-hover:shadow-indigo-600/30 transition-all duration-300">
            <Building2 className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-gray-900 tracking-tight">
            VyaparFlow
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1 text-sm font-medium text-gray-700">
          {["Features", "How It Works", "Pricing"].map((item) => (
            <Link
              key={item}
              href={`/${item.toLowerCase().replace(/\s+/g, "-")}`}
              className="px-3 py-2 rounded-lg hover:bg-gray-100 hover:text-indigo-600 transition-all duration-200"
            >
              {item}
            </Link>
          ))}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/sign-in"
            className="px-4 py-2.5 text-sm font-semibold text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all duration-200"
          >
            Sign In
          </Link>
          <Link
            href="/sign-up"
            className="group relative px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white text-sm font-semibold rounded-lg shadow-md shadow-indigo-600/30 hover:shadow-lg hover:shadow-indigo-600/50 hover:-translate-y-0.5 transition-all duration-200 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <span className="relative">Get Started</span>
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white border-b border-gray-200 shadow-lg animate-in slide-in-from-top-2 duration-200">
          <div className="px-4 py-4 space-y-2">
            {["Features", "How It Works", "Pricing"].map((item) => (
              <Link
                key={item}
                href={`/${item.toLowerCase().replace(/\s+/g, "-")}`}
                className="block px-4 py-2.5 rounded-lg text-gray-700 font-medium hover:bg-gray-100 hover:text-indigo-600 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item}
              </Link>
            ))}

            <hr className="my-3 border-gray-200" />

            <div className="flex gap-3 pt-2">
              <Link
                href="/sign-in"
                className="flex-1 px-4 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-colors text-center"
                onClick={() => setMobileMenuOpen(false)}
              >
                Sign In
              </Link>
              <Link
                href="/sign-up"
                className="flex-1 px-4 py-2.5 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition-colors text-center shadow-md"
                onClick={() => setMobileMenuOpen(false)}
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
