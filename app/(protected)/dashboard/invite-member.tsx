"use client";

import { authClient } from "@/lib/auth-client";
import { useState } from "react";
import { CompanyRole } from "@/app/generated/prisma/enums";
import { toast } from "sonner";
import { Mail, ShieldCheck, Loader2, ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function InviteMember() {
  const {} = authClient.useSession();
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

  // Removed strict companyId check as the API handles validation and session might not have it client-side yet
  // Also removed the specific session check here since the parent handles session validation
  // and we want to ensure the form renders even if session is still loading/updating in this component
  // if (!session) return null;

  return (
    <form onSubmit={handleInvite} className="flex flex-col gap-5">
      <div className="space-y-2">
        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">
          Email Address
        </label>
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-emerald-600 transition-colors" />
          </div>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="block w-full rounded-xl border border-gray-200 bg-gray-50/50 py-3 pl-11 pr-4 text-gray-900 text-sm font-medium shadow-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all hover:bg-white focus:bg-white"
            placeholder="colleague@company.com"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">
          Role Permission
        </label>
        <Select
          value={role}
          onValueChange={(value) => setRole(value as CompanyRole)}
        >
          <SelectTrigger className="w-full rounded-xl border-gray-200 bg-gray-50/50 py-3 pl-3 pr-3 text-gray-900 text-sm font-medium shadow-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500">
            <div className="flex items-center gap-3">
              <ShieldCheck className="h-5 w-5 text-gray-400" />
              <SelectValue placeholder="Select role..." />
            </div>
          </SelectTrigger>
          <SelectContent>
            {Object.values(CompanyRole).map((r) => (
              <SelectItem
                key={r}
                value={r}
                className="cursor-pointer focus:bg-emerald-50 focus:text-emerald-700 font-medium"
              >
                {r}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Button
        type="submit"
        disabled={loading}
        className="mt-2 w-full rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 font-bold text-white shadow-lg shadow-emerald-600/20 hover:from-emerald-700 hover:to-teal-700 hover:shadow-emerald-600/30 transition-all h-12"
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Sending Invite...
          </>
        ) : (
          <>
            Send Invitation
            <ArrowRight className="ml-2 h-4 w-4" />
          </>
        )}
      </Button>
    </form>
  );
}
