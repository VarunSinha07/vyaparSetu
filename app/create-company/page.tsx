"use client";

import { useState } from "react";
import {
  Building2,
  MapPin,
  Mail,
  Phone,
  ArrowRight,
  Loader2,
  Upload,
  AlertCircle,
  Briefcase,
  FileText,
  X,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { InviteHandler } from "@/components/invite-handler";

const INDUSTRIES = [
  "Manufacturing",
  "Technology & IT",
  "Financial Services",
  "Healthcare & Pharma",
  "Retail & E-commerce",
  "Logistics & Supply Chain",
  "Construction & Real Estate",
  "Education",
  "Marketing & Agency",
  "Consulting",
  "Non-Profit",
  "Other",
];

export default function CreateCompanyPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [gstError, setGstError] = useState("");
  const [isDragOver, setIsDragOver] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    logo: "",
    gstin: "",
    industry: "",
  });

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    processFile(file);
  };

  const processFile = (file: File) => {
    if (file.size > 2 * 1024 * 1024) {
      setError("Logo file size must be less than 2MB");
      return;
    }

    if (!file.type.startsWith("image/")) {
      setError("Please upload an image file");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData({ ...formData, logo: reader.result as string });
      setError("");
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  };

  const removeLogo = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setFormData({ ...formData, logo: "" });
  };

  const validateGSTIN = (value: string) => {
    const uppercaseValue = value.toUpperCase();
    const regex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;

    if (value && !regex.test(uppercaseValue)) {
      setGstError("Invalid GSTIN format");
    } else {
      setGstError("");
    }
    setFormData({ ...formData, gstin: uppercaseValue });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (gstError) {
      setError("Please fix the errors before submitting.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/companies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to create company");
      }

      window.location.href = "/dashboard";
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 relative flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 overflow-hidden font-sans">
      <InviteHandler />
      {/* Decorative Background Elements aligned with Landing Page */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[30%] -left-[10%] w-[70%] h-[70%] rounded-full bg-emerald-100/30 blur-3xl animate-blob mix-blend-multiply" />
        <div className="absolute -bottom-[30%] -right-[10%] w-[70%] h-[70%] rounded-full bg-teal-100/30 blur-3xl animate-blob animation-delay-2000 mix-blend-multiply" />
        <div className="absolute top-[20%] right-[20%] w-[40%] h-[40%] rounded-full bg-slate-100/50 blur-3xl animate-blob animation-delay-4000 mix-blend-multiply" />
      </div>

      <div className="max-w-xl w-full relative z-10 space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
        {/* Header */}
        <div className="text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 group mb-8 transition-opacity hover:opacity-90"
          >
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-600 shadow-lg shadow-emerald-600/20 group-hover:scale-105 transition-transform duration-300">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 tracking-tight">
              VyaparFlow
            </span>
          </Link>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Create Organization
          </h2>
          <p className="mt-2 text-lg text-gray-600">
            Set up your digital workspace in seconds.
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden backdrop-blur-sm">
          {/* Top accent bar */}
          <div className="h-1.5 w-full bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600"></div>

          <div className="p-8 sm:p-10">
            <form className="space-y-6" onSubmit={handleSubmit}>
              {error && (
                <div className="p-4 rounded-xl bg-red-50 border border-red-100 flex items-start gap-3 animate-pulse">
                  <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                  <p className="text-sm font-medium text-red-800">{error}</p>
                </div>
              )}

              {/* Logo Upload - Centered */}
              <div className="flex flex-col items-center gap-4 py-2 border-b border-gray-50 pb-6">
                <div
                  className={cn(
                    "relative w-28 h-28 rounded-full border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all duration-300 overflow-hidden group bg-gray-50",
                    isDragOver
                      ? "border-emerald-500 bg-emerald-50 scale-105"
                      : "border-gray-200 hover:border-emerald-400 hover:bg-emerald-50/30",
                    formData.logo &&
                      "border-solid border-emerald-100 ring-4 ring-emerald-50",
                  )}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                  />

                  {formData.logo ? (
                    <>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={formData.logo}
                        alt="Logo"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10">
                        <Upload className="w-6 h-6 text-white" />
                      </div>
                      <button
                        onClick={removeLogo}
                        className="absolute top-1 right-1 p-1 bg-white text-red-500 rounded-full hover:bg-red-50 z-30 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </>
                  ) : (
                    <div className="flex flex-col items-center text-gray-400 group-hover:text-emerald-600 transition-colors">
                      <Upload className="w-6 h-6 mb-1" />
                      <span className="text-[10px] uppercase font-bold tracking-wide">
                        Upload
                      </span>
                    </div>
                  )}
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium text-gray-900">
                    Organization Logo
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    PNG, JPG up to 2MB
                  </p>
                </div>
              </div>

              <div className="space-y-5">
                {/* Name */}
                <div>
                  <label
                    htmlFor="name"
                    className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 ml-1"
                  >
                    Company Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Building2 className="h-5 w-5 text-gray-400 group-focus-within:text-emerald-600 transition-colors" />
                    </div>
                    <input
                      type="text"
                      name="name"
                      id="name"
                      required
                      className="block w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all bg-gray-50/50 focus:bg-white text-sm font-medium"
                      placeholder="E.g. Acme Corp"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* Industry */}
                  <div>
                    <label
                      htmlFor="industry"
                      className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 ml-1"
                    >
                      Industry
                    </label>
                    <Select
                      value={formData.industry}
                      onValueChange={(value) =>
                        setFormData({ ...formData, industry: value })
                      }
                    >
                      <SelectTrigger className="w-full pl-3 pr-3 py-3 h-auto border-gray-200 rounded-xl text-gray-900 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 bg-gray-50/50 focus:bg-white transition-all text-sm font-medium">
                        <div className="flex items-center gap-3">
                          <Briefcase className="h-5 w-5 text-gray-400" />
                          <SelectValue placeholder="Select..." />
                        </div>
                      </SelectTrigger>
                      <SelectContent className="max-h-60">
                        {INDUSTRIES.map((ind) => (
                          <SelectItem
                            key={ind}
                            value={ind}
                            className="cursor-pointer focus:bg-emerald-50 focus:text-emerald-700"
                          >
                            {ind}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* GSTIN */}
                  <div>
                    <label
                      htmlFor="gstin"
                      className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 ml-1 flex justify-between items-center"
                    >
                      <span>GSTIN</span>
                      <span className="text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded cursor-help">
                        Optional
                      </span>
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <FileText className="h-5 w-5 text-gray-400 group-focus-within:text-emerald-600 transition-colors" />
                      </div>
                      <input
                        type="text"
                        name="gstin"
                        id="gstin"
                        className={cn(
                          "block w-full pl-11 pr-4 py-3 border rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 transition-all bg-gray-50/50 focus:bg-white uppercase font-mono text-sm font-medium",
                          gstError
                            ? "border-red-300 focus:ring-red-200 focus:border-red-500"
                            : "border-gray-200 focus:ring-emerald-500/20 focus:border-emerald-500",
                        )}
                        placeholder="22AAAAA0000A1Z5"
                        maxLength={15}
                        value={formData.gstin}
                        onChange={(e) => validateGSTIN(e.target.value)}
                      />
                    </div>
                    {gstError && (
                      <p className="mt-1 text-xs text-red-500 ml-1">
                        {gstError}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* Email */}
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 ml-1"
                    >
                      Official Email
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-emerald-600 transition-colors" />
                      </div>
                      <input
                        type="email"
                        name="email"
                        id="email"
                        className="block w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all bg-gray-50/50 focus:bg-white text-sm font-medium"
                        placeholder="contact@company.com"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                      />
                    </div>
                  </div>

                  {/* Phone */}
                  <div>
                    <label
                      htmlFor="phone"
                      className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 ml-1"
                    >
                      Phone
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Phone className="h-5 w-5 text-gray-400 group-focus-within:text-emerald-600 transition-colors" />
                      </div>
                      <input
                        type="tel"
                        name="phone"
                        id="phone"
                        className="block w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all bg-gray-50/50 focus:bg-white text-sm font-medium"
                        placeholder="+91 98765 43210"
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData({ ...formData, phone: e.target.value })
                        }
                      />
                    </div>
                  </div>
                </div>

                {/* Address */}
                <div>
                  <label
                    htmlFor="address"
                    className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 ml-1"
                  >
                    Address
                  </label>
                  <div className="relative group">
                    <div className="absolute top-3.5 left-4 flex items-start pointer-events-none">
                      <MapPin className="h-5 w-5 text-gray-400 group-focus-within:text-emerald-600 transition-colors" />
                    </div>
                    <textarea
                      name="address"
                      id="address"
                      rows={3}
                      className="block w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all bg-gray-50/50 focus:bg-white resize-none text-sm font-medium"
                      placeholder="Registered office address..."
                      value={formData.address}
                      onChange={(e) =>
                        setFormData({ ...formData, address: e.target.value })
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center py-4 px-4 border border-transparent rounded-xl shadow-lg shadow-emerald-500/30 text-base font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      Create Workspace
                      <ArrowRight className="ml-2 -mr-1 w-5 h-5" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-gray-500">
          {new Date().getFullYear()} VyaparFlow. Secure & GST Compliant.
        </p>
      </div>
    </div>
  );
}
