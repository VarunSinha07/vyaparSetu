import { getContext } from "@/lib/context";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { format } from "date-fns";
import {
  ShieldAlert,
  Search,
  FileText,
  CreditCard,
  ShoppingBag,
  UserPlus,
} from "lucide-react";

export default async function AuditLogsPage(props: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParams = await props.searchParams;
  const context = await getContext();
  if (!context) redirect("/sign-in");

  // RBAC: Admin Only
  if (context.role !== "ADMIN") {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center">
        <ShieldAlert className="w-16 h-16 text-red-500 mb-4" />
        <h1 className="text-2xl font-bold text-gray-800">Access Denied</h1>
        <p className="text-gray-500 max-w-md mt-2">
          Audit logs contain sensitive system activity records and are
          restricted to Administrators only.
        </p>
      </div>
    );
  }

  // Pagination
  const page = Number(searchParams.page) || 1;
  const limit = 20;
  const skip = (page - 1) * limit;
  const search =
    typeof searchParams.search === "string" ? searchParams.search : "";

  // Fetch Logs
  const where = {
    companyId: context.companyId!,
    OR: search
      ? [
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          { action: { contains: search, mode: "insensitive" } as any },
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          { entity: { contains: search, mode: "insensitive" } as any },
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          { user: { name: { contains: search, mode: "insensitive" } } as any },
        ]
      : undefined,
  };

  const [logs, total] = await Promise.all([
    prisma.auditLog.findMany({
      where,
      include: {
        user: {
          select: { name: true }, // Fetch UserProfile (associated via logAudit)
        },
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.auditLog.count({ where }),
  ]);

  const totalPages = Math.ceil(total / limit);

  // Helper to get Icon based on Entity
  const getEntityIcon = (entity: string) => {
    switch (entity.toLowerCase()) {
      case "payment":
        return <CreditCard className="w-4 h-4 text-emerald-600" />;
      case "invoice":
        return <FileText className="w-4 h-4 text-blue-600" />;
      case "purchaseorder":
        return <ShoppingBag className="w-4 h-4 text-purple-600" />;
      case "purchaserequest":
        return <FileText className="w-4 h-4 text-orange-600" />;
      case "user":
        return <UserPlus className="w-4 h-4 text-gray-600" />;
      default:
        return <ShieldAlert className="w-4 h-4 text-gray-400" />;
    }
  };

  // Helper for Action Badge
  const getActionStyle = (action: string) => {
    if (
      action.includes("APPROVED") ||
      action.includes("SUCCESS") ||
      action.includes("VERIFIED")
    )
      return "bg-green-50 text-green-700 border-green-200";
    if (action.includes("REJECTED") || action.includes("CANCELLED"))
      return "bg-red-50 text-red-700 border-red-200";
    if (action.includes("CREATED") || action.includes("UPLOADED"))
      return "bg-blue-50 text-blue-700 border-blue-200";
    return "bg-gray-50 text-gray-700 border-gray-200";
  };

  return (
    <div className="max-w-6xl mx-auto pb-12">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 pt-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Audit Logs</h1>
          <p className="text-gray-500">
            Track all sensitive actions performed within your organization.
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 bg-amber-50 border border-amber-200 rounded-lg text-amber-800 text-sm">
          <ShieldAlert className="w-4 h-4" />
          <span>Admin Access Only</span>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6 flex gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <form>
            <input
              name="search"
              placeholder="Search by action, user or entity..."
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              defaultValue={search}
            />
          </form>
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/50 border-b border-gray-100">
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">
                Timestamp
              </th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">
                User
              </th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">
                Action
              </th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">
                Entity
              </th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">
                Details
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {logs.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-6 py-12 text-center text-gray-500"
                >
                  No audit records found.
                </td>
              </tr>
            ) : (
              logs.map((log) => (
                <tr
                  key={log.id}
                  className="hover:bg-gray-50/50 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-gray-900">
                        {format(log.createdAt, "MMM dd, yyyy")}
                      </span>
                      <span className="text-xs text-gray-500">
                        {format(log.createdAt, "hh:mm a")}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold text-xs">
                        {log.user.name?.[0] || "?"}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {log.user.name}
                        </div>
                        {/* <div className="text-xs text-gray-500">{log.user.email}</div> */}
                        {/* Email might not be directly on UserProfile, depending on schema */}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium border ${getActionStyle(log.action)}`}
                    >
                      {log.action.replace(/_/g, " ")}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {getEntityIcon(log.entity)}
                      <span className="text-sm text-gray-700 capitalize">
                        {log.entity.toLowerCase()}
                      </span>
                      <span className="text-xs text-gray-400 font-mono">
                        #{log.entityId.split("-")[0]}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-xs text-gray-500 max-w-xs break-words">
                      {log.metadata
                        ? JSON.stringify(log.metadata).slice(0, 50) +
                          (JSON.stringify(log.metadata).length > 50
                            ? "..."
                            : "")
                        : "-"}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Pagination Footer */}
        {totalPages > 1 && (
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
            <div className="text-sm text-gray-500">
              Page {page} of {totalPages}
            </div>
            <div className="flex gap-2">
              <a
                href={page > 1 ? `?page=${page - 1}&search=${search}` : "#"}
                className={`px-3 py-1 text-sm border rounded bg-white ${page <= 1 ? "opacity-50 pointer-events-none" : "hover:bg-gray-100"}`}
              >
                Previous
              </a>
              <a
                href={
                  page < totalPages ? `?page=${page + 1}&search=${search}` : "#"
                }
                className={`px-3 py-1 text-sm border rounded bg-white ${page >= totalPages ? "opacity-50 pointer-events-none" : "hover:bg-gray-100"}`}
              >
                Next
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
