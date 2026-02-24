import { Navbar } from "@/components/landing-page/Navbar";
import { Footer } from "@/components/landing-page/Footer";
import { CTA } from "@/components/landing-page/CTA";
import {
  Users,
  ShieldCheck,
  FileCheck,
  CreditCard,
  CheckCircle,
  UserCog,
  ShoppingCart,
  Gavel,
  BadgeCheck,
} from "lucide-react";

export default function HowItWorksPage() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50 font-sans selection:bg-emerald-500/30 selection:text-emerald-900">
      <Navbar />
      <main className="flex-grow pt-20">
        {/* Section 1: Hero & Intro (Dark Theme like Features Page) */}
        <section className="relative py-24 lg:py-32 overflow-hidden bg-emerald-950">
          {/* Background Effects */}
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-soft-light" />
          <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-br from-emerald-500/20 to-teal-500/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-teal-900/40 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2" />

          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto text-center space-y-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-900/50 border border-emerald-500/30 text-emerald-300 text-sm font-medium backdrop-blur-md">
                <Users className="w-4 h-4" />
                <span>Role-Based Workflow Control</span>
              </div>

              <h1 className="text-5xl lg:text-7xl font-bold tracking-tight text-white">
                Built for Teams with <br className="hidden md:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-200">
                  Clear Responsibilities
                </span>
              </h1>

              <p className="text-xl text-emerald-100/70 max-w-2xl mx-auto leading-relaxed">
                VyaparFlow assigns responsibilities through role-based access
                control (RBAC), ensuring each team member interacts only with
                the actions relevant to their function—simplifying execution and
                boosting security.
              </p>
            </div>
          </div>
        </section>

        {/* Section 2: Role Cards (Styled like Features Grid - Light/Slate Theme) */}
        <section className="py-24 relative bg-[#F8FAFC]">
          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center mb-16 max-w-3xl mx-auto">
              <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
                Defined Roles for Every Function
              </h2>
              <p className="text-lg text-slate-600">
                Four distinct roles work together in harmony. Each role has a
                purpose-built interface.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Card 1: Admin */}
              <div className="group bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl hover:shadow-emerald-900/5 border border-slate-200 hover:border-emerald-500/30 transition-all duration-300 hover:-translate-y-1 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-tr from-emerald-50/0 via-emerald-50/0 to-purple-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="relative z-10">
                  <div className="w-14 h-14 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-purple-600 group-hover:text-white transition-all duration-300">
                    <UserCog className="w-7 h-7 text-purple-600 group-hover:text-white transition-colors" />
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 mb-1 group-hover:text-purple-700 transition-colors">
                    Admin
                  </h3>
                  <p className="text-xs font-bold text-purple-600 tracking-wider uppercase mb-6">
                    Oversight & Control
                  </p>

                  <ul className="space-y-3 pt-6 border-t border-slate-100">
                    {[
                      "Manage company workspace",
                      "Add/Remove team members",
                      "Approve high-value POs",
                      "Issue purchase orders",
                      "Full system audit logs",
                    ].map((item, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-3 text-sm text-slate-600 font-medium"
                      >
                        <div className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-1.5 shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Card 2: Procurement Officer */}
              <div className="group bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl hover:shadow-emerald-900/5 border border-slate-200 hover:border-emerald-500/30 transition-all duration-300 hover:-translate-y-1 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-tr from-emerald-50/0 via-emerald-50/0 to-blue-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="relative z-10">
                  <div className="w-14 h-14 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                    <ShoppingCart className="w-7 h-7 text-blue-600 group-hover:text-white transition-colors" />
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 mb-1 group-hover:text-blue-700 transition-colors">
                    Procurement
                  </h3>
                  <p className="text-xs font-bold text-blue-600 tracking-wider uppercase mb-6">
                    Execution & Vendors
                  </p>

                  <ul className="space-y-3 pt-6 border-t border-slate-100">
                    {[
                      "Onboard new vendors",
                      "Create purchase requests",
                      "Draft Purchase Orders",
                      "Negotiate pricing",
                      "Track delivery status",
                    ].map((item, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-3 text-sm text-slate-600 font-medium"
                      >
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Card 3: Manager */}
              <div className="group bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl hover:shadow-emerald-900/5 border border-slate-200 hover:border-emerald-500/30 transition-all duration-300 hover:-translate-y-1 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-tr from-emerald-50/0 via-emerald-50/0 to-amber-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="relative z-10">
                  <div className="w-14 h-14 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-amber-600 group-hover:text-white transition-all duration-300">
                    <Gavel className="w-7 h-7 text-amber-600 group-hover:text-white transition-colors" />
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 mb-1 group-hover:text-amber-700 transition-colors">
                    Manager
                  </h3>
                  <p className="text-xs font-bold text-amber-600 tracking-wider uppercase mb-6">
                    Budget & Approval
                  </p>

                  <ul className="space-y-3 pt-6 border-t border-slate-100">
                    {[
                      "Review team requests",
                      "Approve or Reject items",
                      "Check budget alignment",
                      "Add approval comments",
                      "Monitor team spending",
                    ].map((item, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-3 text-sm text-slate-600 font-medium"
                      >
                        <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Card 4: Finance */}
              <div className="group bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl hover:shadow-emerald-900/5 border border-slate-200 hover:border-emerald-500/30 transition-all duration-300 hover:-translate-y-1 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-tr from-emerald-50/0 via-emerald-50/0 to-emerald-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="relative z-10">
                  <div className="w-14 h-14 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300">
                    <CreditCard className="w-7 h-7 text-emerald-600 group-hover:text-white transition-colors" />
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 mb-1 group-hover:text-emerald-700 transition-colors">
                    Finance
                  </h3>
                  <p className="text-xs font-bold text-emerald-600 tracking-wider uppercase mb-6">
                    Payouts & Reporting
                  </p>

                  <ul className="space-y-3 pt-6 border-t border-slate-100">
                    {[
                      "Verify vendor invoices",
                      "Process payments",
                      "Record transaction IDs",
                      "Reconcile accounts",
                      "Financial reporting",
                    ].map((item, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-3 text-sm text-slate-600 font-medium"
                      >
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: Workflow Visualization (Clean & Modern) */}
        <section className="py-24 bg-white border-y border-slate-100">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16 max-w-3xl mx-auto">
              <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
                How It Flows
              </h2>
              <p className="text-lg text-slate-600">
                From request to payment, every step is tracked and assigned to
                the right person automatically.
              </p>
            </div>

            <div className="max-w-5xl mx-auto">
              <div className="relative">
                {/* Connecting Line (Desktop) */}
                <div className="hidden md:block absolute top-[40px] left-0 w-full h-[2px] bg-slate-100 -z-10 rounded-full"></div>

                <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
                  {/* Step 1 */}
                  <div className="flex flex-col items-center text-center group">
                    <div className="w-20 h-20 bg-white rounded-2xl border border-slate-200 flex items-center justify-center shadow-sm mb-6 group-hover:border-blue-500 group-hover:shadow-md transition-all duration-300 z-10">
                      <FileCheck className="w-8 h-8 text-blue-600" />
                    </div>
                    <h3 className="font-bold text-lg text-slate-900">
                      Request
                    </h3>
                    <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                      Team creates purchase request
                    </p>
                  </div>

                  {/* Step 2 */}
                  <div className="flex flex-col items-center text-center group">
                    <div className="w-20 h-20 bg-white rounded-2xl border border-slate-200 flex items-center justify-center shadow-sm mb-6 group-hover:border-amber-500 group-hover:shadow-md transition-all duration-300 z-10">
                      <BadgeCheck className="w-8 h-8 text-amber-600" />
                    </div>
                    <h3 className="font-bold text-lg text-slate-900">
                      Approval
                    </h3>
                    <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                      Manager reviews & approves
                    </p>
                  </div>

                  {/* Step 3 */}
                  <div className="flex flex-col items-center text-center group">
                    <div className="w-20 h-20 bg-white rounded-2xl border border-slate-200 flex items-center justify-center shadow-sm mb-6 group-hover:border-purple-500 group-hover:shadow-md transition-all duration-300 z-10">
                      <ShoppingCart className="w-8 h-8 text-purple-600" />
                    </div>
                    <h3 className="font-bold text-lg text-slate-900">Order</h3>
                    <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                      Admin issues Purchase Order
                    </p>
                  </div>

                  {/* Step 4 */}
                  <div className="flex flex-col items-center text-center group">
                    <div className="w-20 h-20 bg-white rounded-2xl border border-slate-200 flex items-center justify-center shadow-sm mb-6 group-hover:border-emerald-500 group-hover:shadow-md transition-all duration-300 z-10">
                      <FileCheck className="w-8 h-8 text-emerald-600" />
                    </div>
                    <h3 className="font-bold text-lg text-slate-900">
                      Invoice
                    </h3>
                    <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                      Vendor invoice verified
                    </p>
                  </div>

                  {/* Step 5 */}
                  <div className="flex flex-col items-center text-center group">
                    <div className="w-20 h-20 bg-white rounded-2xl border border-slate-200 flex items-center justify-center shadow-sm mb-6 group-hover:border-teal-500 group-hover:shadow-md transition-all duration-300 z-10">
                      <CreditCard className="w-8 h-8 text-teal-600" />
                    </div>
                    <h3 className="font-bold text-lg text-slate-900">
                      Payment
                    </h3>
                    <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                      Finance processes payment
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 4: Capabilities Matrix (Matching Clean Style) */}
        <section className="py-24 bg-[#F8FAFC]">
          <div className="container mx-auto px-6 max-w-5xl">
            <div className="text-center mb-16 max-w-3xl mx-auto">
              <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
                Who Can Do What?
              </h2>
              <p className="text-lg text-slate-600">
                A clear breakdown of capabilities across roles.
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200">
                      <th className="px-6 py-6 font-bold text-slate-900 text-lg w-1/4">
                        Action
                      </th>
                      <th className="px-6 py-6 font-bold text-slate-900 text-center w-1/6 text-lg">
                        Admin
                      </th>
                      <th className="px-6 py-6 font-bold text-slate-900 text-center w-1/6 text-lg">
                        Procurement
                      </th>
                      <th className="px-6 py-6 font-bold text-slate-900 text-center w-1/6 text-lg">
                        Manager
                      </th>
                      <th className="px-6 py-6 font-bold text-slate-900 text-center w-1/6 text-lg">
                        Finance
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {[
                      {
                        action: "Add vendors",
                        roles: [true, true, false, false],
                      },
                      { action: "Raise PR", roles: [true, true, false, false] },
                      {
                        action: "Approve PR",
                        roles: [true, false, true, false],
                      },
                      {
                        action: "Issue PO",
                        roles: [true, false, false, false],
                      },
                      {
                        action: "Verify invoice",
                        roles: [true, false, false, true],
                      },
                      {
                        action: "Pay vendor",
                        roles: [true, false, false, true],
                      },
                    ].map((row, idx) => (
                      <tr
                        key={idx}
                        className="group hover:bg-slate-50/50 transition-colors"
                      >
                        <td className="px-6 py-5 font-medium text-slate-700 group-hover:text-slate-900 transition-colors">
                          {row.action}
                        </td>
                        {row.roles.map((hasAccess, rIdx) => (
                          <td key={rIdx} className="px-6 py-5 text-center">
                            {hasAccess ? (
                              <CheckCircle className="w-6 h-6 text-emerald-500 mx-auto" />
                            ) : (
                              <span className="text-slate-300 block">—</span>
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        {/* Section 5: Trust Statement Theme */}
        <section className="py-24 bg-emerald-950 text-center relative overflow-hidden">
          {/* Background Effects */}
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-soft-light" />
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-600/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-teal-600/20 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2" />

          <div className="container mx-auto px-6 max-w-3xl relative z-10">
            <div className="w-16 h-16 bg-emerald-900/50 border border-emerald-500/30 rounded-2xl flex items-center justify-center mx-auto mb-8 backdrop-blur-sm">
              <ShieldCheck className="w-8 h-8 text-emerald-400" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Secure & Accountable by Design
            </h2>
            <p className="text-emerald-100/70 text-lg leading-relaxed mb-8">
              Role-based access ensures secure operations, prevents unauthorized
              actions, and maintains accountability across procurement
              workflows.
            </p>
          </div>
        </section>

        {/* Reusing the Global CTA */}
        <CTA />
      </main>

      <Footer />
    </div>
  );
}
