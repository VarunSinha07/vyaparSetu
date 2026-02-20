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
  X,
  Search,
} from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { CompanyRole } from "@/app/generated/prisma/client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
  const [searchTerm, setSearchTerm] = useState("");

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
      setInviteRole("MANAGER");
      fetchTeamData(); // Refresh list to show new invitation
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Failed to send invitation";
      toast.error(message);
    } finally {
      setInviteLoading(false);
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "ADMIN":
        return "bg-purple-50 text-purple-700 ring-purple-600/20";
      case "PROCUREMENT":
        return "bg-blue-50 text-blue-700 ring-blue-600/20";
      case "FINANCE":
        return "bg-emerald-50 text-emerald-700 ring-emerald-600/20";
      default:
        return "bg-gray-50 text-gray-700 ring-gray-600/20";
    }
  };

  const filteredMembers =
    data?.members.filter(
      (member) =>
        (member.profile.name || "Unknown")
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        member.email.toLowerCase().includes(searchTerm.toLowerCase()),
    ) || [];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
        <p className="text-gray-500 font-medium">Loading team information...</p>
      </div>
    );
  }

  if (!data)
    return (
      <div className="flex flex-col items-center justify-center min-h-[40vh] gap-4">
        <div className="bg-red-50 p-4 rounded-full">
          <X className="w-8 h-8 text-red-500" />
        </div>
        <p className="text-lg font-medium text-gray-900">
          Failed to load team data
        </p>
        <Button onClick={() => window.location.reload()} variant="outline">
          Retry
        </Button>
      </div>
    );

  const isAdmin = data.currentUserRole === "ADMIN";

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-gray-200 pb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
            Team Management
          </h1>
          <p className="text-gray-500 mt-2 text-base">
            Manage your company profile, team members, and permissions.
          </p>
        </div>
        {isAdmin && (
          <Button
            onClick={() => setInviteModalOpen(true)}
            className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-600/20 transition-all hover:shadow-xl hover:-translate-y-0.5"
            size="lg"
          >
            <Plus className="w-5 h-5 mr-2" /> Invite Member
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Company & Quick Stats */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="border-gray-200 shadow-sm overflow-hidden group hover:shadow-md transition-shadow">
            <div className="h-24 bg-gradient-to-br from-emerald-500 to-teal-600 p-6 flex items-end relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none" />
              <div className="translate-y-1/2 relative z-10">
                <div className="w-16 h-16 rounded-xl bg-white shadow-md p-1 flex items-center justify-center">
                  <div className="w-full h-full rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
                    <Building2 className="w-8 h-8" />
                  </div>
                </div>
              </div>
            </div>
            <div className="pt-10 px-6 pb-6">
              <h2 className="text-xl font-bold text-gray-900">
                {data.company.name}
              </h2>
              <div className="flex items-center gap-2 mt-1 mb-6">
                <span className="bg-gray-100 px-2 py-0.5 rounded text-[10px] font-mono text-gray-500">
                  ID: {data.company.id.slice(0, 8)}
                </span>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2">
                    Address
                  </label>
                  <div className="flex items-start gap-3 p-3 bg-gray-50/50 rounded-lg border border-gray-100">
                    <MapPin className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                    <p className="text-sm text-gray-600 leading-snug">
                      {data.company.address || "No address configured"}
                    </p>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2">
                    Contact Info
                  </label>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 p-2.5 bg-gray-50/50 rounded-lg border border-gray-100 hover:bg-white hover:border-emerald-100 hover:shadow-sm transition-all duration-200 group cursor-default">
                      <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center border border-gray-100 group-hover:border-emerald-100 transition-colors">
                        <Mail className="w-4 h-4 text-gray-400 group-hover:text-emerald-600 transition-colors" />
                      </div>
                      <p className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors">
                        {data.company.email || "No email"}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 p-2.5 bg-gray-50/50 rounded-lg border border-gray-100 hover:bg-white hover:border-emerald-100 hover:shadow-sm transition-all duration-200 group cursor-default">
                      <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center border border-gray-100 group-hover:border-emerald-100 transition-colors">
                        <Phone className="w-4 h-4 text-gray-400 group-hover:text-emerald-600 transition-colors" />
                      </div>
                      <p className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors">
                        {data.company.phone || "No phone"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Pending Invitations */}
          {data.invitations.length > 0 && (
            <Card className="border-amber-200 bg-amber-50/30 shadow-none">
              <CardHeader className="pb-3 px-5 pt-5">
                <CardTitle className="text-sm font-bold text-amber-900 flex items-center gap-2 uppercase tracking-wide">
                  <Clock className="w-4 h-4" /> Pending Invitations
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 px-5 pb-5">
                {data.invitations.map((invite) => (
                  <div
                    key={invite.id}
                    className="bg-white p-3 rounded-xl border border-amber-100 shadow-sm flex items-center justify-between group hover:border-amber-300 transition-colors"
                  >
                    <div className="min-w-0 pr-2">
                      <p className="text-sm font-semibold text-gray-900 truncate">
                        {invite.email}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] uppercase font-bold text-amber-700 bg-amber-100/50 px-1.5 py-0.5 rounded">
                          {invite.role}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                      <span className="text-[10px] text-gray-400">Pending</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column: Members List */}
        <div className="lg:col-span-8 space-y-6">
          <Card className="border-gray-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/50 backdrop-blur-sm sticky top-0 z-10">
              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  Team Members
                </h2>
                <p className="text-sm text-gray-500">
                  Manage access and roles for your team.
                </p>
              </div>
              <div className="relative w-full sm:w-72 group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-emerald-600 transition-colors" />
                <input
                  type="text"
                  placeholder="Search by name or email..."
                  className="w-full pl-10 pr-4 py-2 bg-gray-50 hover:bg-white focus:bg-white rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all placeholder:text-gray-400"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="overflow-x-auto min-h-[400px]">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50/80 text-gray-500 font-medium border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-4 font-semibold w-[35%] tracking-wide text-xs uppercase">
                      User
                    </th>
                    <th className="px-6 py-4 font-semibold tracking-wide text-xs uppercase">
                      Role
                    </th>
                    <th className="px-6 py-4 font-semibold tracking-wide text-xs uppercase">
                      Joined
                    </th>
                    <th className="px-6 py-4 font-semibold text-right tracking-wide text-xs uppercase">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white">
                  {filteredMembers.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-16 text-center">
                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Search className="w-8 h-8 text-gray-300" />
                        </div>
                        <h3 className="text-gray-900 font-medium mb-1">
                          No members found
                        </h3>
                        <p className="text-gray-500 text-sm">
                          No team members found matching &ldquo;{searchTerm}&rdquo;
                        </p>
                      </td>
                    </tr>
                  ) : (
                    filteredMembers.map((member) => (
                      <tr
                        key={member.id}
                        className="group hover:bg-gray-50/60 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center font-bold text-sm text-emerald-700 shrink-0 ring-2 ring-white shadow-sm group-hover:scale-105 transition-transform">
                              {member.profile.name
                                ? member.profile.name[0].toUpperCase()
                                : member.email[0].toUpperCase()}
                            </div>
                            <div className="min-w-0">
                              <p className="font-semibold text-gray-900 flex items-center gap-2 truncate">
                                {member.profile.name || "Unknown"}
                                {member.isCurrentUser && (
                                  <span className="bg-gray-100 text-gray-600 border border-gray-200 px-1.5 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider">
                                    You
                                  </span>
                                )}
                              </p>
                              <p className="text-gray-500 text-xs truncate max-w-[200px]">
                                {member.email}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ring-1 ring-inset ${getRoleBadgeColor(
                              member.role,
                            )}`}
                          >
                            {member.role === "ADMIN" && (
                              <ShieldCheck className="w-3 h-3" />
                            )}
                            {member.role === "MANAGER" && (
                              <User className="w-3 h-3" />
                            )}
                            {(member.role === "PROCUREMENT" ||
                              member.role === "FINANCE") && (
                              <div className="w-1.5 h-1.5 rounded-full bg-current opacity-60" />
                            )}
                            {member.role.charAt(0) +
                              member.role.slice(1).toLowerCase()}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-500 font-medium text-xs">
                          {format(new Date(member.joinedAt), "MMM d, yyyy")}
                        </td>
                        <td className="px-6 py-4 text-right">
                          {member.isActive ? (
                            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100/50 shadow-sm">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                              Active
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-red-700 bg-red-50 px-2.5 py-1 rounded-full border border-red-100/50 shadow-sm">
                              <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                              Inactive
                            </span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </div>

      {/* Invite Modal Overlay */}
      {inviteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm transition-opacity"
            onClick={() => setInviteModalOpen(false)}
          />
          <div className="relative bg-white w-full max-w-md rounded-2xl shadow-2xl ring-1 ring-gray-200 animate-in fade-in zoom-in-95 duration-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/30">
              <div>
                <h3 className="font-semibold text-gray-900">
                  Invite New Member
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Send an invitation to join your team.
                </p>
              </div>
              <button
                onClick={() => setInviteModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-2 rounded-full transition-all"
                type="button"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleInvite} className="p-6 space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">
                  Email Address
                </label>
                <div className="relative group">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-emerald-500 transition-colors" />
                  <input
                    type="email"
                    required
                    placeholder="colleague@company.com"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all placeholder:text-gray-400"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">
                  Role
                </label>
                <div className="relative">
                  <ShieldCheck className="absolute left-3 top-2.5 w-4 h-4 text-gray-400 z-10 pointer-events-none" />
                  <Select
                    value={inviteRole}
                    onValueChange={(value) =>
                      setInviteRole(value as CompanyRole)
                    }
                  >
                    <SelectTrigger className="w-full pl-10 py-2.5 h-10 rounded-xl border-gray-200 bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500">
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MANAGER">
                        Manager (Requester/Approver)
                      </SelectItem>
                      <SelectItem value="PROCUREMENT">
                        Procurement (Viewer/Submitter)
                      </SelectItem>
                      <SelectItem value="FINANCE">Finance</SelectItem>
                      <SelectItem value="ADMIN">Admin (Full Access)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="pt-2 flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setInviteModalOpen(false)}
                  className="flex-1 h-11 rounded-xl border-gray-200 hover:bg-gray-50 hover:text-gray-900"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={inviteLoading}
                  className="flex-1 h-11 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/20 transition-all hover:shadow-lg hover:-translate-y-0.5"
                >
                  {inviteLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  ) : (
                    <Plus className="w-4 h-4 mr-2" />
                  )}
                  Send Invite
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
