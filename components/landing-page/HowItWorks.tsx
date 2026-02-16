import { ArrowRight } from "lucide-react";

export function HowItWorks() {
  const steps = [
    {
      number: "1",
      title: "Request",
      icon: "📝",
      desc: "Raise purchase request",
    },
    { number: "2", title: "Approve", icon: "✅", desc: "Manager approval" },
    { number: "3", title: "Order", icon: "📄", desc: "Issue purchase order" },
    {
      number: "4",
      title: "Invoice",
      icon: "🔍",
      desc: "Upload & verify invoice",
    },
    { number: "5", title: "Pay", icon: "💳", desc: "Pay vendor securely" },
  ];

  return (
    <section id="how-it-works" className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            How VyaparFlow Works
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            A simple process designed to replace WhatsApp chaos with structured
            workflows.
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          {/* Desktop View */}
          <div className="hidden lg:grid grid-cols-5 gap-4 mb-8">
            {steps.map((step, i) => (
              <div key={i} className="relative">
                {/* Card */}
                <div className="bg-gradient-to-br from-indigo-50 to-emerald-50 rounded-xl p-6 border border-indigo-200 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 h-full flex flex-col items-center text-center group cursor-default min-h-[250px]">
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold text-sm shadow-lg">
                    {step.number}
                  </div>

                  <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">
                    {step.icon}
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 group-hover:text-indigo-600 transition-colors mb-2">
                    {step.title}
                  </h3>
                  <p className="text-sm text-gray-600 group-hover:text-gray-700">
                    {step.desc}
                  </p>
                </div>

                {/* Arrow between cards */}
                {i < steps.length - 1 && (
                  <div className="absolute top-1/2 -right-6 transform -translate-y-1/2 text-indigo-300">
                    <ArrowRight className="w-6 h-6" />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Mobile View */}
          <div className="lg:hidden space-y-4">
            {steps.map((step, i) => (
              <div key={i} className="flex gap-4 items-start">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold shadow-lg">
                    {step.number}
                  </div>
                </div>
                <div className="flex-1">
                  <div className="bg-gradient-to-r from-indigo-50 to-emerald-50 rounded-lg p-4 border border-indigo-200">
                    <h3 className="text-lg font-bold text-gray-900 mb-1">
                      {step.icon} {step.title}
                    </h3>
                    <p className="text-gray-600">{step.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
