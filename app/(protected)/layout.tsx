import { getContext } from "@/lib/context";
import { redirect } from "next/navigation";
import { SidebarNav } from "@/components/sidebar-nav";
import { Building2 } from "lucide-react";
import { SidebarUser } from "@/components/sidebar-user";
import { InviteHandler } from "@/components/invite-handler";

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
    <div className="min-h-screen bg-[#f8fafc] flex font-sans print:bg-white">
      <InviteHandler />
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-gray-200 hidden lg:flex flex-col transition-all duration-300 print:hidden">
        {/* Logo Area */}
        <div className="p-6 border-b border-gray-100 flex items-center gap-3">
          <div className="bg-gradient-to-br from-emerald-600 to-teal-600 p-2 rounded-xl shadow-lg shadow-emerald-600/20">
            <Building2 className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-700">
            VyaparFlow
          </span>
        </div>

        {/* Navigation */}
        <SidebarNav />

        {/* User Profile Footer */}
        <SidebarUser
          name={context.user.name || "User"}
          role={context.role || "Member"}
        />
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 lg:ml-72 flex flex-col min-w-0 overflow-hidden print:ml-0">
        {/* Mobile Header (Hidden on LG) */}
        <header className="lg:hidden bg-white border-b border-gray-200 p-4 flex items-center justify-between sticky top-0 z-40 print:hidden">
          <div className="flex items-center gap-2">
            <div className="bg-emerald-600 p-1.5 rounded-lg">
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
