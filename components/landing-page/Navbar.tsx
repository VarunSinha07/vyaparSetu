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
      className={`sticky top-0 z-50 w-full transition-all duration-300 border-b ${
        isScrolled
          ? "bg-white/90 backdrop-blur-md border-gray-200 shadow-sm py-3"
          : "bg-white/0 border-transparent py-5"
      }`}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-2 rounded-xl group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-blue-500/20">
            <Building2 className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 tracking-tight">
            VyaparSetu
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
          {["Features", "How It Works", "Security"].map((item) => (
            <Link
              key={item}
              href={`#${item.toLowerCase().replace(/\s+/g, "-")}`}
              className="relative hover:text-blue-600 transition-colors py-1 group"
            >
              {item}
              <span className="absolute inset-x-0 bottom-0 h-0.5 bg-blue-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
            </Link>
          ))}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-4">
          <Link
            href="/sign-in"
            className="text-sm font-semibold text-gray-600 hover:text-blue-600 transition-colors"
          >
            Log in
          </Link>
          <Link
            href="/sign-up"
            className="group relative inline-flex items-center justify-center rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-gray-800 transition-all hover:shadow-lg active:scale-95"
          >
            Get Started
            <div className="absolute inset-0 rounded-lg ring-2 ring-white/20 group-hover:ring-white/40 transition-all pointer-events-none" />
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
        <div className="md:hidden absolute top-full left-0 w-full bg-white border-b border-gray-100 shadow-xl animate-in slide-in-from-top-5 duration-200">
          <div className="p-4 space-y-4">
            {["Features", "How It Works", "Security"].map((item) => (
              <Link
                key={item}
                href={`#${item.toLowerCase().replace(/\s+/g, "-")}`}
                className="block text-gray-700 font-medium hover:text-blue-600 py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item}
              </Link>
            ))}

            <hr className="border-gray-100" />
            <div className="grid grid-cols-2 gap-4 pt-2">
              <Link
                href="/sign-in"
                className="flex items-center justify-center px-4 py-3 rounded-lg border border-gray-200 font-bold text-gray-700 active:bg-gray-50 bg-white"
                onClick={() => setMobileMenuOpen(false)}
              >
                Log In
              </Link>
              <Link
                href="/sign-up"
                className="flex items-center justify-center px-4 py-3 rounded-lg bg-blue-600 font-bold text-white shadow-lg shadow-blue-200 active:bg-blue-700"
                onClick={() => setMobileMenuOpen(false)}
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
