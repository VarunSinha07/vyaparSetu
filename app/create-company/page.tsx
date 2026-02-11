"use client";

import { useState } from "react";
import {
  Building2,
  MapPin,
  Mail,
  Phone,
  ArrowRight,
  Loader2,
} from "lucide-react";
import Link from "next/link";

export default function CreateCompanyPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

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
    <div className="min-h-screen bg-[#f8fafc] flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute -top-[30%] -right-[10%] w-[70rem] h-[70rem] rounded-full bg-indigo-50/50 blur-3xl" />
        <div className="absolute top-[20%] -left-[10%] w-[50rem] h-[50rem] rounded-full bg-blue-50/50 blur-3xl" />
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <Link
          href="/"
          className="flex justify-center items-center gap-3 mb-8 group"
        >
          <div className="bg-indigo-600 p-2.5 rounded-xl shadow-lg shadow-indigo-600/20 group-hover:scale-105 transition-transform duration-300">
            <Building2 className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600">
            VyaparSetu
          </span>
        </Link>
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            Setup Your Workspace
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            Create your organization profile to get started with procurement
            management.
          </p>
        </div>
      </div>

      <div className="mt-2 sm:mx-auto sm:w-full sm:max-w-[520px] relative z-10">
        <div className="bg-white py-10 px-8 shadow-xl shadow-gray-200/50 sm:rounded-2xl border border-gray-100 ring-1 ring-gray-900/5">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="rounded-xl bg-red-50 p-4 ring-1 ring-red-100 border-l-4 border-red-500 animate-in fade-in slide-in-from-top-2">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-5 w-5 text-red-400"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-red-800">{error}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-5">
              <div className="group">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-1.5 transition-colors group-focus-within:text-indigo-600"
                >
                  Company Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Building2 className="h-5 w-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                  </div>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    placeholder="Acme Corp Pvt Ltd"
                    className="block w-full pl-10 pr-3 py-3 border-gray-200 rounded-xl bg-gray-50/50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition-all duration-200 sm:text-sm"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="group">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1.5 transition-colors group-focus-within:text-indigo-600"
                >
                  Official Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="contact@acme.com"
                    className="block w-full pl-10 pr-3 py-3 border-gray-200 rounded-xl bg-gray-50/50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition-all duration-200 sm:text-sm"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div className="group">
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-gray-700 mb-1.5 transition-colors group-focus-within:text-indigo-600"
                  >
                    Phone
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Phone className="h-5 w-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                    </div>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      placeholder="+91 98765 43210"
                      className="block w-full pl-10 pr-3 py-3 border-gray-200 rounded-xl bg-gray-50/50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition-all duration-200 sm:text-sm"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="group">
                <label
                  htmlFor="address"
                  className="block text-sm font-medium text-gray-700 mb-1.5 transition-colors group-focus-within:text-indigo-600"
                >
                  Office Address
                </label>
                <div className="relative">
                  <div className="absolute top-3 left-3 flex items-start pointer-events-none">
                    <MapPin className="h-5 w-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                  </div>
                  <textarea
                    id="address"
                    name="address"
                    rows={3}
                    placeholder="123 Business Park, Tech City..."
                    className="block w-full pl-10 pr-3 py-3 border-gray-200 rounded-xl bg-gray-50/50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition-all duration-200 sm:text-sm resize-none"
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
                className="w-full flex justify-center items-center py-3.5 px-4 border border-transparent rounded-xl shadow-sm text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-indigo-600/20 active:scale-[0.98]"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
                    Creating Workspace...
                  </>
                ) : (
                  <>
                    Create Workspace
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </button>
            </div>

            <p className="text-center text-xs text-gray-400 mt-4">
              By creating a workspace, you agree to our{" "}
              <Link href="#" className="underline hover:text-indigo-600">
                Terms of Service
              </Link>
              .
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
