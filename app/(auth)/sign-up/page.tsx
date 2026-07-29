"use client";

import { useState } from "react";
import { authClient } from "../../../lib/auth-client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Lock, User, Loader2, ArrowRight, Building2, ShieldCheck, CheckCircle2, Sparkles } from "lucide-react";

export default function SignUp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await authClient.signUp.email(
        {
          email,
          password,
          name,
          callbackURL: "/",
        },
        {
          onError: (ctx) => {
            setError(ctx.error.message);
            setLoading(false);
          },
          onSuccess: () => {
            router.push("/");
          },
        },
      );
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-emerald-500/20 selection:text-emerald-900 grid lg:grid-cols-12 overflow-hidden">
      {/* Left Column: Vibrant Emerald Hero Panel */}
      <div className="hidden lg:flex lg:col-span-6 bg-gradient-to-br from-emerald-600 via-teal-600 to-emerald-800 text-white p-12 lg:p-16 flex-col justify-between relative overflow-hidden">
        <div className="relative z-10">
          <Link href="/" className="inline-flex items-center gap-3 group">
            <div className="bg-white/10 backdrop-blur-md p-2.5 rounded-xl border border-white/20 shadow-md">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-extrabold text-white tracking-tight">VyaparFlow</span>
          </Link>
        </div>

        <div className="relative z-10 space-y-8 max-w-md">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20 text-white text-xs font-bold uppercase tracking-wider backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-emerald-200" />
            <span>14-Day Free Trial • No Credit Card</span>
          </div>

          <h1 className="text-3xl lg:text-4xl font-extrabold leading-tight">
            Start automating purchase requests & 3-way matching today.
          </h1>

          <div className="space-y-3 pt-2">
            {[
              "Instant GSTIN filing verification and ITC audit",
              "Multi-role approval hierarchy with instant notifications",
              "Automated 3-way matching (PO vs. GRN vs. Invoice)",
              "Razorpay & UPI direct payment integration",
            ].map((prop, idx) => (
              <div key={idx} className="flex items-center gap-2.5 text-xs text-emerald-50 font-semibold">
                <CheckCircle2 className="w-4 h-4 text-emerald-200 shrink-0" />
                <span>{prop}</span>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-3 gap-3 pt-4 border-t border-white/10 text-xs text-emerald-100 font-semibold">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-200" />
              <span>Bank-Grade</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-200" />
              <span>GST Ready</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-200" />
              <span>Zero Risk</span>
            </div>
          </div>
        </div>

        <div className="relative z-10 text-xs text-emerald-100/80 font-medium">
          © {new Date().getFullYear()} VyaparFlow Technologies Inc. All rights reserved.
        </div>
      </div>

      {/* Right Column: Sign Up Form */}
      <div className="lg:col-span-6 flex items-center justify-center p-6 sm:p-12 relative">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center lg:text-left space-y-1">
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Create your account</h2>
            <p className="text-slate-500 text-xs font-normal">Get started with your 14-day free trial</p>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm space-y-6">
            <form className="space-y-5" onSubmit={handleSubmit}>
              {error && (
                <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-rose-600 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div className="space-y-1.5">
                <label htmlFor="name" className="text-xs font-bold text-slate-700">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    className="block w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-xs text-slate-900 placeholder:text-slate-400 focus:border-emerald-600 focus:bg-white outline-none transition-colors"
                    placeholder="Varun Sinha"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="email" className="text-xs font-bold text-slate-700">
                  Work Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="block w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-xs text-slate-900 placeholder:text-slate-400 focus:border-emerald-600 focus:bg-white outline-none transition-colors"
                    placeholder="name@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="password" className="text-xs font-bold text-slate-700">
                  Create Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    required
                    className="block w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-xs text-slate-900 placeholder:text-slate-400 focus:border-emerald-600 focus:bg-white outline-none transition-colors"
                    placeholder="At least 8 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold py-3.5 rounded-xl transition-all shadow-md shadow-emerald-600/20 active:scale-95 disabled:opacity-70 disabled:hover:scale-100 text-xs"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Creating your workspace...</span>
                  </>
                ) : (
                  <>
                    <span>Create Free Account</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <div className="pt-4 border-t border-slate-100 text-center text-xs text-slate-500">
              Already have a VyaparFlow workspace?{" "}
              <Link href="/sign-in" className="font-extrabold text-emerald-700 hover:text-emerald-800 transition-colors">
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
