"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Upload, FileText, CheckCircle2 } from "lucide-react";

interface PO {
  id: string;
  poNumber: string;
  vendor: { name: string };
  vendorId: string;
  totalAmount: number;
  invoice?: { id: string };
}

export default function UploadInvoicePage() {
  const router = useRouter();
  const [pos, setPos] = useState<PO[]>([]);
  const [loadingPOs, setLoadingPOs] = useState(true);

  const [selectedPO, setSelectedPO] = useState<string>("");
  const [formData, setFormData] = useState({
    invoiceNumber: "",
    invoiceDate: new Date().toISOString().split("T")[0],
    fileUrl: "",
    subtotal: 0,
    cgst: 0,
    sgst: 0,
    igst: 0,
    totalAmount: 0,
    vendorId: "", // Will be set from PO
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchPOs();
  }, []);

  const fetchPOs = async () => {
    try {
      const res = await fetch("/api/purchase-orders?status=ISSUED");
      if (res.ok) {
        const data: PO[] = await res.json();
        // Filter out POs that already have invoices
        setPos(data.filter((po) => !po.invoice));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingPOs(false);
    }
  };

  const handlePOSelect = (poId: string) => {
    setSelectedPO(poId);
    const po = pos.find((p) => p.id === poId);
    if (po) {
      // Auto-fill some data if needed, or just keep track of max amount
      // ideally we set vendorId here but we need it for submission
    }
  };

  const calculateTotal = () => {
    const textAmount =
      Number(formData.subtotal) +
      Number(formData.cgst) +
      Number(formData.sgst) +
      Number(formData.igst);
    setFormData((prev) => ({ ...prev, totalAmount: textAmount }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    const po = pos.find((p) => p.id === selectedPO);
    if (!po) return;

    // GST Validation
    const hasCGST_SGST = formData.cgst > 0 || formData.sgst > 0;
    const hasIGST = formData.igst > 0;

    if (hasCGST_SGST && hasIGST) {
      setError("Enter either CGST & SGST or IGST, not both.");
      setSubmitting(false);
      return;
    }

    // Basic client-side validation
    if (formData.totalAmount > po.totalAmount) {
      setError(
        `Invoice amount (₹${formData.totalAmount}) cannot exceed PO amount (₹${po.totalAmount})`,
      );
      setSubmitting(false);
      return;
    }

    try {
      const res = await fetch("/api/invoices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          purchaseOrderId: selectedPO,
          // We need vendorId from PO. The api/invoices endpoint expects it.
          // But our PO list might not have vendorId in root?
          // Let's check api/purchase-orders/route.ts.
          // It calls `prisma.purchaseOrder.findMany`. It includes `vendor: {select: {name: true}}`.
          // It DOES NOT return `vendorId` field explicitly unless prisma default behavior includes scalars.
          // Prisma details: `findMany` returns all scalars of the model + included relations.
          // So `vendorId` IS available.
          vendorId: po.vendorId,
          ...formData,
        }),
      });

      if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg);
      }

      router.push("/dashboard/invoices");
    } catch (err: any) {
      setError(err.message || "Failed to upload invoice");
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingPOs) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Upload Vendor Invoice
        </h1>
        <p className="text-gray-500">
          Select an issued PO and upload the invoice details.
        </p>
      </div>

      {pos.length === 0 ? (
        <div className="bg-yellow-50 p-4 rounded-md border border-yellow-200 text-yellow-800">
          No issued purchase orders found pending invoice.
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="space-y-8 bg-white p-6 rounded-xl border border-gray-200 shadow-sm"
        >
          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700">
              Select Purchase Order
            </label>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {pos.map((po) => (
                <div
                  key={po.id}
                  onClick={() => handlePOSelect(po.id)}
                  className={`cursor-pointer rounded-lg border p-4 transition-all hover:border-indigo-500 hover:shadow-sm ${selectedPO === po.id ? "border-indigo-600 ring-1 ring-indigo-600 bg-indigo-50" : "border-gray-200"}`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold text-gray-900">
                        {po.poNumber}
                      </p>
                      <p className="text-sm text-gray-500">{po.vendor.name}</p>
                    </div>
                    {selectedPO === po.id && (
                      <CheckCircle2 className="w-5 h-5 text-indigo-600" />
                    )}
                  </div>
                  <p className="mt-2 text-sm font-medium text-gray-900">
                    ₹{po.totalAmount.toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {selectedPO && (
            <div className="space-y-6 animate-in fade-in slide-in-from-top-4">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Invoice Number
                  </label>
                  <input
                    type="text"
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                    value={formData.invoiceNumber}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        invoiceNumber: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Invoice Date
                  </label>
                  <input
                    type="date"
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                    value={formData.invoiceDate}
                    onChange={(e) =>
                      setFormData({ ...formData, invoiceDate: e.target.value })
                    }
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Invoice File URL (Demo)
                  </label>
                  <div className="mt-1 flex rounded-md shadow-sm">
                    <input
                      type="url"
                      required
                      placeholder="https://example.com/invoice.pdf"
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                      value={formData.fileUrl}
                      onChange={(e) =>
                        setFormData({ ...formData, fileUrl: e.target.value })
                      }
                    />
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    For MVP demo, please paste a public PDF URL.
                  </p>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-6">
                <h3 className="text-sm font-medium text-gray-900 mb-4">
                  Payment Breakdown
                </h3>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-500">
                      Taxable Amount
                    </label>
                    <input
                      type="number"
                      min="0"
                      required
                      placeholder="0"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                      value={formData.subtotal === 0 ? "" : formData.subtotal}
                      onChange={(e) => {
                        setFormData((prev) => ({
                          ...prev,
                          subtotal: parseFloat(e.target.value) || 0,
                        }));
                        // defer calculation to blur or effect? simpler just to recalculate later or manually trigger
                      }}
                      onBlur={calculateTotal}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500">
                      CGST
                    </label>
                    <input
                      type="number"
                      min="0"
                      placeholder="0"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                      value={formData.cgst === 0 ? "" : formData.cgst}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          cgst: parseFloat(e.target.value) || 0,
                        })
                      }
                      onBlur={calculateTotal}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500">
                      SGST
                    </label>
                    <input
                      type="number"
                      min="0"
                      placeholder="0"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                      value={formData.sgst === 0 ? "" : formData.sgst}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          sgst: parseFloat(e.target.value) || 0,
                        })
                      }
                      onBlur={calculateTotal}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500">
                      IGST
                    </label>
                    <input
                      type="number"
                      min="0"
                      placeholder="0"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                      value={formData.igst === 0 ? "" : formData.igst}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          igst: parseFloat(e.target.value) || 0,
                        })
                      }
                      onBlur={calculateTotal}
                    />
                  </div>
                </div>
                <p className="mt-2 text-xs text-gray-500">
                  Enter either CGST & SGST or IGST, not both.
                </p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg flex justify-between items-center">
                <div>
                  <span className="font-medium text-gray-700 block">
                    Total Invoice Amount
                  </span>
                  {selectedPO && (
                    <span className="text-xs text-gray-500">
                      PO Amount: ₹
                      {pos
                        .find((p) => p.id === selectedPO)
                        ?.totalAmount.toLocaleString()}
                    </span>
                  )}
                </div>
                <span className="text-xl font-bold text-indigo-600">
                  ₹{formData.totalAmount.toLocaleString()}
                </span>
              </div>
              <p className="text-xs text-gray-500 text-right">
                Click input fields to update total.
              </p>

              {error && (
                <div className="p-3 rounded-md bg-red-50 text-sm text-red-600">
                  {error}
                </div>
              )}

              <div className="pt-4">
                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => router.back()}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:opacity-50"
                  >
                    {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                    Upload Invoice
                  </button>
                </div>
                <p className="mt-2 text-xs text-gray-500 text-right">
                  Invoice will be sent to Finance for verification.
                </p>
              </div>
            </div>
          )}
        </form>
      )}
    </div>
  );
}
