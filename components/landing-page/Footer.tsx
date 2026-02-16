import Link from "next/link";
import { Building2, Linkedin, Twitter } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 py-16 border-t border-gray-800">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-12">
          {/* Brand Section */}
          <div className="col-span-2 lg:col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <div className="bg-gradient-to-br from-indigo-600 to-indigo-700 p-1.5 rounded-lg shadow-lg shadow-indigo-900/50">
                <Building2 className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white tracking-tight">
                VyaparFlow
              </span>
            </div>
            <p className="text-sm leading-relaxed max-w-sm mb-6 text-gray-500">
              The procurement operating system for Indian MSMEs. Replacing chaos
              with clarity, one purchase order at a time.
            </p>
            <div className="flex gap-4">
              <Link
                href="#"
                className="p-2.5 bg-gray-800 rounded-lg hover:bg-indigo-600 hover:text-white transition-colors group"
              >
                <Twitter className="w-4 h-4" />
              </Link>
              <Link
                href="#"
                className="p-2.5 bg-gray-800 rounded-lg hover:bg-indigo-600 hover:text-white transition-colors group"
              >
                <Linkedin className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-white font-bold mb-6 text-sm uppercase tracking-wide">
              Product
            </h4>
            <ul className="space-y-3 text-sm">
              {["Features", "How It Works", "Pricing", "Security"].map(
                (item) => (
                  <li key={item}>
                    <Link
                      href="#"
                      className="hover:text-indigo-400 transition-colors"
                    >
                      {item}
                    </Link>
                  </li>
                ),
              )}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-white font-bold mb-6 text-sm uppercase tracking-wide">
              Company
            </h4>
            <ul className="space-y-3 text-sm">
              {["About", "Blog", "Careers", "Contact"].map((item) => (
                <li key={item}>
                  <Link
                    href="#"
                    className="hover:text-indigo-400 transition-colors"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-white font-bold mb-6 text-sm uppercase tracking-wide">
              Legal
            </h4>
            <ul className="space-y-3 text-sm">
              {["Privacy", "Terms", "Cookies"].map((item) => (
                <li key={item}>
                  <Link
                    href="#"
                    className="hover:text-indigo-400 transition-colors"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-600">
          <p>© 2026 VyaparFlow. All rights reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <Link
              href="/privacy"
              className="hover:text-gray-400 transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="hover:text-gray-400 transition-colors"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
