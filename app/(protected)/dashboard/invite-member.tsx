"use client";

import { authClient } from "@/lib/auth-client";
import { useState } from "react";
import { CompanyRole } from "@/app/generated/prisma/enums";
import { toast } from "sonner";
import {
  Building2,
  Mail,
  ShieldCheck,
  UserPlus,
  Loader2,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";

export default function InviteMember() {
  const { data: session } = authClient.useSession();
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<CompanyRole>("MANAGER");
  const [loading, setLoading] = useState(false);

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    try {
      const res = await fetch("/api/team/invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, role }),
      });

      if (!res.ok) {
        const error = await res.text();
        throw new Error(error);
      }

      toast.success("Invitation sent successfully!");
      setEmail("");
      setRole("MANAGER");
    } catch (error) {
      console.error(error);
      toast.error("Failed to send invitation");
    } finally {
      setLoading(false);
    }
  };

  if (!(session?.user as { companyId?: string })?.companyId) return null;

  return (
    <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white/20 shadow-xl overflow-hidden relative group">
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 via-white/50 to-purple-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      {/* Header Section */}
      <div className="px-6 py-5 border-b border-gray-100 relative">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-indigo-50 rounded-xl text-indigo-600 ring-1 ring-indigo-100">
            <UserPlus className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-gray-900 flex items-center gap-2">
              Invite Team Member
              <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-green-50 text-green-700 border border-green-100 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                Active
              </span>
            </h3>
            <p className="text-sm text-gray-500 mt-0.5">
              Send an invitation to join your company workspace.
            </p>
          </div>
        </div>
      </div>

      {/* Form Section */}
      <div className="p-6 relative">
        <form
          onSubmit={handleInvite}
          className="flex flex-col xl:flex-row gap-4 xl:items-end"
        >
          {/* Email Field */}
          <div className="flex-1 space-y-1.5">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-1.5 ml-1">
              <Mail className="w-3.5 h-3.5 text-gray-400" />
              Email Address
            </label>
            <div className="relative group/input">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full rounded-xl border-gray-200 bg-gray-50/50 py-2.5 pl-3 pr-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-200 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-500 focus:bg-white transition-all sm:text-sm sm:leading-6"
                placeholder="colleague@company.com"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none opacity-0 group-focus-within/input:opacity-100 transition-opacity">
                <span className="text-xs text-gray-400">Press Enter ↵</span>
              </div>
            </div>
          </div>

          {/* Role Selection */}
          <div className="w-full xl:w-48 space-y-1.5">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-1.5 ml-1">
              <ShieldCheck className="w-3.5 h-3.5 text-gray-400" />
              Role
            </label>
            <div className="relative">
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as CompanyRole)}
                className="block w-full rounded-xl border-gray-200 bg-gray-50/50 py-2.5 pl-3 pr-8 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-200 focus:ring-2 focus:ring-inset focus:ring-indigo-500 focus:bg-white transition-all sm:text-sm sm:leading-6 cursor-pointer hover:bg-white"
              >
                <option value="ADMIN">Admin</option>
                <option value="MANAGER">Manager</option>
                <option value="PROCUREMENT">Procurement</option>
                <option value="FINANCE">Finance</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                <Building2 className="h-4 w-4 text-gray-400" />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full xl:w-auto min-w-[120px] rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm shadow-indigo-200 hover:bg-indigo-500 hover:shadow-indigo-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95 flex items-center justify-center gap-2 group/btn"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin h-4 w-4" />
                <span>Sending...</span>
              </>
            ) : (
              <>
                <span>Send Invite</span>
                <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-0.5 transition-transform" />
              </>
            )}
          </button>
        </form>

        <div className="mt-4 flex items-center gap-2 text-xs text-gray-500 bg-indigo-50/50 p-2 rounded-lg border border-indigo-100/50">
          <div className="w-1 h-1 rounded-full bg-indigo-400" />
          <p>
            Admins have full access, while Managers can only view and edit their
            own scope.
          </p>
        </div>
      </div>
    </div>
  );
}
