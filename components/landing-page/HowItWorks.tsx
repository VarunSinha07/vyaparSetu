export function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="py-24 bg-gray-900 text-white relative overflow-hidden"
    >
      {/* Background Gradients */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-20">
        <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] bg-blue-600 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[60%] h-[60%] bg-indigo-600 rounded-full blur-[120px]" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-20">
          <h2 className="text-4xl font-extrabold mb-4 tracking-tight">
            How It Works
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            A simple, linear process designed to move work forward without
            friction.
          </p>
        </div>

        <div className="relative max-w-6xl mx-auto">
          {/* Connector Line (Desktop) */}
          <div className="hidden lg:block absolute top-[2.5rem] left-0 w-full h-0.5 bg-gray-800 z-0">
            <div
              className="absolute top-0 left-0 h-full w-1/3 bg-gradient-to-r from-transparent via-blue-500 to-transparent animate-shimmer"
              style={{ backgroundSize: "200% 100%" }}
            ></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-8 relative z-10">
            {[
              { title: "Add Vendors", icon: "🏢" },
              { title: "Raise PR", icon: "📝" },
              { title: "Approvals", icon: "👍" },
              { title: "Generate PO", icon: "📄" },
              { title: "Verify Invoice", icon: "🔎" },
              { title: "Pay Vendors", icon: "💸" },
              { title: "Track", icon: "📊" },
            ].map((step, i) => (
              <div
                key={i}
                className="flex flex-col items-center text-center group cursor-default"
              >
                <div className="w-20 h-20 rounded-2xl bg-gray-800 border border-gray-700 flex items-center justify-center text-3xl mb-6 shadow-xl relative transition-all duration-300 group-hover:-translate-y-2 group-hover:border-blue-500 group-hover:shadow-blue-900/50 z-10">
                  <div className="absolute inset-x-0 -bottom-2 h-2 bg-transparent group-hover:bg-blue-500/50 blur-md transition-all duration-300" />
                  {step.icon}

                  {/* Step Number Badge */}
                  <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-gray-900 border-2 border-gray-700 text-xs font-bold flex items-center justify-center text-gray-400 group-hover:border-blue-500 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                    {i + 1}
                  </div>
                </div>
                <h3 className="text-lg font-bold text-gray-200 group-hover:text-white transition-colors">
                  {step.title}
                </h3>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
