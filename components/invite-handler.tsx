"use client";

import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export function InviteHandler() {
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const checkInvite = async () => {
      const token = Cookies.get("invite_token");
      if (!token) return;

      try {
        setIsProcessing(true);
        // Attempt to accept invite
        const res = await fetch("/api/team/accept-invite", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });

        if (res.ok) {
          // Success! Clear cookie and refresh/redirect
          Cookies.remove("invite_token");
          router.push("/dashboard");
          router.refresh();
        } else {
          // Identify error? Maybe invalid token?
          const data = await res.json();
          if (data.error === "Invalid or expired invitation") {
            Cookies.remove("invite_token");
          }
          console.error("Failed to accept invite", data);
        }
      } catch (error) {
        console.error("Error processing invite", error);
      } finally {
        setIsProcessing(false);
      }
    };

    checkInvite();
  }, [router]);

  if (isProcessing) {
    return (
      <div className="fixed bottom-4 right-4 bg-white p-4 rounded-lg shadow-lg border border-gray-100 flex items-center gap-3 animate-in slide-in-from-bottom-2 z-50">
        <Loader2 className="w-4 h-4 animate-spin text-emerald-600" />
        <span className="text-sm font-medium text-gray-700">
          Joining company...
        </span>
      </div>
    );
  }

  return null;
}
