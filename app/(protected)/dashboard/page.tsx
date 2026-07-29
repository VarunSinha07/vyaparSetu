"use client";

import { useEffect, useState } from "react";
import InviteMember from "./invite-member";
import {
  Users,
  Activity,
  Truck,
  FileText,
  Send,
  UserPlus,
  Timer,
  Package,
  Gavel,
  FileCheck,
  Receipt,
  Plus,
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  Sparkles,
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

import { LoadingState } from "@/components/loading-state";

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
    return <LoadingState text="Loading your workspace overview..." />;
  }

  if (!data || !session) return null;

  const { role, stats } = data;
  const user = session.user;

  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  const allCards = [
    {
      key: "activeMembersCount",
      label: "Active Members",
      icon: Users,
      trend: "Total Members",
      trendUp: true,
      cardBg: "bg-gradient-to-br from-emerald-50 to-white border-emerald-200",
      iconBg: "bg-emerald-100 text-emerald-700",
      badgeStyle: "bg-emerald-100 text-emerald-800 border-emerald-300",
    },
    {
      key: "pendingInvitesCount",
      label: "Pending Invites",
      icon: UserPlus,
      trend: "Awaiting Action",
      trendUp: false,
      cardBg: "bg-gradient-to-br from-amber-50 to-white border-amber-200",
      iconBg: "bg-amber-100 text-amber-700",
      badgeStyle: "bg-amber-100 text-amber-800 border-amber-300",
    },
    {
      key: "totalVendorsCount",
      label: "Registered Vendors",
      icon: Truck,
      trend: "Active Suppliers",
      trendUp: true,
      cardBg: "bg-gradient-to-br from-teal-50 to-white border-teal-200",
      iconBg: "bg-teal-100 text-teal-700",
      badgeStyle: "bg-teal-100 text-teal-800 border-teal-300",
    },
    {
      key: "totalPurchaseRequestsCount",
      label: "Total Requests",
      icon: FileText,
      trend: "Lifetime PRs",
      trendUp: true,
      cardBg: "bg-gradient-to-br from-blue-50 to-white border-blue-200",
      iconBg: "bg-blue-100 text-blue-700",
      badgeStyle: "bg-blue-100 text-blue-800 border-blue-300",
    },
    {
      key: "pendingPurchaseRequestsCount",
      label: "Pending PRs",
      icon: Timer,
      trend: "Action Needed",
      trendUp: false,
      cardBg: "bg-gradient-to-br from-amber-50 to-white border-amber-200",
      iconBg: "bg-amber-100 text-amber-700",
      badgeStyle: "bg-amber-100 text-amber-800 border-amber-300",
    },
    {
      key: "totalPurchaseOrdersCount",
      label: "Issued POs",
      icon: Package,
      trend: "Active POs",
      trendUp: true,
      cardBg: "bg-gradient-to-br from-emerald-50 to-white border-emerald-200",
      iconBg: "bg-emerald-100 text-emerald-700",
      badgeStyle: "bg-emerald-100 text-emerald-800 border-emerald-300",
    },
    {
      key: "pendingApprovalsCount",
      label: "Pending Approvals",
      icon: Gavel,
      trend: "Urgent Review",
      trendUp: false,
      cardBg: "bg-gradient-to-br from-rose-50 to-white border-rose-200",
      iconBg: "bg-rose-100 text-rose-700",
      badgeStyle: "bg-rose-100 text-rose-800 border-rose-300",
    },
    {
      key: "approvedByMeCount",
      label: "Approved by Me",
      icon: FileCheck,
      trend: "This Month",
      trendUp: true,
      cardBg: "bg-gradient-to-br from-emerald-50 to-white border-emerald-200",
      iconBg: "bg-emerald-100 text-emerald-700",
      badgeStyle: "bg-emerald-100 text-emerald-800 border-emerald-300",
    },
    {
      key: "pendingInvoicesCount",
      label: "Pending Invoices",
      icon: Receipt,
      trend: "3-Way Match Needed",
      trendUp: false,
      cardBg: "bg-gradient-to-br from-rose-50 to-white border-rose-200",
      iconBg: "bg-rose-100 text-rose-700",
      badgeStyle: "bg-rose-100 text-rose-800 border-rose-300",
    },
  ];

  const cards = allCards
    .filter((card) => stats && stats[card.key] !== undefined)
    .map((card) => ({
      ...card,
      value: stats[card.key] || 0,
    }));

  const chartData = cards.slice(0, 6).map((c) => ({
    name: c.label.replace("Total ", "").replace("Pending ", ""),
    value: c.value,
  }));

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12 font-sans">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-emerald-100">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500" />
            <span>
              {new Date().toLocaleDateString(undefined, {
                weekday: "long",
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </span>
            <span className="text-slate-300">•</span>
            <span className="bg-emerald-100 text-emerald-800 border border-emerald-300 px-2 py-0.5 rounded-md font-extrabold uppercase tracking-wider text-[10px]">
              {role} WORKSPACE
            </span>
          </div>

          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            {greeting}, {user.name?.split(" ")[0]}
          </h1>
          <p className="text-slate-600 text-sm font-normal">
            Here is your organization&apos;s real-time spend & procurement snapshot.
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <DemoSeeder role={role} />
          <Link
            href="/dashboard/purchase-requests/new"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all shadow-md shadow-emerald-600/20 active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>New Request</span>
          </Link>
        </div>
      </div>

      {/* Vibrant Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {cards.map((card, i) => {
          const Icon = card.icon;
          return (
            <div
              key={i}
              className={`rounded-2xl p-5 border shadow-2xs hover:shadow-md transition-all space-y-4 flex flex-col justify-between ${card.cardBg}`}
            >
              <div className="flex items-center justify-between">
                <div className={`p-2.5 rounded-xl font-bold ${card.iconBg}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className={`text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md border ${card.badgeStyle}`}>
                  {card.trend}
                </span>
              </div>

              <div>
                <div className="text-3xl font-extrabold text-slate-900 tracking-tight">
                  {card.value.toLocaleString()}
                </div>
                <div className="text-xs font-bold text-slate-700 mt-0.5">
                  {card.label}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Chart & Quick Actions Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Activity Overview Chart */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-emerald-200/90 shadow-sm p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-extrabold text-slate-900">Activity Overview</h3>
              <p className="text-xs text-slate-500 font-normal">Volume across PRs, POs, Invoices & Approvals</p>
            </div>
            <Link
              href="/dashboard/reports"
              className="text-xs font-bold text-emerald-800 bg-emerald-100 hover:bg-emerald-200 px-3.5 py-1.5 rounded-lg transition-colors flex items-center gap-1 border border-emerald-300"
            >
              <span>Spend Reports</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="h-[280px]">
            {cards.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartData}
                  margin={{ top: 10, right: 0, left: -20, bottom: 0 }}
                  barSize={40}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#475569", fontSize: 11, fontWeight: 600 }}
                    dy={8}
                  />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: "#475569", fontSize: 11 }} />
                  <Tooltip
                    cursor={{ fill: "#ecfdf5" }}
                    contentStyle={{
                      borderRadius: "12px",
                      border: "1px solid #a7f3d0",
                      boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                      fontSize: "12px",
                      fontWeight: "bold",
                    }}
                  />
                  <Bar dataKey="value" radius={[6, 6, 0, 0]} fill="#059669" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-400 bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-xs">
                No activity data available
              </div>
            )}
          </div>
        </div>

        {/* Quick Team Management Card */}
        <div className="bg-white rounded-3xl border border-emerald-200/90 shadow-sm p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-extrabold text-slate-900">Workspace Control</h3>
            <span className="text-[10px] font-extrabold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300 uppercase">
              ACTIVE
            </span>
          </div>

          <InviteMember />
        </div>
      </div>
    </div>
  );
}
