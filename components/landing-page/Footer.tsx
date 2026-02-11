import Link from "next/link";
import { Building2, Github, Twitter, Linkedin } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-[#0b1120] text-gray-400 py-16 border-t border-gray-800 font-sans">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-12">
          <div className="col-span-2 lg:col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-1.5 rounded-lg shadow-lg shadow-blue-900/20">
                <Building2 className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white tracking-tight">
                VyaparFlow
              </span>
            </div>
            <p className="text-sm leading-relaxed max-w-sm mb-6 text-gray-500">
              The operating system for Indian MSME procurement. Built to replace
              chaos with clarity, one purchase order at a time.
            </p>
            <div className="flex gap-4">
              {[Twitter, Github, Linkedin].map((Icon, i) => (
                <Link
                  key={i}
                  href="#"
                  className="p-2 bg-gray-800 rounded-full hover:bg-gray-700 hover:text-white transition-colors"
                >
                  <Icon className="w-4 h-4" />
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6">Product</h4>
            <ul className="space-y-3 text-sm font-medium">
              {["Features", "How It Works", "Security", "Pricing"].map(
                (item) => (
                  <li key={item}>
                    <Link
                      href="#"
                      className="hover:text-blue-400 transition-colors block py-0.5"
                    >
                      {item}
                    </Link>
                  </li>
                ),
              )}
              <li>
                <Link
                  href="/simulation"
                  className="text-blue-400 hover:text-blue-300 transition-colors font-bold flex items-center gap-2"
                >
                  AI Simulator{" "}
                  <span className="text-xs bg-blue-900 px-1.5 py-0.5 rounded text-blue-200">
                    New
                  </span>
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6">Company</h4>
            <ul className="space-y-3 text-sm font-medium">
              {["About Us", "Careers", "Blog", "Contact"].map((item) => (
                <li key={item}>
                  <Link
                    href="#"
                    className="hover:text-blue-400 transition-colors block py-0.5"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6">Legal</h4>
            <ul className="space-y-3 text-sm font-medium">
              {["Privacy Policy", "Terms of Service", "Cookie Policy"].map(
                (item) => (
                  <li key={item}>
                    <Link
                      href="#"
                      className="hover:text-blue-400 transition-colors block py-0.5"
                    >
                      {item}
                    </Link>
                  </li>
                ),
              )}
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center text-sm font-medium text-gray-600">
          <p>
            © {new Date().getFullYear()} VyaparFlow Inc. All rights reserved.
          </p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <span>Made with ❤️ in India</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
