"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import {
  ArrowLeft,
  Loader2,
  Save,
  Send,
  IndianRupee,
  Calendar,
  Package,
  UploadCloud,
  Paperclip,
  Trash2,
} from "lucide-react";
import { Vendor } from "@/app/generated/prisma/client";

export default function NewPurchaseRequestPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [vendors, setVendors] = useState<Vendor[]>([]);

  const [formData, setFormData] = useState({
    title: "",
    department: "",
    priority: "NORMAL",
    requiredBy: "",
    itemName: "",
    quantity: "",
    unitPrice: "",
    description: "",
    budgetCategory: "",
    preferredVendorId: "",
  });

  const [attachments, setAttachments] = useState<File[]>([]);

  // Calculate total estimated cost automatically
  const totalEstimatedCost =
    (parseFloat(formData.quantity) || 0) *
    (parseFloat(formData.unitPrice) || 0);

  useEffect(() => {
    fetch("/api/vendors")
      .then((res) => res.json())
      .then((data) => setVendors(data))
      .catch((err) => console.error("Failed to load vendors", err));
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setAttachments([...attachments, ...Array.from(e.target.files)]);
      toast.success("File added (mock upload)");
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments(attachments.filter((_, i) => i !== index));
  };

  const handleSubmit = async (submitForApproval: boolean) => {
    // Validation
    if (
      !formData.title ||
      !formData.department ||
      !formData.requiredBy ||
      !formData.itemName ||
      !formData.quantity ||
      !formData.unitPrice ||
      !formData.description
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    setLoading(true);

    try {
      // In a real app, you would upload files here and get URLs
      // const attachmentUrls = await uploadFiles(attachments);

      const res = await fetch("/api/purchase-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          quantity: parseInt(formData.quantity),
          unitPrice: parseFloat(formData.unitPrice),
          estimatedCost: totalEstimatedCost, // Derived field
          status: submitForApproval ? "SUBMITTED" : "DRAFT",
          attachments: attachments.map((f) => f.name), // Just storing names for now as per "lightweight"
        }),
      });

      if (!res.ok) throw new Error("Failed to create request");

      toast.success(
        submitForApproval
          ? "Purchase request submitted for approval"
          : "Draft saved successfully",
      );
      router.push("/dashboard/purchase-requests");
    } catch (error) {
      console.error(error);
      const message =
        error instanceof Error ? error.message : "Something went wrong";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto pb-12 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8 pt-6">
        <Link
          href="/dashboard/purchase-requests"
          className="p-2.5 hover:bg-white rounded-xl text-gray-500 hover:text-gray-900 transition-all hover:shadow-sm border border-transparent hover:border-gray-200"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            New Purchase Request
          </h1>
          <p className="text-gray-500 font-medium">
            Submit a new requisition for approval.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Form Area */}
        <div className="lg:col-span-8 space-y-6">
          {/* Section 1: Basic Info */}
          <section className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-xl shadow-gray-200/50 space-y-6 relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500 transition-all duration-300 group-hover:bg-teal-500" />

            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center text-sm font-bold ring-4 ring-emerald-50/50">
                1
              </span>
              Basic Information
            </h2>

            <div className="space-y-6 pl-1 sm:pl-11">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 ml-1">
                  Purchase Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Q1 Marketing Materials"
                  className="w-full px-5 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all placeholder:text-gray-400 font-medium text-gray-800"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 ml-1">
                    Department <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      className="w-full px-5 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all appearance-none font-medium text-gray-700 cursor-pointer"
                      value={formData.department}
                      onChange={(e) =>
                        setFormData({ ...formData, department: e.target.value })
                      }
                    >
                      <option value="">Select Dept</option>
                      <option value="IT">IT & Engineering</option>
                      <option value="Operations">Operations</option>
                      <option value="Admin">Administration</option>
                      <option value="Finance">Finance</option>
                      <option value="Marketing">Marketing</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 ml-1">
                    Priority <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      className="w-full px-5 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all appearance-none font-medium text-gray-700 cursor-pointer"
                      value={formData.priority}
                      onChange={(e) =>
                        setFormData({ ...formData, priority: e.target.value })
                      }
                    >
                      <option value="NORMAL">Normal</option>
                      <option value="URGENT">Urgent</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 ml-1">
                    Required By <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                      <Calendar className="w-4 h-4" />
                    </div>
                    <input
                      type="date"
                      className="w-full pl-10 pr-5 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-medium text-gray-700"
                      value={formData.requiredBy}
                      min={new Date().toISOString().split("T")[0]}
                      onChange={(e) =>
                        setFormData({ ...formData, requiredBy: e.target.value })
                      }
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Section 2: Item Details */}
          <section className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-xl shadow-gray-200/50 space-y-6 relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-1 h-full bg-blue-500 transition-all duration-300 group-hover:bg-indigo-500" />

            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-sm font-bold ring-4 ring-blue-50/50">
                2
              </span>
              Item Details
            </h2>

            <div className="space-y-6 pl-1 sm:pl-11">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 ml-1">
                  Item Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                    <Package className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    placeholder="e.g. MacBook Pro M3 Max"
                    className="w-full pl-10 pr-5 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-gray-400 font-medium text-gray-800"
                    value={formData.itemName}
                    onChange={(e) =>
                      setFormData({ ...formData, itemName: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 ml-1">
                    Quantity <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    placeholder="0"
                    className="w-full px-5 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-semibold text-gray-800"
                    value={formData.quantity}
                    onChange={(e) =>
                      setFormData({ ...formData, quantity: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 ml-1">
                    Est. Unit Price <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <IndianRupee className="w-4 h-4 text-blue-600" />
                    </div>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="0.00"
                      className="w-full pl-10 pr-5 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-semibold text-gray-800"
                      value={formData.unitPrice}
                      onChange={(e) =>
                        setFormData({ ...formData, unitPrice: e.target.value })
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="p-4 bg-blue-50/50 rounded-xl flex justify-between items-center border border-blue-100">
                <span className="text-sm font-medium text-blue-700">
                  Total Estimated Cost
                </span>
                <span className="text-xl font-bold text-blue-800 flex items-center">
                  <IndianRupee className="w-4 h-4 mr-1" />
                  {totalEstimatedCost.toLocaleString("en-IN")}
                </span>
              </div>
            </div>
          </section>

          {/* Section 3: Justification */}
          <section className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-xl shadow-gray-200/50 space-y-6 relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-1 h-full bg-purple-500 transition-all duration-300 group-hover:bg-purple-600" />
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center text-sm font-bold ring-4 ring-purple-50/50">
                3
              </span>
              Justification
            </h2>
            <div className="space-y-2 pl-1 sm:pl-11">
              <label className="text-sm font-semibold text-gray-700 ml-1">
                Description / Business Case{" "}
                <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={4}
                placeholder="Explain why this purchase is necessary..."
                className="w-full px-5 py-4 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all resize-none placeholder:text-gray-400 font-medium text-gray-800 leading-relaxed"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
            </div>
          </section>

          {/* Section 4: Attachments */}
          <section className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-xl shadow-gray-200/50 space-y-6 relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-1 h-full bg-gray-400 transition-all duration-300 group-hover:bg-gray-500" />

            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center text-sm font-bold ring-4 ring-gray-100">
                4
              </span>
              Attachments
            </h2>

            <div className="pl-1 sm:pl-11 space-y-4">
              <div className="border-2 border-dashed border-gray-200 rounded-2xl p-8 hover:bg-gray-50 transition-colors text-center cursor-pointer relative">
                <input
                  type="file"
                  multiple
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  onChange={handleFileChange}
                />
                <div className="flex flex-col items-center gap-3">
                  <div className="p-3 bg-indigo-50 text-indigo-600 rounded-full">
                    <UploadCloud className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Quotations, Spec Sheets, Invoices (PDF, PNG, JPG)
                    </p>
                  </div>
                </div>
              </div>

              {attachments.length > 0 && (
                <div className="space-y-3">
                  {attachments.map((file, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-3.5 bg-gray-50 rounded-xl border border-gray-100 group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-white rounded-lg border border-gray-100">
                          <Paperclip className="w-4 h-4 text-gray-400" />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-semibold text-gray-700 truncate max-w-[180px]">
                            {file.name}
                          </span>
                          <span className="text-xs text-gray-400 font-medium">
                            {(file.size / 1024).toFixed(1)} KB
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => removeAttachment(idx)}
                        className="p-2 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>

          {/* Section 5: Metadata */}
          <section className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-xl shadow-gray-200/50 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 ml-1">
                  Budget Category
                </label>
                <div className="relative">
                  <select
                    className="w-full px-5 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all appearance-none font-medium text-gray-700 cursor-pointer"
                    value={formData.budgetCategory}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        budgetCategory: e.target.value,
                      })
                    }
                  >
                    <option value="">Select (Optional)</option>
                    <option value="CAPEX">CapEx</option>
                    <option value="OPEX">OpEx</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 ml-1">
                  Preferred Vendor
                </label>
                <div className="relative">
                  <select
                    className="w-full px-5 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all appearance-none font-medium text-gray-700 cursor-pointer"
                    value={formData.preferredVendorId}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        preferredVendorId: e.target.value,
                      })
                    }
                  >
                    <option value="">No vendor decided yet</option>
                    {vendors.map((v) => (
                      <option key={v.id} value={v.id}>
                        {v.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Sidebar Summary Area */}
        <div className="lg:col-span-4">
          <div className="sticky top-8 space-y-6">
            <div className="bg-white rounded-3xl border border-gray-100 shadow-xl shadow-gray-200/50 p-6 sm:p-8 overflow-hidden relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>

              <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2 relative z-10">
                Request Summary
              </h3>

              <div className="space-y-4 mb-8 relative z-10">
                <div className="flex justify-between items-center py-2 border-b border-gray-50">
                  <span className="text-sm text-gray-500 font-medium">
                    Department
                  </span>
                  <span className="text-sm font-semibold text-gray-900 truncate max-w-[120px]">
                    {formData.department || "-"}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-50">
                  <span className="text-sm text-gray-500 font-medium">
                    Priority
                  </span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                      formData.priority === "URGENT"
                        ? "bg-red-50 text-red-600"
                        : "bg-emerald-50 text-emerald-600"
                    }`}
                  >
                    {formData.priority}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-50">
                  <span className="text-sm text-gray-500 font-medium">
                    Required By
                  </span>
                  <span className="text-sm font-semibold text-gray-900">
                    {formData.requiredBy
                      ? new Date(formData.requiredBy).toLocaleDateString()
                      : "-"}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-2">
                  <span className="text-sm text-gray-500 font-medium">
                    Total Est.
                  </span>
                  <span className="text-2xl font-bold text-emerald-600">
                    ₹{totalEstimatedCost.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>

              <div className="space-y-3 relative z-10">
                <button
                  onClick={() => handleSubmit(false)}
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl border border-gray-200 bg-white text-gray-700 font-bold hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm active:scale-[0.98] disabled:opacity-70"
                >
                  <Save className="w-4 h-4" />
                  Save as Draft
                </button>

                <button
                  onClick={() => handleSubmit(true)}
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold hover:from-emerald-700 hover:to-teal-700 transition-all shadow-lg shadow-emerald-500/20 active:scale-[0.98] disabled:opacity-70"
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Submit for Approval
                    </>
                  )}
                </button>
              </div>

              <p className="text-xs text-center text-gray-400 mt-6 font-medium relative z-10">
                By submitting, you confirm that this request complies with
                company procurement policies.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
