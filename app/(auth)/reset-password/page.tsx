"use client";

import { useState, Suspense, useEffect } from "react";
import { authClient } from "../../../lib/auth-client";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Mail,
  Lock,
  Loader2,
  ArrowRight,
  ArrowLeft,
  Building2,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Eye,
  EyeOff,
  AlertCircle,
  KeyRound,
  RotateCcw,
} from "lucide-react";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tokenFromUrl = searchParams.get("token");
  const errorFromUrl = searchParams.get("error");

  // Determine whether we are in "set new password" mode or "request reset link" mode
  const [token, setToken] = useState(tokenFromUrl || "");
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(
    errorFromUrl === "INVALID_TOKEN"
      ? "This password reset link is invalid or has expired. Please request a new link."
      : errorFromUrl || ""
  );
  const [requestSuccess, setRequestSuccess] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  useEffect(() => {
    if (tokenFromUrl) {
      setToken(tokenFromUrl);
    }
    if (errorFromUrl) {
      setError(
        errorFromUrl === "INVALID_TOKEN"
          ? "This password reset link is invalid or has expired. Please request a new link."
          : errorFromUrl
      );
    }
  }, [tokenFromUrl, errorFromUrl]);

  const isResetMode = Boolean(token);

  // Password validation helpers
  const isLengthValid = newPassword.length >= 8;
  const isMatch = confirmPassword.length > 0 && newPassword === confirmPassword;

  // Handle requesting a reset link
  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setRequestSuccess(false);

    try {
      await authClient.requestPasswordReset(
        {
          email,
          redirectTo: "/reset-password",
        },
        {
          onError: (ctx) => {
            setError(ctx.error.message || "Failed to send reset email. Please try again.");
            setLoading(false);
          },
          onSuccess: () => {
            setRequestSuccess(true);
            setLoading(false);
          },
        }
      );
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  // Handle submitting the new password with token
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLengthValid) {
      setError("Password must be at least 8 characters long.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await authClient.resetPassword(
        {
          newPassword,
          token,
        },
        {
          onError: (ctx) => {
            setError(ctx.error.message || "Failed to reset password. The link may have expired.");
            setLoading(false);
          },
          onSuccess: () => {
            setResetSuccess(true);
            setLoading(false);
          },
        }
      );
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  const resetToRequestMode = () => {
    setToken("");
    setError("");
    setRequestSuccess(false);
    setResetSuccess(false);
    setNewPassword("");
    setConfirmPassword("");
    router.replace("/reset-password");
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
            <span>Enterprise Security & Identity Protection</span>
          </div>

          <h1 className="text-3xl lg:text-4xl font-extrabold leading-tight">
            {isResetMode
              ? "Choose a strong password to secure your workspace."
              : "Regain access to your procurement & spend platform."}
          </h1>

          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 space-y-3 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-500/30 text-white">
                <KeyRound className="w-5 h-5 text-emerald-100" />
              </div>
              <div>
                <p className="text-xs font-bold text-white">Zero-Knowledge Token Security</p>
                <p className="text-[11px] text-emerald-100/90 font-medium">
                  Single-use cryptographic reset tokens with automatic 60-minute expiration.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 pt-2 text-xs text-emerald-100 font-semibold">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-200" />
              <span>SOC-2 Ready</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-200" />
              <span>256-bit SSL</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-200" />
              <span>Auto-Revoke</span>
            </div>
          </div>
        </div>

        <div className="relative z-10 text-xs text-emerald-100/80 font-medium">
          © {new Date().getFullYear()} VyaparFlow Technologies Inc. All rights reserved.
        </div>
      </div>

      {/* Right Column: Reset / Forgot Password Form */}
      <div className="lg:col-span-6 flex items-center justify-center p-6 sm:p-12 relative">
        <div className="w-full max-w-md space-y-8">
          {/* Header */}
          <div className="text-center lg:text-left space-y-1">
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              {resetSuccess
                ? "Password Updated!"
                : requestSuccess
                ? "Check your inbox"
                : isResetMode
                ? "Create new password"
                : "Forgot password?"}
            </h2>
            <p className="text-slate-500 text-xs font-normal">
              {resetSuccess
                ? "Your credentials have been securely updated"
                : requestSuccess
                ? "Follow the link sent to your work email"
                : isResetMode
                ? "Set a new, secure password for your VyaparFlow account"
                : "Enter your registered email address to receive a secure reset link"}
            </p>
          </div>

          {/* Form / State Container */}
          <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm space-y-6">
            {/* Error Banner */}
            {error && (
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <div className="flex-1 space-y-2">
                  <span>{error}</span>
                  {isResetMode && (
                    <div>
                      <button
                        type="button"
                        onClick={resetToRequestMode}
                        className="inline-flex items-center gap-1.5 text-xs font-extrabold text-rose-900 underline hover:no-underline"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Request a fresh reset link</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* STATE 1: Reset Success */}
            {resetSuccess ? (
              <div className="text-center space-y-5 py-2">
                <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center mx-auto text-emerald-600 shadow-sm">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-base font-extrabold text-slate-900">
                    Password Reset Complete
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed max-w-sm mx-auto">
                    Your password has been changed successfully. You can now use your new password to sign into your VyaparFlow dashboard.
                  </p>
                </div>
                <div className="pt-2">
                  <Link
                    href="/sign-in"
                    className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold py-3.5 rounded-xl transition-all shadow-md shadow-emerald-600/20 active:scale-95 text-xs"
                  >
                    <span>Sign In to Dashboard</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ) : requestSuccess ? (
              /* STATE 2: Request Sent Success */
              <div className="text-center space-y-5 py-2">
                <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center mx-auto text-emerald-600 shadow-sm">
                  <Mail className="w-7 h-7" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-base font-extrabold text-slate-900">
                    Reset Link Dispatched
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    If an account is associated with{" "}
                    <strong className="text-slate-900 font-semibold">{email}</strong>, you will receive password reset instructions shortly.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-left text-xs text-slate-600 space-y-1.5">
                  <div className="flex items-center gap-2 font-bold text-slate-800">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Important details:</span>
                  </div>
                  <ul className="list-disc list-inside space-y-1 text-[11px] text-slate-500 pl-1">
                    <li>The reset link will expire in <strong>60 minutes</strong>.</li>
                    <li>Check your spam or junk folder if it doesn&apos;t arrive in 2 minutes.</li>
                  </ul>
                </div>

                <div className="space-y-2.5 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setRequestSuccess(false);
                      setError("");
                    }}
                    className="w-full flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 rounded-xl transition-colors text-xs"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Didn&apos;t receive it? Try another email</span>
                  </button>

                  <Link
                    href="/sign-in"
                    className="w-full inline-flex items-center justify-center gap-2 text-xs font-bold text-emerald-700 hover:text-emerald-800 transition-colors py-2"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back to Sign In</span>
                  </Link>
                </div>
              </div>
            ) : isResetMode ? (
              /* STATE 3: Set New Password Form */
              <form className="space-y-5" onSubmit={handleResetPassword}>
                <div className="space-y-1.5">
                  <label htmlFor="newPassword" className="text-xs font-bold text-slate-700">
                    New Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      id="newPassword"
                      name="newPassword"
                      type={showPassword ? "text" : "password"}
                      required
                      autoComplete="new-password"
                      className="block w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-10 text-xs text-slate-900 placeholder:text-slate-400 focus:border-emerald-600 focus:bg-white outline-none transition-colors"
                      placeholder="At least 8 characters"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="confirmPassword" className="text-xs font-bold text-slate-700">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      required
                      autoComplete="new-password"
                      className="block w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-10 text-xs text-slate-900 placeholder:text-slate-400 focus:border-emerald-600 focus:bg-white outline-none transition-colors"
                      placeholder="Re-enter your new password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Validation Checklist */}
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1.5">
                  <div className="flex items-center gap-2 text-[11px] font-semibold">
                    <CheckCircle2
                      className={`w-3.5 h-3.5 transition-colors ${
                        isLengthValid ? "text-emerald-600" : "text-slate-300"
                      }`}
                    />
                    <span className={isLengthValid ? "text-emerald-700" : "text-slate-500"}>
                      At least 8 characters
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] font-semibold">
                    <CheckCircle2
                      className={`w-3.5 h-3.5 transition-colors ${
                        isMatch ? "text-emerald-600" : "text-slate-300"
                      }`}
                    />
                    <span className={isMatch ? "text-emerald-700" : "text-slate-500"}>
                      Passwords match
                    </span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading || !isLengthValid || !isMatch}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold py-3.5 rounded-xl transition-all shadow-md shadow-emerald-600/20 active:scale-95 disabled:opacity-60 disabled:hover:scale-100 text-xs"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Saving new password...</span>
                    </>
                  ) : (
                    <>
                      <span>Update Password</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                <div className="pt-2 text-center">
                  <button
                    type="button"
                    onClick={resetToRequestMode}
                    className="text-xs font-bold text-slate-500 hover:text-slate-700 inline-flex items-center gap-1.5 transition-colors"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back to request reset link</span>
                  </button>
                </div>
              </form>
            ) : (
              /* STATE 4: Request Reset Link Form */
              <form className="space-y-5" onSubmit={handleRequestReset}>
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

                <button
                  type="submit"
                  disabled={loading || !email}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold py-3.5 rounded-xl transition-all shadow-md shadow-emerald-600/20 active:scale-95 disabled:opacity-70 disabled:hover:scale-100 text-xs"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Sending reset link...</span>
                    </>
                  ) : (
                    <>
                      <span>Send Password Reset Link</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                <div className="pt-4 border-t border-slate-100 text-center text-xs text-slate-500">
                  Remember your password?{" "}
                  <Link
                    href="/sign-in"
                    className="font-extrabold text-emerald-700 hover:text-emerald-800 transition-colors inline-flex items-center gap-1"
                  >
                    <span>Sign In</span>
                  </Link>
                </div>
              </form>
            )}
          </div>

          {/* Quick link back */}
          {!requestSuccess && !resetSuccess && (
            <div className="text-center">
              <Link
                href="/sign-in"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Return to login page</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ResetPasswordFallback() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="flex items-center gap-3 text-slate-500 text-xs font-bold">
        <Loader2 className="w-5 h-5 text-emerald-600 animate-spin" />
        <span>Loading recovery options...</span>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<ResetPasswordFallback />}>
      <ResetPasswordForm />
    </Suspense>
  );
}
