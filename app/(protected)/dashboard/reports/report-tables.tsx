import { format } from "date-fns";

export interface VendorSpendRow {
  vendorName: string;
  totalAmount: number;
  invoiceCount: number;
  lastPaymentDate: Date | null;
}

export function VendorSpendTable({ data }: { data: VendorSpendRow[] }) {
  if (data.length === 0)
    return (
      <div className="p-4 text-center text-sm text-slate-500">
        No data available
      </div>
    );

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left">
        <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b">
          <tr>
            <th className="px-4 py-3">Vendor Name</th>
            <th className="px-4 py-3 text-right">Total (₹)</th>
            <th className="px-4 py-3 text-center">Invoices</th>
            <th className="px-4 py-3 text-right">Last Payment</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => (
            <tr key={idx} className="border-b last:border-0 hover:bg-slate-50">
              <td className="px-4 py-3 font-medium text-slate-900">
                {row.vendorName}
              </td>
              <td className="px-4 py-3 text-right font-semibold text-slate-700">
                ₹{row.totalAmount.toLocaleString()}
              </td>
              <td className="px-4 py-3 text-center text-slate-600">
                {row.invoiceCount}
              </td>
              <td className="px-4 py-3 text-right text-slate-500">
                {row.lastPaymentDate
                  ? format(row.lastPaymentDate, "dd MMM yyyy")
                  : "-"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export interface AgingRow {
  invoiceNumber: string;
  vendorName: string;
  amount: number;
  daysPending: number;
  bucket: string;
  dueDate: Date;
}

export function AgingTable({ data }: { data: AgingRow[] }) {
  if (data.length === 0)
    return (
      <div className="p-4 text-center text-sm text-slate-500">
        No overdue invoices
      </div>
    );

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left">
        <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b">
          <tr>
            <th className="px-4 py-3">Invoice #</th>
            <th className="px-4 py-3">Vendor</th>
            <th className="px-4 py-3 text-right">Amount (₹)</th>
            <th className="px-4 py-3 text-center">Days Pending</th>
            <th className="px-4 py-3 text-center">Bucket</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => (
            <tr key={idx} className="border-b last:border-0 hover:bg-slate-50">
              <td className="px-4 py-3 font-medium text-slate-900">
                {row.invoiceNumber}
              </td>
              <td className="px-4 py-3 text-slate-600 truncate max-w-[150px]">
                {row.vendorName}
              </td>
              <td className="px-4 py-3 text-right font-semibold text-slate-700">
                ₹{row.amount.toLocaleString()}
              </td>
              <td className="px-4 py-3 text-center font-bold text-red-600">
                {row.daysPending}
              </td>
              <td className="px-4 py-3 text-center">
                <span
                  className={`px-2 py-1 rounded text-xs font-medium 
                  ${
                    row.bucket === "31+"
                      ? "bg-red-100 text-red-700"
                      : row.bucket === "16-30"
                        ? "bg-orange-100 text-orange-700"
                        : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {row.bucket}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
