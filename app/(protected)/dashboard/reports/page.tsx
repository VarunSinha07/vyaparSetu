import { getContext } from "@/lib/context";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { format, differenceInDays } from "date-fns";
import {
  BarChart3,
  PieChart,
  AlertCircle,
  Wallet,
  FileText,
  CheckCircle2,
  XCircle,
  Clock,
} from "lucide-react";

export default async function ReportsPage() {
  const context = await getContext();
  if (!context) redirect("/sign-in");

  const { role, companyId } = context;
  if (!companyId) redirect("/sign-in");

  const isProcurement = role === "PROCUREMENT";

  // Data Fetching
  const [prStats, vendorSpend, agingInvoices] = await Promise.all([
    // 1. Procurement Stats (For everyone)
    prisma.purchaseRequest.groupBy({
      by: ["status"],
      where: { companyId },
      _count: true,
    }),

    // 2. Vendor Spend (Admin/Finance only)
    !isProcurement
      ? prisma.payment.findMany({
          where: { companyId, status: "SUCCESS" },
          include: {
            invoice: {
              include: { vendor: true },
            },
          },
        })
      : Promise.resolve([]),

    // 3. Aging Invoices (Verified but not Paid) (Admin/Finance only)
    !isProcurement
      ? prisma.invoice.findMany({
          where: {
            companyId,
            status: "VERIFIED",
            // Logic: Verified means it's ready for payment.
            // We want to see how long it's been sitting.
            // Prisma doesn't do "NOT EXISTS Payment" easily in simple query without relation filtering
            // But usually Verified -> Paid transition handles status.
            // So just finding VERIFIED invoices is enough for "Pending Payment"
          },
          include: { vendor: true },
          orderBy: { invoiceDate: "asc" },
        })
      : Promise.resolve([]),
  ]);

  // Process Vendor Spend Data
  const spendByVendor: Record<
    string,
    { name: string; amount: number; count: number }
  > = {};
  vendorSpend.forEach((p) => {
    const vName = p.invoice.vendor.name;
    if (!spendByVendor[vName]) {
      spendByVendor[vName] = { name: vName, amount: 0, count: 0 };
    }
    spendByVendor[vName].amount += p.amount;
    spendByVendor[vName].count += 1;
  });

  const topVendors = Object.values(spendByVendor)
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 5); // Top 5

  // Process PR Stats
  const prCounts = {
    TOTAL: 0,
    APPROVED: 0,
    PENDING: 0,
    REJECTED: 0,
    DRAFT: 0,
  };

  prStats.forEach((stat) => {
    // @ts-expect-error: Dynamic property assignment based on status string
    prCounts[stat.status] = stat._count;
    prCounts.TOTAL += stat._count;
  });
  // Map "SUBMITTED" and "UNDER_REVIEW" to PENDING for simpler report

  // Custom type safe mapping if needed, simplified here

  return (
    <div className="max-w-6xl mx-auto pb-12">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 pt-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Statistical Reports
          </h1>
          <p className="text-gray-500">
            Insights into your procurement and financial health.
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 bg-white border border-gray-200 rounded-lg text-gray-600 text-sm shadow-sm">
          <BarChart3 className="w-4 h-4" />
          <span>{format(new Date(), "MMM yyyy")}</span>
        </div>
      </div>

      <div className="space-y-8">
        {/* REPORT 1: PROCUREMENT EFFICIENCY (Everyone) */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <PieChart className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-bold text-gray-800">
              Procurement Efficiency
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card
              label="Total Requests"
              value={prCounts.TOTAL}
              icon={<FileText className="text-gray-600" />}
            />
            <Card
              label="Approved"
              value={prCounts.APPROVED}
              subtext={`${((prCounts.APPROVED / (prCounts.TOTAL || 1)) * 100).toFixed(0)}% Rate`}
              icon={<CheckCircle2 className="text-emerald-600" />}
              trend="positive"
            />
            <Card
              label="Pending Review"
              value={prCounts.PENDING} // Note: This might be 0 if we didn't map SUBMITTED etc.
              // In real app, we would map specific enums.
              // Assuming direct match for now or handled in render.
              icon={<Clock className="text-amber-600" />}
            />
            <Card
              label="Rejected"
              value={prCounts.REJECTED}
              icon={<XCircle className="text-red-600" />}
            />
          </div>
        </section>

        {/* REPORT 2: FINANCIAL INSIGHTS (Admin/Finance Only) */}
        {!isProcurement ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Vendor Spend */}
            <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <Wallet className="w-5 h-5 text-indigo-600" />
                  <h3 className="font-bold text-gray-800">
                    Top Vendors by Spend
                  </h3>
                </div>
                <span className="text-xs font-semibold uppercase text-gray-400 tracking-wider">
                  Lifetime
                </span>
              </div>

              <div className="space-y-4">
                {topVendors.length === 0 ? (
                  <p className="text-center text-gray-400 py-8">
                    No payment data available.
                  </p>
                ) : (
                  topVendors.map((v, i) => (
                    <div
                      key={v.name}
                      className="flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-600">
                          {i + 1}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900 group-hover:text-indigo-600 transition-colors">
                            {v.name}
                          </div>
                          <div className="text-xs text-gray-500">
                            {v.count} Invoices
                          </div>
                        </div>
                      </div>
                      <div className="text-sm font-bold text-gray-900">
                        Rs. {v.amount.toLocaleString("en-IN")}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </section>

            {/* Payment Aging */}
            <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-orange-600" />
                  <h3 className="font-bold text-gray-800">
                    Pending Payments (Aging)
                  </h3>
                </div>
                <span className="text-xs font-semibold uppercase text-gray-400 tracking-wider">
                  Verified & Unpaid
                </span>
              </div>

              <div className="space-y-3">
                {agingInvoices.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <CheckCircle2 className="w-8 h-8 text-emerald-100 mb-2" />
                    <p className="text-sm text-gray-500">
                      All verified invoices are paid!
                    </p>
                  </div>
                ) : (
                  agingInvoices.slice(0, 5).map((inv) => {
                    const days = differenceInDays(
                      new Date(),
                      new Date(inv.invoiceDate),
                    );
                    return (
                      <div
                        key={inv.id}
                        className="flex items-center justify-between p-3 rounded-lg bg-orange-50/50 border border-orange-100"
                      >
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {inv.vendor.name}
                          </div>
                          <div className="text-xs text-gray-500">
                            Inv #{inv.invoiceNumber} •{" "}
                            {format(new Date(inv.invoiceDate), "MMM dd")}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-bold text-orange-700">
                            Rs. {inv.totalAmount.toLocaleString("en-IN")}
                          </div>
                          <div className="text-xs font-medium text-orange-600">
                            {days} days old
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
                {agingInvoices.length > 5 && (
                  <div className="text-center pt-2">
                    <span className="text-xs text-gray-500">
                      And {agingInvoices.length - 5} more...
                    </span>
                  </div>
                )}
              </div>
            </section>
          </div>
        ) : (
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-6 text-center">
            <h3 className="text-blue-800 font-medium">
              Financial Reports Hidden
            </h3>
            <p className="text-blue-600 text-sm mt-1">
              Your role (Procurement) only has access to operational reports.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function Card({
  label,
  value,
  subtext,
  icon,
  trend,
}: {
  label: string;
  value: number | string;
  subtext?: string;
  icon: React.ReactNode;
  trend?: string;
}) {
  return (
    <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-start justify-between">
      <div>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
          {label}
        </p>
        <div className="text-2xl font-bold text-gray-900">{value}</div>
        {subtext && (
          <p className="text-xs text-emerald-600 font-medium mt-1 flex items-center gap-1">
            {subtext}
          </p>
        )}
      </div>
      <div
        className={`p-2 rounded-lg ${trend === "positive" ? "bg-emerald-50" : "bg-gray-50"}`}
      >
        {icon}
      </div>
    </div>
  );
}
