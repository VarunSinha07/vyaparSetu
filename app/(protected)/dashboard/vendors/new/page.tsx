"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  ArrowLeft,
  Building2,
  CreditCard,
  Loader2,
  User,
  MapPin,
  Phone,
  Mail,
  Landmark,
} from "lucide-react";
import Link from "next/link";

export default function NewVendorPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // Form States
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    gstin: "",
    pan: "",
    bankAccount: "",
    ifsc: "",
    vendorType: "GOODS",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/vendors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg);
      }

      toast.success("Vendor created successfully!");
      router.push("/dashboard/vendors");
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : null;
      toast.error(message || "Failed to create vendor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12 relative isolate">
      {/* Background Decor - Made explicit z-0 to sit above layout background but below content */}
      <div className="fixed inset-0 z-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-50 via-white to-white pointer-events-none" />

      {/* Header */}
      <div className="relative z-10 flex items-center gap-4 border-b border-gray-200/60 pb-6">
        <Link
          href="/dashboard/vendors"
          className="group p-2.5 bg-white border border-gray-200 rounded-xl hover:border-indigo-300 hover:shadow-md transition-all text-gray-500 hover:text-indigo-600"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-indigo-800">
            New Vendor
          </h1>
          <p className="text-sm text-gray-500">
            Onboard a new supplier by capturing their business and tax details.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="relative z-10 space-y-8">
        {/* Basic Details Card */}
        <section className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white/40 shadow-xl ring-1 ring-gray-200/50 p-6 md:p-8 space-y-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-bl-[100px] -mr-10 -mt-10 opacity-50" />

          <div className="flex items-center gap-3 text-indigo-700 pb-4 border-b border-gray-100">
            <div className="p-2 bg-indigo-100 rounded-lg">
              <Building2 className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold text-gray-900">Entity Details</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-900 flex items-center gap-1">
                Vendor Company Name <span className="text-red-500">*</span>
              </label>
              <div className="relative group/input">
                <User className="absolute left-3 top-3 w-4 h-4 text-gray-400 group-focus-within/input:text-indigo-500 transition-colors" />
                <input
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Acme Industries Ltd."
                  className="w-full rounded-xl border-gray-200 bg-gray-50/50 pl-10 pr-4 py-2.5 text-gray-900 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm shadow-sm"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-900">
                Category
              </label>
              <div className="relative">
                <select
                  name="vendorType"
                  value={formData.vendorType}
                  onChange={handleChange}
                  className="w-full rounded-xl border-gray-200 bg-gray-50/50 px-4 py-2.5 text-gray-900 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm shadow-sm font-medium appearance-none cursor-pointer"
                >
                  <option value="GOODS">Goods / Hardware Supplier</option>
                  <option value="SERVICES">
                    Service Provider / Consultant
                  </option>
                </select>
                <div className="absolute right-4 top-3 text-gray-400 pointer-events-none">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    ></path>
                  </svg>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-900">
                Email Address
              </label>
              <div className="relative group/input">
                <Mail className="absolute left-3 top-3 w-4 h-4 text-gray-400 group-focus-within/input:text-indigo-500 transition-colors" />
                <input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="accounts@vendor.com"
                  className="w-full rounded-xl border-gray-200 bg-gray-50/50 pl-10 pr-4 py-2.5 text-gray-900 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm shadow-sm"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-900">
                Phone Number
              </label>
              <div className="relative group/input">
                <Phone className="absolute left-3 top-3 w-4 h-4 text-gray-400 group-focus-within/input:text-indigo-500 transition-colors" />
                <input
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+91 98765 43210"
                  className="w-full rounded-xl border-gray-200 bg-gray-50/50 pl-10 pr-4 py-2.5 text-gray-900 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm shadow-sm"
                />
              </div>
            </div>

            <div className="col-span-1 md:col-span-2 space-y-2">
              <label className="text-sm font-bold text-gray-900">
                Billing Address
              </label>
              <div className="relative group/input">
                <MapPin className="absolute left-3 top-3 w-4 h-4 text-gray-400 group-focus-within/input:text-indigo-500 transition-colors" />
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Enter the full registered address including PIN code"
                  rows={3}
                  className="w-full rounded-xl border-gray-200 bg-gray-50/50 pl-10 pr-4 py-2.5 text-gray-900 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm shadow-sm resize-none"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Tax & Financials Card */}
        <section className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white/40 shadow-xl ring-1 ring-gray-200/50 p-6 md:p-8 space-y-8 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-32 h-32 bg-green-50 rounded-br-[100px] -ml-10 -mt-10 opacity-50" />

          <div className="flex items-center gap-3 text-green-700 pb-4 border-b border-gray-100">
            <div className="p-2 bg-green-100 rounded-lg">
              <CreditCard className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold text-gray-900">Tax & Banking</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-900">GSTIN</label>
              <div className="relative">
                <input
                  name="gstin"
                  value={formData.gstin}
                  onChange={handleChange}
                  placeholder="22ABCDE1234F1Z5"
                  className="w-full rounded-xl border-gray-200 bg-gray-50/50 px-4 py-2.5 text-gray-900 focus:bg-white focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all text-sm shadow-sm uppercase font-mono tracking-wide"
                />
                <span className="absolute right-3 top-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  Required for GST Invoice
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-900">PAN</label>
              <input
                name="pan"
                value={formData.pan}
                onChange={handleChange}
                placeholder="ABCDE1234F"
                className="w-full rounded-xl border-gray-200 bg-gray-50/50 px-4 py-2.5 text-gray-900 focus:bg-white focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all text-sm shadow-sm uppercase font-mono tracking-wide"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-900">
                Bank Account Number
              </label>
              <div className="relative group/input">
                <Landmark className="absolute left-3 top-3 w-4 h-4 text-gray-400 group-focus-within/input:text-green-600 transition-colors" />
                <input
                  name="bankAccount"
                  value={formData.bankAccount}
                  onChange={handleChange}
                  type="password"
                  autoComplete="off"
                  placeholder="•••• •••• •••• 1234"
                  className="w-full rounded-xl border-gray-200 bg-gray-50/50 pl-10 pr-4 py-2.5 text-gray-900 focus:bg-white focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all text-sm shadow-sm font-mono"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-900">
                IFSC Code
              </label>
              <input
                name="ifsc"
                value={formData.ifsc}
                onChange={handleChange}
                placeholder="HDFC0001234"
                className="w-full rounded-xl border-gray-200 bg-gray-50/50 px-4 py-2.5 text-gray-900 focus:bg-white focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all text-sm shadow-sm uppercase font-mono tracking-wide"
              />
            </div>
          </div>
        </section>

        <div className="flex justify-end gap-3 pt-4">
          <Link
            href="/dashboard/vendors"
            className="px-6 py-3 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors active:scale-95"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="px-8 py-3 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 shadow-lg shadow-indigo-200 transition-all active:scale-95 disabled:opacity-50 flex items-center gap-2"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            Create Vendor
          </button>
        </div>
      </form>
    </div>
  );
}
