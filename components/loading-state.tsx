import { Building2 } from "lucide-react";

interface LoadingStateProps {
  text?: string;
  className?: string;
}

export function LoadingState({
  text = "Loading dashboard...",
  className = "",
}: LoadingStateProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center h-full w-full bg-slate-50/50 backdrop-blur-sm animate-in fade-in zoom-in-95 duration-500 rounded-3xl min-h-[500px] ${className}`}
    >
      <div className="relative mb-8 group">
        {/* Background glow */}
        <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/20 to-teal-500/20 rounded-full blur-2xl animate-pulse group-hover:blur-3xl transition-all duration-700" />

        {/* Main Spinner Container */}
        <div className="relative w-24 h-24 flex items-center justify-center">
          {/* Outer Static Ring */}
          <div className="absolute inset-0 rounded-full border-4 border-emerald-100/50" />

          {/* Spinning Gradient Ring */}
          <div className="absolute inset-0 rounded-full border-4 border-t-emerald-500 border-r-teal-500 border-b-emerald-600 border-l-transparent animate-[spin_1.5s_linear_infinite] shadow-lg shadow-emerald-500/10" />

          {/* Inner White Circle & Icon */}
          <div className="bg-white rounded-full p-4 shadow-xl shadow-emerald-900/5 ring-1 ring-emerald-50 z-10 relative">
            <Building2 className="w-8 h-8 text-transparent bg-clip-text bg-gradient-to-br from-emerald-600 to-teal-700 animate-pulse" />
          </div>
        </div>
      </div>

      {/* Text Content */}
      <div className="flex flex-col items-center space-y-4">
        <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 tracking-tight animate-pulse">
          {text}
        </h3>

        <p className="text-sm text-gray-500 font-medium tracking-wide">
          Please wait...
        </p>

        {/* Animated Dots */}
        <div className="flex items-center gap-1.5 pt-2">
          <div className="w-2 h-2 bg-emerald-400 rounded-full animate-[bounce_1s_infinite_0ms]" />
          <div className="w-2 h-2 bg-teal-500 rounded-full animate-[bounce_1s_infinite_200ms]" />
          <div className="w-2 h-2 bg-emerald-600 rounded-full animate-[bounce_1s_infinite_400ms]" />
        </div>
      </div>
    </div>
  );
}
