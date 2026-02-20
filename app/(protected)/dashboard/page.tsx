"use client";

import { useEffect, useState } from "react";
import InviteMember from "./invite-member";
import {
  Users,
  Activity,
  Truck,
  FileText,
  Send,
  Loader2,
  UserPlus,
  Timer,
  Package,
  Gavel,
  FileCheck,
  StickyNote,
  FileBadge,
  Receipt,
  Plus,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { DemoSeeder } from "@/components/demo-seeder";
import Link from "next/link";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

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
      <div className="flex h-[80vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 animate-spin text-indigo-600" />
          <p className="text-sm text-gray-500 font-medium">
            Loading dashboard...
          </p>
        </div>
      </div>
    );
  }

  if (!data || !session) return null;

  const { role, stats } = data;
  const user = session.user;

  // Modern Greeting
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  // Unified Card Config - Cleaner, Sleeker, Aligned with Emerald/Teal Theme
  const allCards = [
    // Admin Cards
    {
      key: "activeMembersCount",
      label: "Active Members",
      icon: Users,
      trend: "Total Membership",
      trendUp: true,
      color: "emerald",
    },
    {
      key: "pendingInvitesCount",
      label: "Pending Invites",
      icon: UserPlus,
      trend: "Awaiting Action",
      trendUp: false,
      color: "amber",
    },
    {
      key: "totalVendorsCount",
      label: "Total Vendors",
      icon: Truck,
      trend: "Active Network",
      trendUp: true,
      color: "teal", // Changed to align with theme
    },
    {
      key: "totalPurchaseRequestsCount",
      label: "Total PRs",
      icon: FileText,
      trend: "Lifetime Volume",
      trendUp: true,
      color: "cyan", // Changed to align with theme
    },
    {
      key: "pendingPurchaseRequestsCount",
      label: "Pending PRs",
      icon: Timer,
      trend: "Action Needed",
      trendUp: false,
      color: "orange",
    },
    {
      key: "totalPurchaseOrdersCount",
      label: "Total POs",
      icon: Package,
      trend: "Business Volume",
      trendUp: true,
      color: "sky", // Changed to align with theme
    },
    // Manager Cards
    {
      key: "pendingApprovalsCount",
      label: "Pending Approvals",
      icon: Gavel,
      trend: "Urgent",
      trendUp: false,
      color: "rose",
    },
    {
      key: "approvedByMeCount",
      label: "Approved by Me",
      icon: FileCheck,
      trend: "This Month",
      trendUp: true,
      color: "emerald",
    },
    // Procurement Cards
    {
      key: "submittedPurchaseRequestsCount",
      label: "Submitted PRs",
      icon: Send,
      trend: "Awaiting Review",
      trendUp: true,
      color: "cyan",
    },
    {
      key: "draftPurchaseOrdersCount",
      label: "Draft POs",
      icon: StickyNote,
      trend: "Preparation",
      trendUp: true,
      color: "yellow",
    },
    {
      key: "issuedPurchaseOrdersCount",
      label: "Issued POs",
      icon: FileBadge,
      trend: "Committed",
      trendUp: true,
      color: "blue",
    },
    {
      key: "pendingInvoicesCount",
      label: "Pending Invoices",
      icon: Receipt,
      trend: "To Verify",
      trendUp: false,
      color: "rose",
    },
  ];

  const cards = allCards
    .filter((card) => stats && stats[card.key] !== undefined)
    .map((card) => ({
      ...card,
      value: stats[card.key] || 0,
    }));

  // Prepare Chart Data
  const chartData = cards.slice(0, 6).map((c) => ({
    name: c.label.replace("Total ", "").replace("Pending ", ""),
    value: c.value,
    color: c.color,
  }));

  // Helper for consistent colors aligned with theme
  const getColorClass = (color: string) => {
    const map: Record<string, string> = {
      emerald:
        "text-emerald-700 bg-emerald-50 border-emerald-100 ring-emerald-500/20",
      teal: "text-teal-700 bg-teal-50 border-teal-100 ring-teal-500/20",
      cyan: "text-cyan-700 bg-cyan-50 border-cyan-100 ring-cyan-500/20",
      sky: "text-sky-700 bg-sky-50 border-sky-100 ring-sky-500/20",
      blue: "text-blue-700 bg-blue-50 border-blue-100 ring-blue-500/20",
      indigo:
        "text-indigo-700 bg-indigo-50 border-indigo-100 ring-indigo-500/20", // Kept for darker accents
      rose: "text-rose-700 bg-rose-50 border-rose-100 ring-rose-500/20",
      amber: "text-amber-700 bg-amber-50 border-amber-100 ring-amber-500/20",
      orange:
        "text-orange-700 bg-orange-50 border-orange-100 ring-orange-500/20",
      yellow:
        "text-yellow-700 bg-yellow-50 border-yellow-100 ring-yellow-500/20",
    };
    return (
      map[color] || "text-gray-700 bg-gray-50 border-gray-100 ring-gray-200"
    );
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-12 font-sans">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2 border-b border-gray-100/50">
        <div>
          <div className="flex items-center gap-2 text-emerald-600/80 text-xs font-bold uppercase tracking-wider mb-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>
              {new Date().toLocaleDateString(undefined, {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight leading-tight">
            {greeting},{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600">
              {user.name?.split(" ")[0]}
            </span>
          </h1>
          <p className="text-gray-500 mt-2 text-lg">
            Here&apos;s your organization&apos;s performance overview.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <DemoSeeder role={role} />
          <Link
            href="/dashboard/purchase-requests/new"
            className="hidden sm:inline-flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-5 py-3 rounded-xl text-sm font-semibold transition-all shadow-lg shadow-emerald-600/20 hover:shadow-emerald-600/30 transform hover:-translate-y-0.5"
          >
            <Plus className="w-5 h-5" />
            New Request
          </Link>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, i) => {
          const style = getColorClass(card.color);
          return (
            <div
              key={i}
              className="group relative overflow-hidden rounded-2xl bg-white border border-gray-100 p-6 shadow-sm hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-300 hover:border-emerald-100"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-gray-50 to-gray-100 rounded-bl-full opacity-50 group-hover:scale-110 transition-transform duration-500" />

              <div className="relative z-10 flex flex-col h-full justify-between">
                <div className="flex justify-between items-start mb-6">
                  <div
                    className={`p-3.5 rounded-2xl ${style} shadow-sm ring-1 ring-inset`}
                  >
                    <card.icon className="w-6 h-6" />
                  </div>
                  <div
                    className={cn(
                      "text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border border-gray-100 bg-white shadow-sm",
                      card.trendUp ? "text-emerald-600" : "text-amber-600",
                    )}
                  >
                    {card.trend}
                  </div>
                </div>
                <div>
                  <h3 className="text-3xl font-bold text-gray-900 mb-1 tracking-tight group-hover:text-emerald-700 transition-colors">
                    {card.value.toLocaleString()}
                  </h3>
                  <p className="text-sm font-medium text-gray-500">
                    {card.label}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Main Chart Section */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold text-gray-900 tracking-tight">
                Activity Overview
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                Real-time metrics across your workspace
              </p>
            </div>
            {/* Chart Actions */}
            <button className="text-sm font-semibold text-emerald-600 hover:text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-4 py-2 rounded-lg transition-colors">
              Full Report
            </button>
          </div>

          <div className="h-[300px] ">
            {cards.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartData}
                  margin={{ top: 0, right: 0, left: -20, bottom: 0 }}
                  barSize={48}
                >
                  <defs>
                    <linearGradient
                      id="barGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="0%" stopColor="#059669" stopOpacity={0.8} />
                      <stop
                        offset="95%"
                        stopColor="#0d9488"
                        stopOpacity={0.8}
                      />
                    </linearGradient>
                    <linearGradient
                      id="barGradientHover"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="0%" stopColor="#059669" stopOpacity={1} />
                      <stop offset="95%" stopColor="#0d9488" stopOpacity={1} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#f1f5f9"
                  />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#64748b", fontSize: 11, fontWeight: 500 }}
                    dy={10}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#64748b", fontSize: 12 }}
                  />
                  <Tooltip
                    cursor={{ fill: "#f8fafc" }}
                    contentStyle={{
                      borderRadius: "16px",
                      border: "none",
                      boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                      padding: "12px 16px",
                    }}
                    labelStyle={{
                      color: "#64748b",
                      fontSize: "12px",
                      marginBottom: "4px",
                    }}
                    itemStyle={{
                      color: "#111827",
                      fontWeight: "bold",
                      fontSize: "14px",
                    }}
                  />
                  <Bar
                    dataKey="value"
                    radius={[8, 8, 8, 8]}
                    fill="url(#barGradient)"
                  ></Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-gray-400 bg-gray-50/50 rounded-2xl border-2 border-dashed border-gray-100">
                <div className="p-4 bg-white rounded-full shadow-sm mb-3">
                  <Activity className="w-6 h-6 text-gray-300" />
                </div>
                <p className="text-sm font-medium">
                  No activity data recorded yet
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Create your first request to see metrics
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions / Side Panel */}
        <div className="space-y-6">
          {/* Admin Actions */}
          {role === "ADMIN" && (
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
              <div className="px-6 py-5 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
                <h3 className="font-bold text-gray-900 text-sm uppercase tracking-wide">
                  Quick Invite
                </h3>
                <span className="flex h-2.5 w-2.5 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                </span>
              </div>
              <div className="p-5">
                <InviteMember />
              </div>
            </div>
          )}

          {/* Profile Widget */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 relative overflow-hidden group hover:shadow-md transition-all">
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-full opacity-50 blur-2xl group-hover:scale-150 transition-transform duration-700" />

            <div className="relative z-10">
              <div className="flex items-center gap-5 mb-6">
                <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-bold text-2xl shadow-lg shadow-emerald-500/20 ring-4 ring-white">
                  {user.name?.[0]}
                </div>
                <div>
                  <h3 className="font-bold text-lg text-gray-900 group-hover:text-emerald-700 transition-colors">
                    {user.name}
                  </h3>
                  <p className="text-sm text-gray-500 font-medium">
                    {user.email}
                  </p>
                </div>
              </div>

              <div className="space-y-3 bg-gray-50/50 rounded-2xl p-4 border border-gray-100/50">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500 font-medium">Role</span>
                  <span className="font-bold text-gray-900 bg-white px-2.5 py-0.5 rounded-md border border-gray-100 shadow-sm text-xs">
                    {role}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500 font-medium">Joined</span>
                  <span className="font-semibold text-gray-900">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <button className="w-full mt-6 bg-white hover:bg-gray-50 text-gray-700 font-semibold py-2.5 rounded-xl text-sm transition-all border border-gray-200 hover:border-gray-300 shadow-sm hover:shadow">
                Manage Profile
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
