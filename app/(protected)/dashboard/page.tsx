"use client";

import { useEffect, useState } from "react";
import InviteMember from "./invite-member";
import {
  User,
  Users,
  Mail,
  Activity,
  ArrowUpRight,
  Building2,
  Calendar,
  Truck,
  FileText,
  Send,
  Loader2,
  UserPlus,
  Timer,
  Package,
  Gavel,
  FileCheck,
  FileX,
  FilePenLine,
  CheckCircle2,
  StickyNote,
  FileBadge,
  Receipt,
  TrendingUp,
  MoreHorizontal,
  Wallet,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { DemoSeeder } from "@/components/demo-seeder";

interface DashboardData {
  companyId: string;
  role: string;
  stats: Record<string, number>;
}

export default function DashboardPage() {
  const { data: session } = authClient.useSession();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/dashboard")
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error("Failed to fetch dashboard data");
      })
      .then((data) => {
        setData(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (!data || !session) return null;

  const { role, stats, companyId } = data;
  const user = session.user;

  // Define all possible cards
  const allCards = [
    // Admin Cards
    {
      key: "activeMembersCount",
      label: "Active Members",
      icon: Users,
      bgClass: "bg-blue-50",
      textClass: "text-blue-600",
      trend: "Total",
      trendUp: true,
    },
    {
      key: "pendingInvitesCount",
      label: "Pending Invites",
      icon: UserPlus,
      bgClass: "bg-amber-50",
      textClass: "text-amber-600",
      trend: "Waiting",
      trendUp: false,
    },
    {
      key: "totalVendorsCount",
      label: "Total Vendors",
      icon: Truck,
      bgClass: "bg-emerald-50",
      textClass: "text-emerald-600",
      trend: "Active",
      trendUp: true,
    },
    {
      key: "totalPurchaseRequestsCount",
      label: "Total PRs",
      icon: FileText,
      bgClass: "bg-slate-50",
      textClass: "text-slate-600",
      trend: "Lifetime",
      trendUp: true,
    },
    {
      key: "pendingPurchaseRequestsCount",
      label: "Pending PRs",
      icon: Timer,
      bgClass: "bg-orange-50",
      textClass: "text-orange-600",
      trend: "Action Needed",
      trendUp: false,
    },
    {
      key: "totalPurchaseOrdersCount",
      label: "Total POs",
      icon: Package,
      bgClass: "bg-purple-50",
      textClass: "text-purple-600",
      trend: "Volume",
      trendUp: true,
    },

    // Manager Cards
    {
      key: "pendingApprovalsCount",
      label: "Pending Approvals",
      icon: Gavel,
      bgClass: "bg-red-50",
      textClass: "text-red-600",
      trend: "Urgent",
      trendUp: false,
    },
    {
      key: "approvedByMeCount",
      label: "Approved by Me",
      icon: FileCheck,
      bgClass: "bg-green-50",
      textClass: "text-green-600",
      trend: "This Month",
      trendUp: true,
    },
    {
      key: "rejectedByMeCount",
      label: "Rejected by Me",
      icon: FileX,
      bgClass: "bg-gray-50",
      textClass: "text-gray-600",
      trend: "This Month",
      trendUp: false,
    },

    // Procurement Cards
    {
      key: "draftPurchaseRequestsCount",
      label: "Draft PRs",
      icon: FilePenLine,
      bgClass: "bg-gray-100",
      textClass: "text-gray-600",
      trend: "In Progress",
      trendUp: true,
    },
    {
      key: "submittedPurchaseRequestsCount",
      label: "Submitted PRs",
      icon: Send,
      bgClass: "bg-blue-50",
      textClass: "text-blue-600",
      trend: "Awaiting",
      trendUp: true,
    },
    {
      key: "approvedPurchaseRequestsCount",
      label: "Approved PRs",
      icon: CheckCircle2,
      bgClass: "bg-emerald-50",
      textClass: "text-emerald-600",
      trend: "Ready for PO",
      trendUp: true,
    },
    {
      key: "draftPurchaseOrdersCount",
      label: "Draft POs",
      icon: StickyNote,
      bgClass: "bg-yellow-50",
      textClass: "text-yellow-600",
      trend: "Preparation",
      trendUp: true,
    },

    // Finance Cards
    {
      key: "issuedPurchaseOrdersCount",
      label: "Issued POs",
      icon: FileBadge,
      bgClass: "bg-indigo-50",
      textClass: "text-indigo-600",
      trend: "Committed",
      trendUp: true,
    },
    {
      key: "pendingInvoicesCount",
      label: "Pending Invoices",
      icon: Receipt,
      bgClass: "bg-rose-50",
      textClass: "text-rose-600",
      trend: "To Verify",
      trendUp: false,
    },
    {
      key: "pendingPaymentsCount",
      label: "Pending Payments",
      icon: Wallet,
      bgClass: "bg-teal-50",
      textClass: "text-teal-600",
      trend: "Due Soon",
      trendUp: false,
    },
  ];

  const cards = allCards
    .filter((card) => stats && stats[card.key] !== undefined)
    .map((card) => ({
      ...card,
      value: stats[card.key] || 0,
    }));

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-800 p-8 shadow-2xl ring-1 ring-white/10">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 h-[300px] w-[300px] rounded-full bg-gradient-to-br from-white/20 to-transparent blur-3xl" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 h-[300px] w-[300px] rounded-full bg-gradient-to-tr from-indigo-400/20 to-transparent blur-3xl" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-indigo-200 text-sm font-medium mb-2">
              <span>Overview</span>
              <span className="text-white/20">•</span>
              <DemoSeeder role={role} />
            </div>
            <h1 className="text-3xl font-bold text-white tracking-tight font-display">
              Welcome back, {user.name?.split(" ")[0]}!
            </h1>
            <p className="mt-2 text-indigo-100 max-w-xl text-base leading-relaxed">
              Here&apos;s your daily procurement snapshot. You have full
              visibility into your workspace activities.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-4 py-2.5 rounded-xl border border-white/10">
              <div className="p-1.5 bg-indigo-500/30 rounded-lg">
                <Activity className="w-4 h-4 text-indigo-200" />
              </div>
              <div>
                <p className="text-[10px] text-indigo-200 font-medium uppercase tracking-wider">
                  Role
                </p>
                <p className="text-sm font-semibold text-white">{role}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-4 py-2.5 rounded-xl border border-white/10">
              <div className="p-1.5 bg-indigo-500/30 rounded-lg">
                <Building2 className="w-4 h-4 text-indigo-200" />
              </div>
              <div>
                <p className="text-[10px] text-indigo-200 font-medium uppercase tracking-wider">
                  Tenant ID
                </p>
                <p className="text-sm font-semibold text-white">
                  {companyId?.slice(0, 8) || "N/A"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card, i) => (
          <div
            key={i}
            className="group relative overflow-hidden rounded-2xl bg-white border border-gray-100 p-6 shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
          >
            <div className="absolute right-0 top-0 p-4 opacity-[0.03] transition-all group-hover:scale-110 group-hover:opacity-[0.06]">
              <card.icon className="h-32 w-32 -rotate-12 transform text-gray-900" />
            </div>

            <div className="relative z-10 flex flex-col justify-between h-full">
              <div className="flex items-start justify-between mb-4">
                <div
                  className={`p-3 rounded-xl ${card.bgClass} ${card.textClass} ring-1 ring-inset ring-black/5 shadow-sm`}
                >
                  <card.icon className="w-6 h-6" />
                </div>
                {card.trend && (
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${card.trendUp ? "bg-emerald-50 text-emerald-700 border-emerald-100" : "bg-gray-50 text-gray-600 border-gray-200"}`}
                  >
                    {card.trendUp ? (
                      <TrendingUp className="w-3 h-3" />
                    ) : (
                      <MoreHorizontal className="w-3 h-3" />
                    )}
                    {card.trend}
                  </span>
                )}
              </div>

              <div>
                <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                  {card.label}
                </p>
                <p className="mt-1 text-3xl font-bold text-gray-900 tracking-tight font-display">
                  {card.value.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Card */}
        <div className="lg:col-span-2 rounded-2xl bg-white shadow-sm ring-1 ring-gray-900/5 transition-all hover:shadow-md overflow-hidden flex flex-col">
          <div className="border-b border-gray-100 bg-gray-50/50 px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center">
                <User className="w-4 h-4 text-indigo-600" />
              </div>
              <div>
                <h2 className="text-base font-bold text-gray-900">
                  Personal Information
                </h2>
                <p className="text-xs text-gray-500">
                  Manage your profile details
                </p>
              </div>
            </div>
          </div>

          <div className="p-8 flex-1">
            <div className="flex flex-col sm:flex-row gap-8 items-start h-full">
              <div className="flex-shrink-0">
                <div className="h-28 w-28 rounded-2xl bg-gradient-to-br from-indigo-100 via-white to-blue-100 border-4 border-white shadow-lg flex items-center justify-center text-4xl font-bold text-indigo-600 ring-1 ring-gray-100">
                  {user.name?.[0]}
                </div>
              </div>

              <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-8 w-full">
                <div className="group">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                    <User className="w-3 h-3" /> Full Name
                  </p>
                  <p className="text-lg font-medium text-gray-900 group-hover:text-indigo-600 transition-colors">
                    {user.name}
                  </p>
                </div>

                <div className="group">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                    <Mail className="w-3 h-3" /> Email Address
                  </p>
                  <p className="text-lg font-medium text-gray-900 group-hover:text-indigo-600 transition-colors">
                    {user.email}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                    <Calendar className="w-3 h-3" /> Joined
                  </p>
                  <p className="text-sm font-medium text-gray-600 bg-gray-50 px-3 py-1.5 rounded-lg inline-block border border-gray-100">
                    {new Date(user.createdAt).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                    <Activity className="w-3 h-3" /> Account Status
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                    </span>
                    <span className="text-sm font-bold text-emerald-700">
                      Active
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Actions / Invite */}
        <div className="space-y-6">
          {role === "ADMIN" && <InviteMember />}

          <div className="rounded-2xl bg-gradient-to-br from-gray-900 to-slate-800 p-8 shadow-xl text-white relative overflow-hidden group cursor-pointer hover:shadow-2xl transition-all border border-gray-800">
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center mb-6 border border-white/10 group-hover:scale-110 transition-transform">
                <Truck className="w-6 h-6 text-indigo-300" />
              </div>
              <h3 className="font-bold text-xl tracking-tight">Download App</h3>
              <p className="mt-3 text-gray-400 text-sm leading-relaxed">
                Get the full power of VyaparSetu on your mobile device. Manage
                procurement from anywhere.
              </p>
              <div className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-indigo-300 group-hover:text-white transition-colors">
                Get download link <ArrowUpRight className="w-4 h-4" />
              </div>
            </div>

            <div className="absolute right-[-20px] bottom-[-20px] opacity-5 group-hover:opacity-10 transition-opacity">
              <Building2 className="w-48 h-48" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
