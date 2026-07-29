import { Navbar } from "@/components/landing-page/Navbar";
import { Footer } from "@/components/landing-page/Footer";
import { CTA } from "@/components/landing-page/CTA";
import {
  UserCog,
  ShoppingCart,
  Gavel,
  BadgeCheck,
  CheckCircle2,
} from "lucide-react";

export default function HowItWorksPage() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50/50 text-slate-900 font-sans selection:bg-emerald-500/20 selection:text-emerald-900">
      <Navbar />

      <main className="flex-1 pt-28 pb-20">
        {/* Hero Section */}
        <section className="relative py-16 text-center overflow-hidden">
          <div className="container mx-auto px-6 lg:px-12 relative z-10 space-y-4 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-slate-200 shadow-2xs text-slate-800 text-xs font-semibold">
              <span>Role-Based Governance</span>
            </div>

            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900">
              Clear Roles for Every Team Member
            </h1>

            <p className="text-slate-600 text-base">
              VyaparFlow enforces role-based permissions (RBAC) so each persona interacts only with the actions authorized for their function.
            </p>
          </div>
        </section>

        {/* Role Cards Grid */}
        <section className="py-8 relative">
          <div className="container mx-auto px-6 lg:px-12 relative z-10 max-w-6xl">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  role: "Admin",
                  desc: "Company Oversight & Controls",
                  icon: UserCog,
                  duties: [
                    "Company workspace setup",
                    "User invitations & RBAC roles",
                    "High-value PO sign-offs",
                    "Complete audit logs access",
                  ],
                },
                {
                  role: "Procurement",
                  desc: "Vendor & PO Fulfillment",
                  icon: ShoppingCart,
                  duties: [
                    "Vendor onboarding & GST check",
                    "Issue POs from approved PRs",
                    "Goods Receipt (GRN) logging",
                    "Delivery status tracking",
                  ],
                },
                {
                  role: "Manager",
                  desc: "Departmental Approvals",
                  icon: Gavel,
                  duties: [
                    "Department budget tracking",
                    "1-tap request approvals",
                    "CAPEX/OPEX validation",
                    "Rejection & revision notes",
                  ],
                },
                {
                  role: "Finance",
                  desc: "Audit & Payout Release",
                  icon: BadgeCheck,
                  duties: [
                    "3-way invoice matching",
                    "GST Input Tax Credit audit",
                    "Razorpay & UPI payouts",
                    "ERP ledger sync",
                  ],
                },
              ].map((card, idx) => {
                const Icon = card.icon;
                return (
                  <div
                    key={idx}
                    className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs flex flex-col justify-between"
                  >
                    <div className="space-y-4">
                      <div className="p-3 rounded-xl bg-slate-100 text-slate-900 w-fit">
                        <Icon className="w-5 h-5" />
                      </div>

                      <div>
                        <h3 className="text-lg font-bold text-slate-900">{card.role}</h3>
                        <p className="text-xs text-slate-500 mt-0.5">{card.desc}</p>
                      </div>

                      <div className="space-y-2 pt-3 border-t border-slate-100 text-xs">
                        {card.duties.map((d, dIdx) => (
                          <div key={dIdx} className="flex items-center gap-2 text-slate-700 font-medium">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            <span>{d}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <CTA />
      </main>

      <Footer />
    </div>
  );
}
