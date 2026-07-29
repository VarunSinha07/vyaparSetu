import { Building2, Sparkles } from "lucide-react";
import { SidebarNav } from "./sidebar-nav";
import { SidebarUser } from "./sidebar-user";

type SidebarContentProps = {
  name: string;
  role: string;
};

export const SidebarContent = ({ name, role }: SidebarContentProps) => {
  return (
    <div className="flex flex-col h-full bg-white text-slate-900 font-sans border-r border-emerald-100">
      {/* Workspace Brand Area */}
      <div className="p-5 border-b border-emerald-100 flex items-center justify-between bg-emerald-50/40">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-emerald-600 to-teal-700 text-white p-2.5 rounded-xl shadow-xs">
            <Building2 className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-base font-extrabold text-slate-900 tracking-tight leading-none">
              VyaparFlow
            </span>
            <span className="text-[10px] font-bold text-emerald-700 mt-1 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              GST Audit Ready
            </span>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <SidebarNav />

      {/* User Profile Footer */}
      <SidebarUser name={name} role={role} />
    </div>
  );
};
