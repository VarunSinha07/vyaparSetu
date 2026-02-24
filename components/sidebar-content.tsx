import { Building2 } from "lucide-react";
import { SidebarNav } from "./sidebar-nav";
import { SidebarUser } from "./sidebar-user";

type SidebarContentProps = {
  name: string;
  role: string;
};

export const SidebarContent = ({ name, role }: SidebarContentProps) => {
  return (
    <div className="flex flex-col h-full bg-white">
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
      <div className="mt-auto border-t border-gray-100">
        <SidebarUser name={name} role={role} />
      </div>
    </div>
  );
};
