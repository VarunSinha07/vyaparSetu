import { getContext } from "@/lib/context";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  Building2,
  LayoutDashboard,
  Settings,
  Users,
  ChevronRight,
} from "lucide-react";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const context = await getContext({ ensureCompany: true });

  if (!context) {
    redirect("/sign-in");
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] flex font-sans">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-gray-200 hidden lg:flex flex-col transition-all duration-300">
        {/* Logo Area */}
        <div className="p-6 border-b border-gray-100 flex items-center gap-3">
          <div className="bg-gradient-to-br from-indigo-600 to-blue-600 p-2 rounded-xl shadow-lg shadow-indigo-600/20">
            <Building2 className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-700">
            VyaparFlow
          </span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          <div className="px-3 mb-2">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Main Menu
            </p>
          </div>

          <Link
            href="/dashboard"
            className="flex items-center gap-3 px-3 py-2.5 bg-indigo-50/80 text-indigo-700 rounded-xl text-sm font-medium group transition-all duration-200 border border-indigo-100 hover:shadow-sm"
          >
            <LayoutDashboard className="w-5 h-5 text-indigo-600 group-hover:scale-110 transition-transform" />
            Dashboard
          </Link>

          <Link
            href="#"
            className="flex items-center gap-3 px-3 py-2.5 text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-xl text-sm font-medium group transition-all duration-200"
          >
            <Users className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
            Team Members
          </Link>

          <Link
            href="#"
            className="flex items-center gap-3 px-3 py-2.5 text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-xl text-sm font-medium group transition-all duration-200"
          >
            <Settings className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
            Settings
          </Link>
        </nav>

        {/* User Profile Footer */}
        <div className="p-4 border-t border-gray-100 bg-gray-50/30">
          <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-white hover:shadow-sm transition-all duration-200 cursor-pointer border border-transparent hover:border-gray-200">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-100 to-blue-100 flex items-center justify-center ring-2 ring-white">
              <span className="text-indigo-700 font-semibold text-sm">
                {context.user.name?.[0]?.toUpperCase()}
              </span>
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-semibold text-gray-900 truncate leading-snug">
                {context.user.name}
              </p>
              <p className="text-xs text-gray-500 truncate capitalize">
                {context.role?.toLowerCase()}
              </p>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 lg:ml-72 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile Header (Hidden on LG) */}
        <header className="lg:hidden bg-white border-b border-gray-200 p-4 flex items-center justify-between sticky top-0 z-40">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-1.5 rounded-lg">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-gray-900">VyaparFlow</span>
          </div>
          <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-medium">
            {context.user.name?.[0]}
          </div>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-auto p-4 md:p-8 scroll-smooth">
          <div className="mx-auto max-w-7xl animate-in fade-in duration-500">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
