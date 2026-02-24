import { getContext } from "@/lib/context";
import { redirect } from "next/navigation";
import { Building2, Menu } from "lucide-react";
import { InviteHandler } from "@/components/invite-handler";
import { SidebarContent } from "@/components/sidebar-content";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

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
      <aside className="fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-gray-200 hidden lg:flex flex-col transition-all duration-300 print:hidden shadow-sm">
        <SidebarContent
          name={context.user.name || "User"}
          role={context.role || "Member"}
        />
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 lg:ml-72 flex flex-col min-w-0 overflow-hidden print:ml-0">
        {/* Mobile Header (Hidden on LG) */}
        <header className="lg:hidden bg-white border-b border-gray-200 p-4 flex items-center justify-between sticky top-0 z-40 print:hidden shadow-sm">
          <div className="flex items-center gap-3">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="-ml-2">
                  <Menu className="h-6 w-6 text-gray-600" />
                </Button>
              </SheetTrigger>
              <SheetContent
                side="left"
                className="p-0 border-r border-gray-200 w-72"
              >
                <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                <SidebarContent
                  name={context.user.name || "User"}
                  role={context.role || "Member"}
                />
              </SheetContent>
            </Sheet>

            <div className="flex items-center gap-2">
              <div className="bg-emerald-600 p-1.5 rounded-lg shadow-sm">
                <Building2 className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-gray-900 text-lg">
                VyaparFlow
              </span>
            </div>
          </div>

          <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-sm font-semibold border border-emerald-200 shadow-sm">
            {context.user.name?.[0] || "U"}
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
