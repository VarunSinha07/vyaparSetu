"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";

const COLORS = {
  green: "#10b981", // Emerald-500
  blue: "#3b82f6", // Blue-500
  yellow: "#f59e0b", // Amber-500
  red: "#ef4444", // Red-500
  gray: "#9ca3af", // Gray-400
  indigo: "#6366f1", // Indigo-500
};

const PR_COLORS = {
  APPROVED: COLORS.green,
  REJECTED: COLORS.red,
  PENDING: COLORS.yellow,
  DRAFT: COLORS.gray,
  SUBMITTED: COLORS.blue,
  UNDER_REVIEW: COLORS.blue,
};

// Define explicit types for chart data
interface VendorSpendData {
  name: string;
  amount: number;
}

interface ProcurementStatusData {
  name: string;
  value: number;
  fill?: string;
}

interface MonthlySpendData {
  month: string;
  amount: number;
}

interface AgingData {
  bucket: string;
  value: number;
}

// Recharts tooltip props are often loose, but we can type them partially
interface TooltipPayloadEntry {
  name: string;
  value: number | string;
  color: string;
  payload: Record<string, unknown>;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayloadEntry[];
  label?: string;
}

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-slate-100 shadow-xl rounded-lg text-sm">
        <p className="font-semibold text-slate-700 mb-1">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} style={{ color: entry.color }}>
            {entry.name}:{" "}
            {typeof entry.value === "number"
              ? entry.value.toLocaleString()
              : entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export function VendorSpendChart({ data }: { data: VendorSpendData[] }) {
  if (!data || data.length === 0)
    return <NoData message="No vendor spend data available" />;

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart
        layout="vertical"
        data={data}
        margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
      >
        <CartesianGrid
          strokeDasharray="3 3"
          horizontal={true}
          vertical={false}
          stroke="#e2e8f0"
        />
        <XAxis type="number" hide />
        <YAxis
          type="category"
          dataKey="name"
          width={100}
          tick={{ fontSize: 11, fill: "#64748b" }}
        />
        <Tooltip content={<CustomTooltip />} />
        <Bar
          dataKey="amount"
          name="Spend (₹)"
          fill={COLORS.indigo}
          radius={[0, 4, 4, 0]}
          barSize={20}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function ProcurementStatusChart({
  data,
}: {
  data: ProcurementStatusData[];
}) {
  if (!data || data.length === 0)
    return <NoData message="No PR status data available" />;

  const chartData = data.map((d) => ({
    ...d,
    fill: (PR_COLORS as Record<string, string>)[d.name] || COLORS.gray,
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={80}
          paddingAngle={5}
          dataKey="value"
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.fill} />
          ))}
        </Pie>
        <Tooltip />
        <Legend verticalAlign="bottom" height={36} iconType="circle" />
      </PieChart>
    </ResponsiveContainer>
  );
}

export function MonthlySpendChart({ data }: { data: MonthlySpendData[] }) {
  if (!data || data.length === 0)
    return <NoData message="No transaction history found" />;

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart
        data={data}
        margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
      >
        <CartesianGrid
          strokeDasharray="3 3"
          vertical={false}
          stroke="#e2e8f0"
        />
        <XAxis
          dataKey="month"
          axisLine={false}
          tickLine={false}
          tick={{ fontSize: 12, fill: "#94a3b8" }}
          dy={10}
        />
        <YAxis
          axisLine={false}
          tickLine={false}
          tick={{ fontSize: 11, fill: "#94a3b8" }}
          tickFormatter={(val) => `₹${(val / 1000).toFixed(0)}k`}
        />
        <Tooltip content={<CustomTooltip />} />
        <Line
          type="monotone"
          dataKey="amount"
          name="Total Spend"
          stroke={COLORS.blue}
          strokeWidth={3}
          dot={{ r: 4, fill: COLORS.blue, strokeWidth: 2, stroke: "#fff" }}
          activeDot={{ r: 6 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

export function AgingChart({ data }: { data: AgingData[] }) {
  if (!data || data.length === 0) return <NoData message="No aging invoices" />;

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart
        data={data}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid
          strokeDasharray="3 3"
          vertical={false}
          stroke="#e2e8f0"
        />
        <XAxis
          dataKey="bucket"
          axisLine={false}
          tickLine={false}
          tick={{ fontSize: 12, fill: "#64748b" }}
        />
        <YAxis axisLine={false} tickLine={false} />
        <Tooltip cursor={{ fill: "#f8fafc" }} content={<CustomTooltip />} />
        <Bar
          dataKey="value"
          name="Invoices Count"
          fill={COLORS.red}
          radius={[4, 4, 0, 0]}
          barSize={40}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}

function NoData({ message }: { message: string }) {
  return (
    <div className="h-[300px] w-full flex items-center justify-center bg-slate-50 rounded-lg border border-dashed border-slate-200">
      <p className="text-sm text-slate-400 font-medium">{message}</p>
    </div>
  );
}
