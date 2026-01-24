import { getContext } from "@/lib/context";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Building2, User } from "lucide-react";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const context = await getContext({ ensureCompany: true });

  if (!context) {
    redirect("/sign-in");
  }

  // Simple Shell for Phase 2 proof
  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar Stub */}
      <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-1.5 rounded-lg">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-gray-900">VyaparFlow</span>
          </div>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          <Link
            href="/dashboard"
            className="flex items-center gap-3 px-3 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium"
          >
            Dashboard
          </Link>
          {/* More links later */}
        </nav>
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
              <User className="w-4 h-4 text-gray-500" />
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-medium text-gray-900 truncate">
                {context.user.name}
              </p>
              <p className="text-xs text-gray-500 truncate capitalize">
                {context.role?.toLowerCase()}
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}
