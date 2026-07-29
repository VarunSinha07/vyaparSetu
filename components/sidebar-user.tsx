"use client";

import { useRouter } from "next/navigation";
import { LogOut, ShieldCheck } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

interface SidebarUserProps {
  name: string;
  role: string;
}

export function SidebarUser({ name, role }: SidebarUserProps) {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            router.push("/sign-in");
            router.refresh();
          },
        },
      });
    } catch (error) {
      console.error("Logout failed", error);
      toast.error("Failed to sign out");
    }
  };

  return (
    <div className="p-4 border-t border-slate-100 bg-slate-50/50">
      <div className="flex items-center gap-3 p-2.5 rounded-2xl border border-slate-200/80 bg-white shadow-2xs hover:shadow-xs transition-all">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white flex items-center justify-center font-bold text-sm shadow-xs shrink-0">
          {name?.[0]?.toUpperCase() || "U"}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-bold text-slate-900 truncate leading-snug">
            {name}
          </p>
          <div className="flex items-center gap-1 mt-0.5">
            <ShieldCheck className="w-3 h-3 text-emerald-600 shrink-0" />
            <span className="text-[10px] font-semibold text-emerald-800 uppercase tracking-wider bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200/60 truncate">
              {role}
            </span>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
          title="Sign Out"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
