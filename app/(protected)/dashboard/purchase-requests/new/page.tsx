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
  Building2,
  FileText,
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
    description: "",
    estimatedCost: "",
    budgetCategory: "",
    preferredVendorId: "",
    requiredBy: "",
  });

  useEffect(() => {
    fetch("/api/vendors")
      .then((res) => res.json())
      .then((data) => setVendors(data))
      .catch((err) => console.error("Failed to load vendors", err));
  }, []);

  const selectedVendor = vendors.find(
    (v) => v.id === formData.preferredVendorId,
  );

  const handleSubmit = async (submitForApproval: boolean) => {
    // Basic Validation
    if (
      !formData.title ||
      !formData.description ||
      !formData.department ||
      parseFloat(formData.estimatedCost || "0") <= 0
    ) {
      toast.error("Please fill in all required fields properly.");
      return;
    }

    setLoading(true);

    try {
      // 1. Create the PR (Draft)
      const res = await fetch("/api/purchase-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          estimatedCost: parseFloat(formData.estimatedCost),
          budgetCategory: formData.budgetCategory || undefined,
          requiredBy: formData.requiredBy || undefined,
        }),
      });

      if (!res.ok) {
        throw new Error(await res.text());
      }

      const pr = await res.json();

      // 2. If "Submit for Approval" was clicked, trigger submission
      if (submitForApproval) {
        const submitRes = await fetch(
          `/api/purchase-requests/${pr.id}/submit`,
          {
            method: "POST",
          },
        );
        if (!submitRes.ok) {
          toast.success("Draft created, but submission failed.");
        } else {
          toast.success("Purchase Request Created & Submitted!");
        }
      } else {
        toast.success("Draft Purchase Request Created!");
      }

      router.push(`/dashboard/purchase-requests/${pr.id}`);
      router.refresh();
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Failed to create request";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto pb-12">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8 pt-4">
        <Link
          href="/dashboard/purchase-requests"
          className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            New Purchase Request
          </h1>
          <p className="text-gray-500">
            Create a formal request for materials or services.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Form Area */}
        <div className="lg:col-span-2 space-y-8">
          {/* Section 1: Basic Info */}
          <section className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-6">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs">
                1
              </span>
              Basic Information
            </h2>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Purchase Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Purchase of laptops for new hires"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Department <span className="text-red-500">*</span>
                  </label>
                  <select
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-white"
                    value={formData.department}
                    onChange={(e) =>
                      setFormData({ ...formData, department: e.target.value })
                    }
                  >
                    <option value="">Select Department</option>
                    <option value="IT">IT</option>
                    <option value="Operations">Operations</option>
                    <option value="Admin">Admin</option>
                    <option value="Finance">Finance</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Priority <span className="text-red-500">*</span>
                  </label>
                  <select
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-white"
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
            </div>
          </section>

          {/* Section 2: Description */}
          <section className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-6">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs">
                2
              </span>
              Purchase Description
            </h2>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Justification / Details <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={4}
                placeholder="e.g. We are onboarding 5 new developers and need laptops as per company standards."
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
            </div>
          </section>

          {/* Section 3: Cost Details */}
          <section className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-6">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs">
                3
              </span>
              Cost Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Estimated Amount (₹) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500">₹</span>
                  </div>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    value={formData.estimatedCost}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        estimatedCost: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Budget Category{" "}
                  <span className="text-gray-400 font-normal">(Optional)</span>
                </label>
                <select
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-white"
                  value={formData.budgetCategory}
                  onChange={(e) =>
                    setFormData({ ...formData, budgetCategory: e.target.value })
                  }
                >
                  <option value="">Select Category</option>
                  <option value="CAPEX">CapEx</option>
                  <option value="OPEX">OpEx</option>
                </select>
              </div>
            </div>
          </section>

          {/* Section 4 & 5: Vendor & Timeline */}
          <section className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-6">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs">
                4
              </span>
              Vendor & Timeline
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Preferred Vendor
                </label>
                <select
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-white"
                  value={formData.preferredVendorId}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      preferredVendorId: e.target.value,
                    })
                  }
                >
                  <option value="">Not decided</option>
                  {vendors.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Required By Date
                </label>
                <input
                  type="date"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  value={formData.requiredBy}
                  onChange={(e) =>
                    setFormData({ ...formData, requiredBy: e.target.value })
                  }
                />
              </div>

              {selectedVendor && (
                <div className="md:col-span-2 bg-gray-50 p-3 rounded-lg border border-gray-100 flex items-center gap-3">
                  <Building2 className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase">
                      Vendor Type
                    </p>
                    <p className="text-sm font-medium text-gray-900">
                      {selectedVendor.vendorType}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* Section 5: Attachments (Placeholder) */}
          <section className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-6">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs">
                5
              </span>
              Attachments
            </h2>
            <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 flex flex-col items-center justify-center text-center hover:bg-gray-50 transition-colors cursor-pointer">
              <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mb-3">
                <FileText className="w-6 h-6" />
              </div>
              <p className="text-sm font-medium text-gray-900">
                Click to upload files
              </p>
              <p className="text-xs text-gray-500 mt-1">
                SVG, PNG, JPG or PDF (max. 10MB)
              </p>
            </div>
          </section>
        </div>

        {/* Sidebar / Actions */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm sticky top-6">
            <h3 className="font-semibold text-gray-900 mb-4">
              Request Summary
            </h3>
            <div className="space-y-3 text-sm border-b border-gray-100 pb-4 mb-4">
              <div className="flex justify-between">
                <span className="text-gray-500">Department</span>
                <span className="font-medium text-gray-900">
                  {formData.department || "-"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Priority</span>
                <span
                  className={`font-medium ${formData.priority === "URGENT" ? "text-red-600" : "text-gray-900"}`}
                >
                  {formData.priority}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Total Est.</span>
                <span className="font-medium text-gray-900">
                  ₹
                  {parseFloat(formData.estimatedCost || "0").toLocaleString(
                    "en-IN",
                  )}
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => handleSubmit(false)}
                disabled={loading}
                className="w-full py-2.5 rounded-xl border border-gray-200 bg-white text-gray-700 font-medium hover:bg-gray-50 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Save className="w-4 h-4" /> Save as Draft
              </button>

              <button
                onClick={() => handleSubmit(true)}
                disabled={loading}
                className="w-full py-2.5 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 transition-all shadow-sm flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
                Submit for Approval
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
