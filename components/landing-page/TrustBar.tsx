import { ShieldCheck, IndianRupee, Landmark } from "lucide-react";

export function TrustBar() {
  return (
    <section className="py-10 bg-emerald-950/5 border-y border-emerald-950/5">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-center items-center gap-8 md:gap-16 lg:gap-24 opacity-80 hover:opacity-100 transition-opacity">
          {/* Item 1 */}
          <div className="flex items-center gap-4 group">
            <div className="p-3 bg-emerald-100 rounded-full group-hover:bg-emerald-200 transition-colors">
              <IndianRupee className="w-6 h-6 text-emerald-700" />
            </div>
            <div>
              <h4 className="font-bold text-emerald-950">Built for India</h4>
              <p className="text-sm text-emerald-800/70">
                GST Compliant & Ready
              </p>
            </div>
          </div>

          {/* Separator (Hidden on mobile) */}
          <div className="hidden md:block w-px h-12 bg-emerald-950/10" />

          {/* Item 2 */}
          <div className="flex items-center gap-4 group">
            <div className="p-3 bg-teal-100 rounded-full group-hover:bg-teal-200 transition-colors">
              <ShieldCheck className="w-6 h-6 text-teal-700" />
            </div>
            <div>
              <h4 className="font-bold text-emerald-950">Secure & Safe</h4>
              <p className="text-sm text-emerald-800/70">
                Bank-Grade Encryption
              </p>
            </div>
          </div>

          {/* Separator (Hidden on mobile) */}
          <div className="hidden md:block w-px h-12 bg-emerald-950/10" />

          {/* Item 3 */}
          <div className="flex items-center gap-4 group">
            <div className="p-3 bg-green-100 rounded-full group-hover:bg-green-200 transition-colors">
              <Landmark className="w-6 h-6 text-green-700" />
            </div>
            <div>
              <h4 className="font-bold text-emerald-950">MSME Focused</h4>
              <p className="text-sm text-emerald-800/70">Tailored for Growth</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
