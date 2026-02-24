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
  ArrowRight,
  ArrowLeft,
  Filter,
  Activity,
  User,
  Clock,
  LayoutGrid,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default async function AuditLogsPage(props: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParams = await props.searchParams;
  const context = await getContext();
  if (!context) redirect("/sign-in");

  // RBAC: Admin Only
  if (context.role !== "ADMIN") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8">
        <div className="bg-red-50 p-4 rounded-full mb-6 relative">
          <div className="absolute inset-0 bg-red-100 rounded-full animate-ping opacity-20"></div>
          <ShieldAlert className="w-12 h-12 text-red-600 relative z-10" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Access Restricted
        </h1>
        <p className="text-gray-500 max-w-md mx-auto leading-relaxed">
          This area contains sensitive system logs and is available only to
          administrators. Please contact your workspace owner if you believe
          this is an error.
        </p>
        <Button
          className="mt-8 bg-gray-900 text-white hover:bg-gray-800"
          asChild
        >
          <a href="/dashboard">Return to Dashboard</a>
        </Button>
      </div>
    );
  }

  // Pagination & Filtering
  const page = Number(searchParams.page) || 1;
  const limit = 20;
  const skip = (page - 1) * limit;
  const search =
    typeof searchParams.search === "string" ? searchParams.search : "";
  const entityFilter =
    typeof searchParams.entity === "string" ? searchParams.entity : "ALL";

  // Build Query
  const where: any = {
    companyId: context.companyId!,
  };

  if (search) {
    where.OR = [
      { action: { contains: search, mode: "insensitive" } },
      { entity: { contains: search, mode: "insensitive" } },
      { user: { name: { contains: search, mode: "insensitive" } } },
    ];
  }

  if (entityFilter !== "ALL") {
    // If we had an enum or strict type, we'd use it. For string matching:
    where.entity = { equals: entityFilter, mode: "insensitive" };
  }

  const [logs, total] = await Promise.all([
    prisma.auditLog.findMany({
      where,
      include: {
        user: {
          select: { name: true },
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
        return <UserPlus className="w-4 h-4 text-pink-600" />;
      default:
        return <ShieldAlert className="w-4 h-4 text-gray-500" />;
    }
  };

  // Helper for Action Badge
  const getActionStyle = (action: string) => {
    if (
      action.includes("APPROVED") ||
      action.includes("SUCCESS") ||
      action.includes("VERIFIED")
    )
      return "bg-emerald-50 text-emerald-700 border-emerald-200 ring-emerald-500/20";
    if (action.includes("REJECTED") || action.includes("CANCELLED"))
      return "bg-rose-50 text-rose-700 border-rose-200 ring-rose-500/20";
    if (action.includes("CREATED") || action.includes("UPLOADED"))
      return "bg-blue-50 text-blue-700 border-blue-200 ring-blue-500/20";
    if (action.includes("UPDATED") || action.includes("EDITED"))
      return "bg-amber-50 text-amber-700 border-amber-200 ring-amber-500/20";
    return "bg-slate-50 text-slate-700 border-slate-200 ring-slate-500/20";
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 p-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Audit Trail
          </h1>
          <p className="text-gray-500 mt-2 text-lg">
            Monitor sensitive actions and system changes in real-time.
          </p>
        </div>
        <div className="flex items-center gap-3 bg-white p-2 rounded-xl border border-gray-100 shadow-sm">
          <div className="bg-emerald-50 p-2 rounded-lg">
            <Activity className="w-5 h-5 text-emerald-600" />
          </div>
          <div className="pr-4 border-r border-gray-100">
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Total Events
            </div>
            <div className="text-xl font-bold text-gray-900">{total}</div>
          </div>
          <div className="px-2">
            <div className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
              Live
            </div>
          </div>
        </div>
      </div>

      {/* Controls Bar */}
      <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 justify-between items-center transition-all duration-300 hover:shadow-md">
        {/* Search */}
        <div className="relative w-full md:max-w-md group">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400 group-focus-within:text-emerald-500 transition-colors" />
          </div>
          <form className="w-full">
            <input
              name="search"
              placeholder="Search by user, action or entity ID..."
              className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-xl leading-5 bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-200 sm:text-sm"
              defaultValue={search}
            />
            {/* Preserve other params like page if needed, though search usually resets page */}
          </form>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          {/* We could use client component for Select here to handle URL text, but avoiding client clutter for now. 
               Normally this would be a client component using useSearchParams.
               For this demo, we'll just show the UI or simple links if needed. 
           */}
          <div className="flex items-center gap-2 text-sm text-gray-500 bg-gray-50 px-3 py-2 rounded-lg border border-gray-200">
            <Filter className="w-4 h-4" />
            <span>Filters active: {search ? 1 : 0}</span>
            {search && (
              <a
                href="?"
                className="ml-2 text-emerald-600 hover:text-emerald-700 font-medium hover:underline"
              >
                Clear
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="px-6 py-5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Details
                </th>
                <th className="px-6 py-5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Action
                </th>
                <th className="px-6 py-5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Target Entity
                </th>
                <th className="px-6 py-5 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">
                  Timestamp
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 bg-white">
              {logs.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-24 text-center text-gray-500 flex flex-col items-center justify-center gap-4"
                  >
                    <div className="bg-gray-50 p-4 rounded-full">
                      <Search className="w-8 h-8 text-gray-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">
                        No logs found
                      </h3>
                      <p className="text-gray-400">
                        Try adjusting your search filters.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr
                    key={log.id}
                    className="group hover:bg-gray-50/80 transition-all duration-200"
                  >
                    {/* Details Column */}
                    <td className="px-6 py-4">
                      <div className="max-w-xs">
                        <div
                          className="text-sm font-medium text-gray-900 truncate"
                          title={JSON.stringify(log.metadata)}
                        >
                          {/* Try to show a friendly summary if possible, else generic */}
                          {/* Logically here we would parse log.metadata for a 'friendly' string */}
                          System Event #{log.id.slice(-6)}
                        </div>
                        <div className="text-xs text-gray-500 mt-1 truncate font-mono bg-gray-50 px-2 py-1 rounded border border-gray-100 w-fit">
                          {log.metadata
                            ? JSON.stringify(log.metadata).slice(0, 40) + "..."
                            : "No additional data"}
                        </div>
                      </div>
                    </td>

                    {/* User Column */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center border border-indigo-100 shadow-sm group-hover:scale-105 transition-transform">
                          <span className="text-indigo-600 font-bold text-xs">
                            {log.user.name?.[0]?.toUpperCase() || "U"}
                          </span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-semibold text-gray-900">
                            {log.user.name}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Action Column */}
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border shadow-sm ring-1 ring-inset ${getActionStyle(log.action)}`}
                      >
                        <div
                          className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                            log.action.includes("REJECT")
                              ? "bg-rose-500"
                              : log.action.includes("APPROVE")
                                ? "bg-emerald-500"
                                : log.action.includes("CREATE")
                                  ? "bg-blue-500"
                                  : "bg-gray-500"
                          }`}
                        ></div>
                        {log.action.replace(/_/g, " ")}
                      </span>
                    </td>

                    {/* Entity Column */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2.5">
                        <div className="p-2 bg-gray-50 rounded-lg group-hover:bg-white group-hover:shadow-sm transition-all border border-gray-100">
                          {getEntityIcon(log.entity)}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-gray-700 capitalize">
                            {log.entity.toLowerCase()}
                          </span>
                          <span className="text-[10px] text-gray-400 font-mono">
                            ID: {log.entityId.split("-")[0]}...
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Timestamp Column */}
                    <td className="px-6 py-4 text-right">
                      <div className="flex flex-col items-end gap-1">
                        <span className="text-sm font-medium text-gray-900">
                          {format(log.createdAt, "MMM dd, yyyy")}
                        </span>
                        <span className="text-xs text-gray-500 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {format(log.createdAt, "hh:mm a")}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Improved Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
            <div className="text-sm text-gray-500 font-medium">
              Showing <span className="text-gray-900">{skip + 1}</span> to{" "}
              <span className="text-gray-900">
                {Math.min(skip + limit, total)}
              </span>{" "}
              of <span className="text-gray-900">{total}</span> results
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="h-9 w-9 p-0"
                disabled={page <= 1}
                asChild={page > 1}
              >
                {page > 1 ? (
                  <a href={`?page=${page - 1}&search=${search}`}>
                    <ArrowLeft className="h-4 w-4" />
                  </a>
                ) : (
                  <span>
                    <ArrowLeft className="h-4 w-4" />
                  </span>
                )}
              </Button>
              <div className="bg-white border border-gray-200 rounded-md px-3 py-1.5 text-sm font-medium min-w-[3rem] text-center shadow-sm">
                {page}
              </div>
              <Button
                variant="outline"
                size="sm"
                className="h-9 w-9 p-0"
                disabled={page >= totalPages}
                asChild={page < totalPages}
              >
                {page < totalPages ? (
                  <a href={`?page=${page + 1}&search=${search}`}>
                    <ArrowRight className="h-4 w-4" />
                  </a>
                ) : (
                  <span>
                    <ArrowRight className="h-4 w-4" />
                  </span>
                )}
              </Button>
            </div>
          </div>
        )}
      </div>

      <div className="text-center text-xs text-gray-400 mt-8">
        Audit logs are immutable and retained for compliance purposes.
      </div>
    </div>
  );
}
