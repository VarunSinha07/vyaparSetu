"use client";

import { useEffect, useState } from "react";
import {
  Building2,
  MapPin,
  Phone,
  Mail,
  Plus,
  ShieldCheck,
  User,
  Loader2,
  Clock,
  XCircle,
} from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { CompanyRole } from "@/app/generated/prisma/client";

interface CompanyDetails {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  address: string | null;
}

interface TeamMember {
  id: string;
  role: CompanyRole;
  isActive: boolean;
  joinedAt: string;
  email: string; // From Auth User
  profile: {
    name: string | null;
  };
  image?: string | null;
  isCurrentUser: boolean;
}

interface Invitation {
  id: string;
  email: string;
  role: CompanyRole;
  expiresAt: string;
}

interface TeamData {
  company: CompanyDetails;
  members: TeamMember[];
  invitations: Invitation[];
  currentUserRole: CompanyRole;
}

export default function ManageTeamPage() {
  const [data, setData] = useState<TeamData | null>(null);
  const [loading, setLoading] = useState(true);
  const [inviteModalOpen, setInviteModalOpen] = useState(false);

  // Invite Form State
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<CompanyRole>("MANAGER");
  const [inviteLoading, setInviteLoading] = useState(false);

  useEffect(() => {
    fetchTeamData();
  }, []);

  const fetchTeamData = async () => {
    try {
      const res = await fetch("/api/team");
      if (!res.ok) throw new Error("Failed to fetch team data");
      const json = await res.json();
      setData(json);
    } catch (error) {
      console.error(error);
      toast.error("Could not load team information");
    } finally {
      setLoading(false);
    }
  };

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setInviteLoading(true);

    try {
      const res = await fetch("/api/team/invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: inviteEmail, role: inviteRole }),
      });

      if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg);
      }

      toast.success(`Invitation sent to ${inviteEmail}`);
      setInviteModalOpen(false);
      setInviteEmail("");
      fetchTeamData(); // Refresh list to show new invitation
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Failed to send invitation";
      toast.error(message);
    } finally {
      setInviteLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        <p className="text-gray-500">Loading company information...</p>
      </div>
    );
  }

  if (!data)
    return (
      <div className="p-8 text-center text-red-500">Failed to load data.</div>
    );

  const isAdmin = data.currentUserRole === "ADMIN";

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div className="flex items-end justify-between border-b border-gray-200/50 pb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Manage Team</h1>
          <p className="text-gray-500 mt-1">
            Overview of your company profile and team members.
          </p>
        </div>
        {isAdmin && (
          <button
            onClick={() => setInviteModalOpen(true)}
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-xl font-medium hover:bg-blue-700 transition-shadow shadow-sm active:scale-95"
          >
            <Plus className="w-5 h-5" /> Invite Member
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Company Info */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-6">
            <div className="flex items-center gap-4 border-b border-gray-50 pb-4">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Building2 className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900 leading-tight">
                  {data.company.name}
                </h2>
                <p className="text-xs text-gray-400 font-mono">
                  ID: {data.company.id.slice(0, 8)}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-1">
                  Address
                </label>
                <div className="flex items-start gap-2 text-sm text-gray-700">
                  <MapPin className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
                  <p>{data.company.address || "No address configured"}</p>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-1">
                  Contact
                </label>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <Mail className="w-4 h-4 text-gray-400 shrink-0" />
                    <p>{data.company.email || "No email"}</p>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <Phone className="w-4 h-4 text-gray-400 shrink-0" />
                    <p>{data.company.phone || "No phone"}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Invitations Card (Only if invites exist) */}
          {data.invitations.length > 0 && (
            <div className="bg-amber-50 p-6 rounded-2xl border border-amber-100 space-y-4">
              <h3 className="font-semibold text-amber-900 flex items-center gap-2">
                <Clock className="w-4 h-4" /> Pending Invitations
              </h3>
              <div className="space-y-3">
                {data.invitations.map((invite) => (
                  <div
                    key={invite.id}
                    className="bg-white p-3 rounded-lg border border-amber-100/50 shadow-sm flex items-center justify-between"
                  >
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {invite.email}
                      </p>
                      <p className="text-xs text-gray-500">
                        Role: {invite.role}
                      </p>
                    </div>
                    <span className="text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded-md">
                      Pending
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Members List */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-50 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                Team Members ({data.members.length})
              </h2>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50/50 text-gray-500 font-medium">
                  <tr>
                    <th className="px-6 py-4">User</th>
                    <th className="px-6 py-4">Role</th>
                    <th className="px-6 py-4">Joined</th>
                    <th className="px-6 py-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {data.members.map((member) => (
                    <tr
                      key={member.id}
                      className="hover:bg-gray-50/50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-sm shrink-0">
                            {member.profile.name
                              ? member.profile.name[0].toUpperCase()
                              : member.email[0].toUpperCase()}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 flex items-center gap-2">
                              {member.profile.name || "Unknown"}
                              {member.isCurrentUser && (
                                <span className="bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider">
                                  You
                                </span>
                              )}
                            </p>
                            <p className="text-gray-500 text-xs">
                              {member.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
                            member.role === "ADMIN"
                              ? "bg-purple-50 text-purple-700 border-purple-200"
                              : member.role === "PROCUREMENT"
                                ? "bg-blue-50 text-blue-700 border-blue-200"
                                : member.role === "FINANCE"
                                  ? "bg-green-50 text-green-700 border-green-200"
                                  : "bg-gray-50 text-gray-700 border-gray-200"
                          }`}
                        >
                          {member.role === "ADMIN" && (
                            <ShieldCheck className="w-3 h-3" />
                          )}
                          {member.role === "MANAGER" && (
                            <User className="w-3 h-3" />
                          )}
                          {member.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-500">
                        {format(new Date(member.joinedAt), "MMM d, yyyy")}
                      </td>
                      <td className="px-6 py-4">
                        {member.isActive ? (
                          <span className="flex items-center gap-1.5 text-xs font-medium text-emerald-600">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                            Active
                          </span>
                        ) : (
                          <span className="flex items-center gap-1.5 text-xs font-medium text-red-600">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                            Inactive
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Invite Modal */}
      {inviteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden ring-1 ring-gray-200 animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <h3 className="font-semibold text-gray-900">Invite New Member</h3>
              <button
                onClick={() => setInviteModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleInvite} className="p-6 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  placeholder="colleague@company.com"
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Role
                </label>
                <select
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none bg-white"
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value as CompanyRole)}
                >
                  <option value="MANAGER">Manager (Requester/Approver)</option>
                  <option value="PROCUREMENT">
                    Procurement (Viewer/Submitter)
                  </option>
                  <option value="FINANCE">Finance</option>
                  <option value="ADMIN">Admin (Full Access)</option>
                </select>
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setInviteModalOpen(false)}
                  className="flex-1 px-4 py-2 rounded-xl bg-gray-100 text-gray-700 font-medium hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={inviteLoading}
                  className="flex-1 px-4 py-2 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {inviteLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Plus className="w-4 h-4" />
                  )}
                  Send Invite
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
