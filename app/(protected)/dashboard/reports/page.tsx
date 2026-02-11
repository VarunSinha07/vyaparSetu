import { getContext } from "@/lib/context";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import {
  VendorSpendChart,
  ProcurementStatusChart,
  MonthlySpendChart,
  AgingChart,
} from "./report-charts";
import {
  VendorSpendTable,
  AgingTable,
  VendorSpendRow,
  AgingRow,
} from "./report-tables";
import { DateRangeFilter } from "./date-filter";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  format,
  subDays,
  startOfYear,
  differenceInDays,
  subMonths,
} from "date-fns";

export default async function ReportsPage({
  searchParams,
}: {
  searchParams: Promise<{ range?: string }>;
}) {
  const context = await getContext();
  if (!context) redirect("/sign-in");

  const { role, companyId } = context;
  if (!companyId) redirect("/sign-in");

  // RBAC Definitions
  const canViewFinancials =
    role === "ADMIN" || role === "FINANCE" || role === "MANAGER";

  // Date Filter Logic
  const { range: rangeParam } = await searchParams;
  const range = rangeParam || "30d";
  let dateFilter: { gte?: Date } = {};
  const today = new Date();

  if (range === "30d") {
    dateFilter = { gte: subDays(today, 30) };
  } else if (range === "90d") {
    dateFilter = { gte: subDays(today, 90) };
  } else if (range === "this_year") {
    dateFilter = { gte: startOfYear(today) };
  }

  // --- DATA FETCHING ---

  // 1. PR Status (Everyone)
  const prStatsRaw = await prisma.purchaseRequest.groupBy({
    by: ["status"],
    where: {
      companyId,
      createdAt: dateFilter,
    },
    _count: { _all: true },
  });

  // 2. Vendor Spend (Financials)
  // Maps to "Where is money being spent?" -> Invoices that are VERIFIED or PAID.

  interface InvoiceResult {
    totalAmount: number;
    createdAt: Date;
    vendor: { name: string | null } | null;
  }

  let invoicesRaw: InvoiceResult[] = [];
  if (canViewFinancials) {
    invoicesRaw = (await prisma.invoice.findMany({
      where: {
        companyId,
        status: { in: ["VERIFIED", "PAID"] },
        createdAt: dateFilter,
      },
      select: {
        vendor: { select: { name: true } },
        totalAmount: true,
        createdAt: true,
      },
    })) as unknown as InvoiceResult[];
  }

  // 3. Aging (Financials - Unpaid Invoices)
  // "What is pending?" -> Verified but NOT Paid.

  interface AgingInvoiceResult {
    id: string;
    invoiceNumber: string;
    totalAmount: number;
    invoiceDate: Date;
    createdAt: Date;
    vendor: { name: string | null } | null;
  }

  let agingRaw: AgingInvoiceResult[] = [];
  if (canViewFinancials) {
    agingRaw = (await prisma.invoice.findMany({
      where: {
        companyId,
        status: "VERIFIED", // Ready for payment but not paid
      },
      select: {
        id: true,
        invoiceNumber: true,
        totalAmount: true,
        invoiceDate: true,
        createdAt: true,
        vendor: { select: { name: true } },
      },
      orderBy: { invoiceDate: "asc" },
    })) as unknown as AgingInvoiceResult[];
  }

  // 4. Monthly Spend Trend (Financials)
  // "Spending over time" -> Payments made.

  interface CustomPaymentResult {
    amount: number;
    paidAt: Date | null;
  }

  let paymentsRaw: CustomPaymentResult[] = [];
  if (canViewFinancials) {
    paymentsRaw = (await prisma.payment.findMany({
      where: {
        companyId,
        status: "SUCCESS",
        paidAt: { gte: subMonths(today, 12) },
      },
      select: {
        amount: true,
        paidAt: true,
      },
    })) as unknown as CustomPaymentResult[];
  }

  // --- PROCESS DATA ---

  // 1. PR Status
  const prStatusData = prStatsRaw.map((s) => ({
    name: s.status,
    value: s._count._all,
  }));

  // 2. Vendor Spend Processing
  const vendorMap = new Map<
    string,
    { total: number; count: number; lastDate: Date | null }
  >();

  invoicesRaw.forEach((inv) => {
    const name = inv.vendor?.name || "Unknown";
    const existing = vendorMap.get(name) || {
      total: 0,
      count: 0,
      lastDate: null,
    };

    vendorMap.set(name, {
      total: existing.total + inv.totalAmount,
      count: existing.count + 1,
      lastDate: inv.createdAt,
    });
  });

  const vendorSpendArray = Array.from(vendorMap.entries())
    .map(([name, data]) => ({
      name,
      amount: data.total,
      invoiceCount: data.count,
      lastPaymentDate: data.lastDate,
    }))
    .sort((a, b) => b.amount - a.amount);

  const topVendorsChart = vendorSpendArray.slice(0, 10);
  const vendorTableData: VendorSpendRow[] = vendorSpendArray.map((v) => ({
    vendorName: v.name,
    totalAmount: v.amount,
    invoiceCount: v.invoiceCount,
    lastPaymentDate: v.lastPaymentDate,
  }));

  // 3. Aging Processing
  const agingBuckets = { "0-15": 0, "16-30": 0, "31+": 0 };
  const agingTableData: AgingRow[] = [];

  agingRaw.forEach((inv) => {
    // Schema doesn't have dueDate, so we estimate age = Today - InvoiceDate
    const targetDate = inv.invoiceDate || inv.createdAt;
    const diff = differenceInDays(today, targetDate);
    const ageDays = diff > 0 ? diff : 0;

    let bucket = "0-15";
    if (ageDays > 30) bucket = "31+";
    else if (ageDays > 15) bucket = "16-30";

    agingBuckets[bucket as keyof typeof agingBuckets]++;

    // Add to table
    agingTableData.push({
      invoiceNumber: inv.invoiceNumber,
      vendorName: inv.vendor?.name || "Unknown",
      amount: inv.totalAmount,
      daysPending: ageDays,
      bucket: bucket,
      dueDate: targetDate,
    });
  });

  const agingChartData = [
    { bucket: "0-15", value: agingBuckets["0-15"] },
    { bucket: "16-30", value: agingBuckets["16-30"] },
    { bucket: "31+", value: agingBuckets["31+"] },
  ];

  // 4. Monthly Trend Processing
  const monthlySpendMap = new Map<string, number>();
  // Initialize last 12 months (charts look better with full axis)
  for (let i = 11; i >= 0; i--) {
    monthlySpendMap.set(format(subMonths(today, i), "MMM yyyy"), 0);
  }

  paymentsRaw.forEach((p) => {
    if (!p.paidAt) return;
    const key = format(p.paidAt, "MMM yyyy");
    if (monthlySpendMap.has(key)) {
      monthlySpendMap.set(key, (monthlySpendMap.get(key) || 0) + p.amount);
    }
  });

  const monthlyTrendData = Array.from(monthlySpendMap.entries()).map(
    ([month, amount]) => ({
      month,
      amount,
    }),
  );

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto p-4 sm:p-6">
      {/* HEADER & FILTERS */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Reports & Analytics
          </h1>
          <p className="text-slate-500 mt-1">
            {role === "PROCUREMENT"
              ? "Track purchase request and order efficiency."
              : "Financial and operational insights."}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <DateRangeFilter />
        </div>
      </div>

      {/* --- SECTION 1: FINANCIALS (Admin/Finance/Manager) --- */}
      {canViewFinancials && (
        <>
          {/* ROW 1: SPEND ANALYSIS */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="shadow-sm border-slate-200">
              <CardHeader>
                <CardTitle>Vendor-wise Spend</CardTitle>
                <CardDescription>
                  Top vendors by total invoice amount
                </CardDescription>
              </CardHeader>
              <CardContent>
                <VendorSpendChart data={topVendorsChart} />
                <div className="mt-6 border-t pt-4">
                  <h4 className="text-sm font-semibold text-slate-900 mb-3">
                    Detailed Breakdown
                  </h4>
                  <div className="max-h-[300px] overflow-y-auto">
                    <VendorSpendTable data={vendorTableData} />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm border-slate-200">
              <CardHeader>
                <CardTitle>Monthly Spend Trend</CardTitle>
                <CardDescription>
                  Total payments over the last 12 months
                </CardDescription>
              </CardHeader>
              <CardContent>
                <MonthlySpendChart data={monthlyTrendData} />
                <div className="mt-6 p-4 bg-slate-50 rounded-lg text-sm text-slate-600">
                  <strong>Insight:</strong> This chart displays successful
                  payments processed over time. Use this to identify seasonal
                  spikes or rising costs.
                </div>
              </CardContent>
            </Card>
          </div>

          {/* ROW 2: AGING */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="shadow-sm border-slate-200 lg:col-span-2">
              <CardHeader>
                <CardTitle>Payment Aging Report</CardTitle>
                <CardDescription>
                  Overdue and pending invoices by days outstanding
                </CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1">
                  <AgingChart data={agingChartData} />
                </div>
                <div className="lg:col-span-2 border-l pl-0 lg:pl-8">
                  <h4 className="text-sm font-semibold text-slate-900 mb-3">
                    Outstanding Invoices
                  </h4>
                  <div className="max-h-[400px] overflow-y-auto">
                    <AgingTable data={agingTableData} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}

      {/* --- SECTION 2: PROCUREMENT (Everyone) --- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="shadow-sm border-slate-200">
          <CardHeader>
            <CardTitle>Procurement Efficiency</CardTitle>
            <CardDescription>
              Status distribution of Purchase Requests
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center">
              <ProcurementStatusChart data={prStatusData} />
            </div>
          </CardContent>
        </Card>
        {!canViewFinancials && (
          <Card className="shadow-sm border-slate-200 bg-slate-50 border-dashed flex items-center justify-center p-8">
            <div className="text-center">
              <h3 className="text-lg font-medium text-slate-900">
                Financial Reports Restricted
              </h3>
              <p className="text-slate-500 mt-1">
                Contact your administrator for access to spend analysis.
              </p>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
