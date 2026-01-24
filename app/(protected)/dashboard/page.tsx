import { getContext } from "@/lib/context";
import prisma from "@/lib/prisma";
import InviteMember from "./invite-member";
import { CompanyRole } from "@/app/generated/prisma/client";
import {
  User,
  Users,
  Mail,
  Activity,
  Building, // Using generic Building icon
  ArrowUpRight,
  Building2, // Added explicit import if needed, or I will switch to Building which is imported
  Calendar,
} from "lucide-react";

export default async function DashboardPage() {
  const context = await getContext();
  if (!context) return null;
  let activeMembersCount = 0;
  let pendingInvitesCount = 0;

  if (context.companyId) {
    const [members, invites] = await Promise.all([
      prisma.companyMember.count({
        where: {
          companyId: context.companyId,
          isActive: true,
        },
      }),
      prisma.invitation.count({
        where: {
          companyId: context.companyId,
          acceptedAt: null,
        },
      }),
    ]);
    activeMembersCount = members;
    pendingInvitesCount = invites;
  }

  const cards = [
    {
      label: "Active Members",
      value: activeMembersCount.toString(),
      trend: "+12%",
      trendUp: true,
      icon: Users,
      bgClass: "bg-blue-50",
      textClass: "text-blue-600",
    },
    {
      label: "Pending Invites",
      value: pendingInvitesCount.toString(),
      trend: "Waiting",
      trendUp: false,
      icon: Mail,
      bgClass: "bg-amber-50",
      textClass: "text-amber-600",
    },
    {
      label: "Departments",
      value: "4",
      trend: "Stable",
      trendUp: true,
      icon: Building,
      bgClass: "bg-emerald-50",
      textClass: "text-emerald-600",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-3xl bg-indigo-600 p-8 shadow-xl">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 h-64 w-64 rounded-full bg-indigo-500 opacity-20 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -mb-10 -ml-10 h-64 w-64 rounded-full bg-blue-500 opacity-20 blur-3xl"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight">
              Welcome back, {context.user.name?.split(" ")[0]}!
            </h1>
            <p className="mt-2 text-indigo-100 max-w-xl">
              Here&apos;s what&apos;s happening in your workspace today. You
              have full access to manage your team and procurement settings.
            </p>
          </div>

          <div className="flex gap-3">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-500/30 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm border border-indigo-400/20">
              <Activity className="w-4 h-4" />
              {context.role}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-500/30 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm border border-indigo-400/20">
              <Building className="w-4 h-4" />
              Tenant: {context.companyId?.slice(0, 8) || "N/A"}
            </span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {cards.map((card, i) => (
          <div
            key={i}
            className="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-900/5 transition-all hover:shadow-lg hover:-translate-y-1"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  {card.label}
                </p>
                <p className="mt-2 text-3xl font-bold text-gray-900">
                  {card.value}
                </p>
              </div>
              <div
                className={`p-3 rounded-xl ${card.bgClass} ${card.textClass}`}
              >
                <card.icon className="w-6 h-6" />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2">
              <span
                className={`text-xs font-medium px-2 py-1 rounded-full ${card.trendUp ? "bg-green-50 text-green-700" : "bg-gray-50 text-gray-600"}`}
              >
                {card.trend}
              </span>
              <span className="text-xs text-gray-400">vs last month</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Card */}
        <div className="lg:col-span-2 rounded-2xl bg-white shadow-sm ring-1 ring-gray-900/5 transition-all hover:shadow-md overflow-hidden">
          <div className="border-b border-gray-100 bg-gray-50/50 px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <User className="w-5 h-5 text-gray-500" />
              <h2 className="text-base font-semibold leading-6 text-gray-900">
                Personal Information
              </h2>
            </div>
            <button className="text-sm font-medium text-indigo-600 hover:text-indigo-700">
              Edit Profile
            </button>
          </div>

          <div className="p-6">
            <div className="flex flex-col sm:flex-row gap-8 items-start">
              <div className="flex-shrink-0">
                <div className="h-24 w-24 rounded-2xl bg-gradient-to-br from-indigo-50 to-blue-50 border-2 border-white shadow-sm flex items-center justify-center text-3xl font-bold text-indigo-300">
                  {context.user.name?.[0]}
                </div>
              </div>

              <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
                <div>
                  <p className="text-sm font-medium text-gray-500 flex items-center gap-2">
                    <User className="w-4 h-4 opacity-50" /> Full Name
                  </p>
                  <p className="mt-1.5 text-base font-semibold text-gray-900">
                    {context.user.name}
                  </p>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-500 flex items-center gap-2">
                    <Mail className="w-4 h-4 opacity-50" /> Email Address
                  </p>
                  <p className="mt-1.5 text-base font-medium text-gray-900">
                    {context.user.email}
                  </p>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-500 flex items-center gap-2">
                    <Calendar className="w-4 h-4 opacity-50" /> Joined On
                  </p>
                  <p className="mt-1.5 text-sm font-medium text-gray-600">
                    {new Date(context.user.createdAt).toLocaleDateString(
                      undefined,
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      },
                    )}
                  </p>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-500 flex items-center gap-2">
                    <Activity className="w-4 h-4 opacity-50" /> Status
                  </p>
                  <div className="mt-1.5 flex items-center gap-2">
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
                    </span>
                    <span className="text-sm font-medium text-gray-700">
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
          {context.role === CompanyRole.ADMIN && <InviteMember />}

          <div className="rounded-2xl bg-gradient-to-br from-gray-900 to-gray-800 p-6 shadow-lg text-white relative overflow-hidden group cursor-pointer hover:shadow-xl transition-all">
            <div className="relative z-10">
              <h3 className="font-semibold text-lg">Download App</h3>
              <p className="mt-2 text-gray-300 text-sm">
                Get the VyaparFlow mobile app for managing procurement on the
                go.
              </p>
              <div className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-indigo-300 group-hover:text-white transition-colors">
                Get link <ArrowUpRight className="w-4 h-4" />
              </div>
            </div>

            <div className="absolute right-[-20px] bottom-[-20px] opacity-10 group-hover:opacity-20 transition-opacity">
              <Building2 className="w-32 h-32" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
