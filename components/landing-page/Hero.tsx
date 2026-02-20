import Link from "next/link";

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-24 pb-24 lg:pt-32 lg:pb-32 bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none opacity-40">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-200 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-teal-200 rounded-full blur-[100px]" />
      </div>

      <div className="container mx-auto px-8 lg:px-16 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column */}
          <div className="space-y-8">
            <div className="space-y-6">
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight tracking-tight">
                Digitize Your Vendor & Procurement Operations
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                From purchase requests to payments — manage everything in one
                structured platform. Built for Indian MSMEs who want control,
                not chaos.
              </p>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/sign-up"
                className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-lg font-semibold rounded-xl hover:from-emerald-700 hover:to-teal-700 shadow-lg shadow-emerald-600/30 hover:shadow-xl hover:-translate-y-1 transition-all duration-200"
              >
                Start Free
              </Link>
              <Link
                href="mailto:demo@vyaparflow.in"
                className="inline-flex items-center justify-center px-8 py-4 bg-white text-gray-900 text-lg font-semibold rounded-xl border-2 border-gray-300 hover:border-emerald-300 hover:bg-emerald-50 transition-all duration-200"
              >
                Book Demo
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap gap-6 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span>GST Ready</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span>Secure Payments</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span>Built for MSMEs</span>
              </div>
            </div>
          </div>

          {/* Right Column - Dashboard Mockup */}
          <div className="relative hidden lg:block">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-600 to-teal-700 rounded-2xl transform rotate-1 scale-95 opacity-10"></div>
            <div className="relative bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-6 shadow-2xl border border-gray-200">
              {/* Dashboard Mockup */}
              <div className="space-y-4">
                <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
                  <div className="flex items-center justify-between mb-3">
                    <div className="h-3 w-24 bg-gray-200 rounded"></div>
                    <div className="flex gap-2">
                      <div className="h-2 w-2 rounded-full bg-emerald-500"></div>
                      <div className="h-2 w-2 rounded-full bg-amber-500"></div>
                      <div className="h-2 w-2 rounded-full bg-red-500"></div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-2 w-full bg-gray-100 rounded"></div>
                    <div className="h-2 w-4/5 bg-gray-100 rounded"></div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-200">
                    <div className="h-2 w-16 bg-emerald-600 rounded mb-2"></div>
                    <div className="h-2 w-20 bg-gray-200 rounded"></div>
                  </div>
                  <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-200">
                    <div className="h-2 w-16 bg-teal-600 rounded mb-2"></div>
                    <div className="h-2 w-20 bg-gray-200 rounded"></div>
                  </div>
                </div>

                <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
                  <div className="h-24 bg-gradient-to-r from-emerald-200 to-teal-200 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
