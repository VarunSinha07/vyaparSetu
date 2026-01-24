import { getContext } from "@/lib/context";
import InviteMember from "./invite-member";
import { CompanyRole } from "@/app/generated/prisma/client";

export default async function DashboardPage() {
  const context = await getContext();
  if (!context) return null; // Should be handled by layout

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 max-w-2xl">
        <h2 className="text-lg font-semibold mb-4">Phase 2 Verification</h2>
        <div className="space-y-3 text-sm">
          <div className="grid grid-cols-3 gap-2 py-2 border-b border-gray-100">
            <span className="text-gray-500">Authenticated User</span>
            <span className="col-span-2 font-medium">{context.user.email}</span>
          </div>
          <div className="grid grid-cols-3 gap-2 py-2 border-b border-gray-100">
            <span className="text-gray-500">User ID</span>
            <span className="col-span-2 font-mono text-xs bg-gray-50 p-1 rounded">
              {context.userId}
            </span>
          </div>
          <div className="grid grid-cols-3 gap-2 py-2 border-b border-gray-100">
            <span className="text-gray-500">Current Role</span>
            <span className="col-span-2 font-medium">
              <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded text-xs border border-blue-200">
                {context.role}
              </span>
            </span>
          </div>
          <div className="grid grid-cols-3 gap-2 py-2 border-b border-gray-100">
            <span className="text-gray-500">Company ID (Tenant)</span>
            <span className="col-span-2 font-mono text-xs bg-gray-50 p-1 rounded">
              {context.companyId}
            </span>
          </div>
        </div>
      </div>

      {context.role === CompanyRole.ADMIN && <InviteMember />}
    </div>
  );
}
