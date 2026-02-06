import { getContext } from "@/lib/context";
import { redirect } from "next/navigation";
import  prisma  from "@/lib/prisma";
import {
  VendorSpendChart,
  ProcurementStatusChart,
  MonthlySpendChart,
  AgingChart,
} from "./report-charts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { format, subMonths, differenceInDays } from "date-fns";

export default async function ReportsPage() {
  const context = await getContext();
  if (!context) redirect("/sign-in");

  const { role, companyId } = context;
  if (!companyId) redirect("/sign-in");

  // RBAC
  const isFinancialUser = role === "ADMIN" || role === "FINANCE"; // Updated to match schema enum if needed, or use string "FINANCE"

  // 1. Vendor Spend (Top 10) - invoices
  // Only for finance users
  let vendorSpendData: { name: string; amount: number }[] = [];
  if (isFinancialUser) {
    const invoices = await prisma.invoice.findMany({
      where: {
        companyId,
        status: { not: "REJECTED" },
      },
      include: {
        vendor: {
          select: { name: true },
        },
      },
    });

    const vendorSpendMap = new Map<string, number>();
    invoices.forEach((inv) => {
      const vendorName = inv.vendor?.name || "Unknown";
      const current = vendorSpendMap.get(vendorName) || 0;
      vendorSpendMap.set(vendorName, current + inv.totalAmount);
    });

    vendorSpendData = Array.from(vendorSpendMap.entries())
      .map(([name, amount]) => ({ name, amount }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 10);
  }

  // 2. PR Status Distribution (Everyone)
  const prStats = await prisma.purchaseRequest.groupBy({
    by: ["status"],
    where: { companyId },
    _count: {
        _all: true
    }
  });

  const prStatusData = prStats.map((stat) => ({
    name: stat.status,
    value: stat._count._all,
  }));

  // 3. Monthly Spend Trend (Last 12 Months)
  // Only for finance users
  let monthlySpendData: { month: string; amount: number }[] = [];
  if (isFinancialUser) {
    const startDate = subMonths(new Date(), 11);
    const payments = await prisma.payment.findMany({
      where: {
        companyId,
        createdAt: {
          gte: startDate,
        },
        status: "SUCCESS", // Only count successful payments
      },
      select: {
        amount: true,
        createdAt: true,
      },
    });

    const monthlySpendMap = new Map<string, number>();
    // Initialize last 12 months with 0
    for (let i = 11; i >= 0; i--) {
      const d = subMonths(new Date(), i);
      const key = format(d, "MMM yyyy");
      monthlySpendMap.set(key, 0);
    }

    payments.forEach((p) => {
      const key = format(p.createdAt, "MMM yyyy");
      if (monthlySpendMap.has(key)) {
        monthlySpendMap.set(key, (monthlySpendMap.get(key) || 0) + p.amount);
      }
    });

    monthlySpendData = Array.from(monthlySpendMap.entries()).map(([month, amount]) => ({
      month,
      amount,
    }));
  }

  // 4. Invoice Aging Report (Unpaid invoices)
  // Only for finance users
  let agingData: { bucket: string; value: number }[] = [];
  if (isFinancialUser) {
    const unpaidInvoices = await prisma.invoice.findMany({
      where: {
        companyId,
        status: { 
            in: ["VERIFIED", "UPLOADED", "UNDER_VERIFICATION", "MISMATCH"] // All non-paid, non-rejected statuses
        }, 
      },
      select: {
        invoiceDate: true,
        createdAt: true,
      },
    });

    const agingBuckets = { "0-15": 0, "16-30": 0, "31-60": 0, "60+": 0 };
    const today = new Date();

    unpaidInvoices.forEach((inv) => {
      const targetDate = inv.invoiceDate || inv.createdAt;
      const diff = differenceInDays(today, targetDate);

      // We are looking for days OVERDUE, or just age?
      // Typically Aging is "Days Outstanding". 
      // If diff is negative (due date in future), it's 0.
      const daysOutstanding = diff > 0 ? diff : 0; 

      if (daysOutstanding <= 15) agingBuckets["0-15"]++;
      else if (daysOutstanding <= 30) agingBuckets["16-30"]++;
      else if (daysOutstanding <= 60) agingBuckets["31-60"]++;
      else agingBuckets["60+"]++;
    });

    agingData = Object.entries(agingBuckets).map(([bucket, value]) => ({
      bucket,
      value,
    }));
  }

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto p-4 sm:p-6 lg:p-8">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Reports & Analytics</h1>
          <p className="text-slate-500 mt-2 text-lg">
            Real-time business intelligence for {role === 'ADMIN' ? 'management' : (role || 'User').toLowerCase().replace('_', ' ')}.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Monthly Spend Trend - Visible to Admin/Finance */}
        {isFinancialUser && (
          <Card className="col-span-1 md:col-span-2 shadow-sm border border-slate-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl font-semibold text-slate-800">Monthly Spend Trend</CardTitle>
              <CardDescription>Total outgoing successful payments over the last 12 months</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="pt-4 h-[350px]">
                <MonthlySpendChart data={monthlySpendData} />
              </div>
            </CardContent>
          </Card>
        )}

        {/* PR Status - Visible to Everyone */}
        <Card className="shadow-sm border border-slate-200 flex flex-col">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl font-semibold text-slate-800">Procurement Request Status</CardTitle>
            <CardDescription>Distribution of purchase requests by status</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 min-h-[300px] flex flex-col justify-center">
             <ProcurementStatusChart data={prStatusData} />
          </CardContent>
        </Card>

        {/* Vendor Spend - Visible to Admin/Finance */}
        {isFinancialUser ? (
          <Card className="shadow-sm border border-slate-200 flex flex-col">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl font-semibold text-slate-800">Top Vendor Spend</CardTitle>
              <CardDescription>Top 10 vendors by invoice volume</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 min-h-[300px]">
              <VendorSpendChart data={vendorSpendData} />
            </CardContent>
          </Card>
        ) : (
             <Card className="shadow-sm border border-slate-200 border-dashed bg-slate-50 flex items-center justify-center p-8">
                <p className="text-slate-400">Restricted Access</p>
             </Card>
        )}

        {/* Payment Aging - Visible to Admin/Finance */}
        {isFinancialUser && (
          <Card className="col-span-1 md:col-span-2 lg:col-span-1 shadow-sm border border-slate-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl font-semibold text-slate-800">Invoice Aging Analysis</CardTitle>
              <CardDescription>Unpaid invoices categorized by days outstanding</CardDescription>
            </CardHeader>
            <CardContent className="min-h-[300px]">
              <AgingChart data={agingData} />
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}