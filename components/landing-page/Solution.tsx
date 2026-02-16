export function Solution() {
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl font-extrabold text-gray-900 mb-6">
            One Platform. Complete Control.
          </h2>
          <p className="text-lg text-gray-600 leading-relaxed">
            From onboarding vendors to final payments, VyaparFlow centralizes
            every step of your procurement lifecycle.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {[
            {
              title: "Vendor Management",
              desc: "Centralized registry with compliance tracking & documents.",
              emoji: "📋",
            },
            {
              title: "Smart Approvals",
              desc: "Multi-level workflows that move fast and enforce policy.",
              emoji: "✅",
            },
            {
              title: "Auto PO Generation",
              desc: "Create professional POs from requests in one click.",
              emoji: "⚡",
            },
            {
              title: "Invoice Verification",
              desc: "3-way matching to prevent overpayment and errors.",
              emoji: "🔍",
            },
            {
              title: "Secure Payments",
              desc: "Direct bank transfers via Razorpay Integration.",
              emoji: "💳",
            },
            {
              title: "Audit Trails",
              desc: "Every action logged for complete transparency.",
              emoji: "🛡️",
            },
          ].map((feature, i) => (
            <div
              key={i}
              className="group relative p-8 rounded-xl bg-white border border-gray-200 hover:border-indigo-200 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-indigo-500 to-emerald-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-indigo-50 rounded-lg flex items-center justify-center text-2xl group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300 shadow-sm">
                  {feature.emoji}
                </div>
              </div>

              <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">
                {feature.title}
              </h3>
              <p className="text-gray-600 group-hover:text-gray-700 leading-relaxed">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
