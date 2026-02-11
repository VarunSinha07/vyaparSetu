"use client";

import { useState } from "react";
import { Database, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function DemoSeeder({ role }: { role: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  if (role !== "ADMIN") return null;

  const handleSeed = async () => {
    if (
      !confirm(
        "Load sample data into your account? This will create dummy records.",
      )
    )
      return;

    setLoading(true);
    try {
      const res = await fetch("/api/admin/seed", { method: "POST" });
      if (!res.ok) throw new Error("Failed");

      toast.success("Demo data loaded successfully!");
      router.refresh();
      // Reload page to see new stats
      window.location.reload();
    } catch {
      toast.error("Failed to load demo data.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleSeed}
      disabled={loading}
      className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors border border-indigo-200"
    >
      {loading ? (
        <Loader2 className="w-3 h-3 animate-spin" />
      ) : (
        <Database className="w-3 h-3" />
      )}
      Load Demo Data
    </button>
  );
}
