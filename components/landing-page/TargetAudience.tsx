export function TargetAudience() {
  return (
    <section className="py-24 bg-gray-50 border-t border-gray-200">
      <div className="container mx-auto px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-10">
            Trusted by Modern Indian Businesses
          </h2>

          <div className="flex flex-wrap justify-center gap-4">
            {[
              "🏭 Manufacturing Units",
              "🏗️ Construction Firms",
              "🏥 Hospitals & Clinics",
              "🎓 Educational Institutes",
              "🤝 NGOs & Non-Profits",
              "💻 IT Services",
              "🚚 Logistics Companies",
            ].map((item, i) => (
              <span
                key={i}
                className="px-6 py-3 bg-white border border-gray-200 rounded-xl text-gray-700 font-semibold shadow-sm hover:shadow-md hover:border-blue-300 hover:text-blue-600 transition-all cursor-default select-none hover:-translate-y-1"
              >
                {item}
              </span>
            ))}
          </div>

          <div className="mt-12 p-6 bg-blue-50/50 rounded-2xl border border-blue-100 inline-block">
            <p className="text-lg font-medium text-gray-800">
              "If you buy goods or services,
              <span className="text-blue-600 font-bold"> VyaparFlow </span>
              is built for you."
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
