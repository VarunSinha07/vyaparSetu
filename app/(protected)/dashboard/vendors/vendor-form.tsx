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
  BadgeCheck,
  Save,
  Power,
  ShieldCheck,
  Briefcase,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
import { Vendor } from "@/app/generated/prisma/client";
import { cn } from "@/lib/utils";

interface VendorFormProps {
  initialData?: Partial<Vendor> & {
    bankName?: string | null;
    contactPerson?: string | null;
  };
  isEditMode?: boolean;
}

export default function VendorForm({
  initialData,
  isEditMode,
}: VendorFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [fetchingBank, setFetchingBank] = useState(false);

  // Form States
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    contactPerson: initialData?.contactPerson || "",
    email: initialData?.email || "",
    phone: initialData?.phone || "",
    address: initialData?.address || "",
    gstin: initialData?.gstin || "",
    pan: initialData?.pan || "",
    bankAccount: initialData?.bankAccount || "",
    ifsc: initialData?.ifsc || "",
    bankName: initialData?.bankName || "",
    vendorType: initialData?.vendorType || "GOODS",
    isActive: initialData?.isActive ?? true,
  });

  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Regex Patterns
  const GST_REGEX = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
  // const PAN_REGEX = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
  const IFSC_REGEX = /^[A-Z]{4}0[A-Z0-9]{6}$/;

  const isValidGST = !formData.gstin || GST_REGEX.test(formData.gstin);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;
    // Auto-uppercase tax and banking fields
    const upperCaseFields = ["gstin", "pan", "ifsc"];

    setFormData((prev) => ({
      ...prev,
      [name]: upperCaseFields.includes(name) ? value.toUpperCase() : value,
    }));
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));

    // Auto-fetch Bank Name on IFSC Blur
    if (name === "ifsc" && IFSC_REGEX.test(value)) {
      fetchBankDetails(value);
    }
  };

  const fetchBankDetails = async (ifsc: string) => {
    setFetchingBank(true);
    try {
      const res = await fetch(`https://ifsc.razorpay.com/${ifsc}`);
      if (res.ok) {
        const data = await res.json();
        setFormData((prev) => ({ ...prev, bankName: data.BANK }));
        toast.success(`Bank detected: ${data.BANK}`);
      } else {
        setFormData((prev) => ({ ...prev, bankName: "" }));
      }
    } catch (error) {
      console.error("Failed to fetch bank details", error);
    } finally {
      setFetchingBank(false);
    }
  };

  const toggleStatus = () => {
    setFormData((prev) => ({ ...prev, isActive: !prev.isActive }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValidGST) {
      toast.error("Please correct the GSTIN format before submitting.");
      return;
    }

    setLoading(true);

    try {
      const url = isEditMode
        ? `/api/vendors/${initialData?.id}`
        : "/api/vendors";
      const method = isEditMode ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg);
      }

      toast.success(
        isEditMode
          ? "Vendor updated successfully!"
          : "Vendor created successfully!",
      );
      router.push("/dashboard/vendors");
      router.refresh();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : null;
      toast.error(message || "Failed to save vendor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20">
      {/* Background Decor */}
      <div className="fixed inset-0 z-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-emerald-100/40 via-slate-50/50 to-white pointer-events-none" />

      <form
        onSubmit={handleSubmit}
        className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10"
      >
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 animate-in slide-in-from-top-4 duration-500">
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard/vendors"
              className="group p-3 bg-white border border-slate-200 rounded-2xl hover:border-emerald-300 hover:shadow-lg hover:shadow-emerald-500/10 transition-all duration-300"
            >
              <ArrowLeft className="w-5 h-5 text-slate-400 group-hover:text-emerald-700 transition-colors" />
            </Link>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
                  {isEditMode ? "Edit Vendor" : "New Vendor"}
                </h1>
                {isEditMode && (
                  <span
                    className={cn(
                      "px-3 py-1 rounded-full text-xs font-bold border shadow-sm",
                      formData.isActive
                        ? "bg-emerald-100 text-emerald-800 border-emerald-200"
                        : "bg-slate-100 text-slate-600 border-slate-200",
                    )}
                  >
                    {formData.isActive ? "Active" : "Inactive"}
                  </span>
                )}
              </div>
              <p className="text-slate-500 text-sm font-medium">
                {isEditMode
                  ? "Update vendor details, compliance info, and banking."
                  : "Onboard a new supplier to your procurement network."}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={toggleStatus}
              className={cn(
                "flex items-center gap-2 px-5 py-2.5 rounded-xl border text-sm font-semibold transition-all duration-200 shadow-sm",
                formData.isActive
                  ? "bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-slate-900 hover:border-slate-300"
                  : "bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100",
              )}
            >
              <Power className="w-4 h-4" />
              {formData.isActive ? "Deactivate Vendor" : "Activate Vendor"}
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-2.5 rounded-xl font-bold shadow-lg shadow-emerald-600/20 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:hover:scale-100"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              {isEditMode ? "Save Changes" : "Create Vendor"}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Main Column - Left */}
          <div className="lg:col-span-2 space-y-6">
            {/* 1. Entity Details Card */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50 overflow-hidden group animate-in slide-in-from-bottom-4 duration-500 delay-100 ring-1 ring-slate-900/5">
              <div className="p-6 border-b border-slate-100 bg-gradient-to-r from-slate-50/80 to-white flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-100/50 flex items-center justify-center text-emerald-600 shadow-sm ring-1 ring-emerald-100">
                  <Building2 className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900">
                    Company Profile
                  </h2>
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mt-0.5">
                    Step 01
                  </p>
                </div>
              </div>

              <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="text-sm font-bold text-slate-700 mb-2 block">
                    Company Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g. Acme Industries Ltd."
                    className="w-full rounded-xl border-slate-200 bg-slate-50/50 px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-medium"
                  />
                </div>

                <div>
                  <label className="text-sm font-bold text-slate-700 mb-2 block">
                    Contact Person
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                    <input
                      name="contactPerson"
                      value={formData.contactPerson}
                      onChange={handleChange}
                      placeholder="Manager Name"
                      className="w-full rounded-xl border-slate-200 bg-slate-50/50 pl-10 pr-4 py-3 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-bold text-slate-700 mb-2 block">
                    Vendor Type <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Briefcase className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                    <select
                      name="vendorType"
                      value={formData.vendorType}
                      onChange={handleChange}
                      className="w-full rounded-xl border-slate-200 bg-slate-50/50 pl-10 pr-10 py-3 text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all appearance-none font-medium cursor-pointer hover:bg-slate-100/50"
                    >
                      <option value="GOODS">Goods / Hardware</option>
                      <option value="SERVICES">Services / Consulting</option>
                    </select>
                    <div className="absolute right-4 top-4 text-slate-400 pointer-events-none">
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

                <div>
                  <label className="text-sm font-bold text-slate-700 mb-2 block">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                    <input
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="billing@company.com"
                      className="w-full rounded-xl border-slate-200 bg-slate-50/50 pl-10 pr-4 py-3 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-bold text-slate-700 mb-2 block">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                    <input
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+91 98765 00000"
                      className="w-full rounded-xl border-slate-200 bg-slate-50/50 pl-10 pr-4 py-3 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-medium"
                    />
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="text-sm font-bold text-slate-700 mb-2 block">
                    Registered Address
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      rows={2}
                      placeholder="Full office address with pincode"
                      className="w-full rounded-xl border-slate-200 bg-slate-50/50 pl-10 pr-4 py-3 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all resize-y min-h-[80px] font-medium"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Banking Details Card */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50 overflow-hidden animate-in slide-in-from-bottom-4 duration-500 delay-200 ring-1 ring-slate-900/5">
              <div className="p-6 border-b border-slate-100 bg-gradient-to-r from-slate-50/80 to-white flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-100/50 flex items-center justify-center text-blue-600 shadow-sm ring-1 ring-blue-100">
                  <Landmark className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900">
                    Financial Details
                  </h2>
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mt-0.5">
                    Step 02
                  </p>
                </div>
              </div>

              <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-bold text-slate-700 mb-2 block">
                    IFSC Code
                  </label>
                  <div className="relative">
                    <input
                      name="ifsc"
                      value={formData.ifsc}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      maxLength={11}
                      placeholder="HDFC0001234"
                      className="w-full rounded-xl border-slate-200 bg-slate-50/50 pl-4 pr-10 py-3 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-mono uppercase tracking-wide font-bold"
                    />
                    {fetchingBank ? (
                      <Loader2 className="absolute right-3.5 top-3.5 w-4 h-4 text-blue-500 animate-spin" />
                    ) : formData.bankName ? (
                      <BadgeCheck className="absolute right-3.5 top-3.5 w-4 h-4 text-emerald-500" />
                    ) : null}
                  </div>
                  {formData.bankName && (
                    <p className="mt-2 text-xs font-bold text-emerald-700 flex items-center gap-1.5 animate-in fade-in slide-in-from-top-1 bg-emerald-50 w-fit px-2 py-1 rounded-md border border-emerald-100">
                      <Building2 className="w-3.5 h-3.5" />
                      {formData.bankName}
                    </p>
                  )}
                </div>

                <div>
                  <label className="text-sm font-bold text-slate-700 mb-2 block">
                    Account Number
                  </label>
                  <div className="relative">
                    <CreditCard className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                    <input
                      name="bankAccount"
                      type="password"
                      value={formData.bankAccount}
                      onChange={handleChange}
                      placeholder="•••• •••• •••• 1234"
                      className="w-full rounded-xl border-slate-200 bg-slate-50/50 pl-10 pr-4 py-3 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-mono tracking-wider font-bold"
                    />
                  </div>
                </div>

                {/* Visual Card Preview */}
                <div className="md:col-span-2 mt-4">
                  <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl p-8 text-white shadow-2xl shadow-slate-900/10 relative overflow-hidden ring-1 ring-white/10 group">
                    <div className="absolute top-0 right-0 p-32 bg-white/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none group-hover:bg-white/10 transition-colors duration-700"></div>
                    <div className="flex justify-between items-start mb-10 relative z-10">
                      <div className="space-y-1.5">
                        <p className="text-[10px] text-slate-400 uppercase tracking-[0.2em] font-bold">
                          Bank Name
                        </p>
                        <p className="font-bold text-xl tracking-tight text-white">
                          {formData.bankName || "--------"}
                        </p>
                      </div>
                      <div className="bg-white/10 p-2 rounded-lg backdrop-blur-sm">
                        <Landmark className="w-6 h-6 text-white/90" />
                      </div>
                    </div>
                    <div className="space-y-2 relative z-10">
                      <p className="text-[10px] text-slate-400 uppercase tracking-[0.2em] font-bold">
                        Account Number
                      </p>
                      <p className="font-mono text-xl tracking-[0.15em] text-white/90 drop-shadow-sm">
                        {formData.bankAccount
                          ? `•••• ${formData.bankAccount.slice(-4)}`
                          : "•••• •••• •••• ••••"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Side Column - Right */}
          <div className="space-y-6 lg:sticky lg:top-6">
            {/* 3. Compliance Card */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50 overflow-hidden animate-in slide-in-from-right-4 duration-500 delay-300 ring-1 ring-slate-900/5">
              <div className="p-5 border-b border-slate-100 bg-amber-50/40 flex items-center gap-3">
                <ShieldCheck className="w-5 h-5 text-amber-600" />
                <h2 className="text-lg font-bold text-slate-900">
                  Tax & Compliance
                </h2>
              </div>

              <div className="p-6 space-y-6">
                <div>
                  <label className="text-sm font-bold text-slate-700 mb-2 block">
                    GSTIN <span className="text-rose-500">*</span>
                  </label>
                  <input
                    name="gstin"
                    value={formData.gstin}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    maxLength={15}
                    placeholder="22AAAAA0000A1Z5"
                    className={cn(
                      "w-full rounded-xl border bg-slate-50/50 px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-emerald-500/20  transition-all font-mono uppercase font-bold",
                      !isValidGST && touched.gstin
                        ? "border-red-300 focus:border-red-500"
                        : "border-slate-200 focus:border-emerald-500",
                    )}
                  />
                  {!isValidGST && touched.gstin && (
                    <p className="mt-2 text-xs font-semibold text-red-600 flex items-center gap-1.5 animate-in slide-in-from-top-1">
                      <AlertCircle className="w-3.5 h-3.5" /> Invalid GSTIN
                      format
                    </p>
                  )}
                </div>

                <div>
                  <label className="text-sm font-bold text-slate-700 mb-2 block">
                    PAN Number
                  </label>
                  <input
                    name="pan"
                    value={formData.pan}
                    onChange={handleChange}
                    maxLength={10}
                    placeholder="ABCDE1234F"
                    className="w-full rounded-xl border-slate-200 bg-slate-50/50 px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-mono uppercase font-bold"
                  />
                </div>
              </div>
            </div>

            {/* Quick Tips */}
            <div className="bg-gradient-to-br from-emerald-600 to-teal-700 rounded-3xl shadow-xl shadow-emerald-500/30 p-8 text-white overflow-hidden relative group animate-in slide-in-from-right-4 duration-500 delay-400 ring-1 ring-black/5">
              <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-3xl -mr-12 -mt-12 group-hover:bg-white/20 transition-all duration-700"></div>
              <h3 className="text-xl font-bold mb-3 relative z-10 flex items-center gap-2.5">
                <BadgeCheck className="w-6 h-6 text-emerald-200" />
                Audit Ready
              </h3>
              <p className="text-emerald-50 text-sm font-medium leading-relaxed relative z-10 opacity-90">
                Ensure all tax details are accurate. This vendor profile will be
                linked to future Purchase Orders and Invoices automatically.
              </p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
