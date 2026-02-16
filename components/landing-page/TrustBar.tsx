import { ReceiptIndianRupee, Lock } from "lucide-react";

export function TrustBar() {
  return (
    <section className="bg-white border-y-2 border-gray-200">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
          {/* Built for Indian MSMEs */}
          <div className="bg-gradient-to-br from-indigo-50 to-indigo-100/50 rounded-xl p-6 border-2 border-indigo-100 hover:border-indigo-300 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group">
            <div className="text-center">
              <div className="text-4xl mb-2">🪷</div>
              <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">
                Built for Indian MSMEs
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Understanding your unique compliance needs and business context
              </p>
            </div>
          </div>

          {/* GST Ready */}
          <div className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 rounded-xl p-6 border-2 border-emerald-100 hover:border-emerald-300 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group">
            <div className="text-center">
              <div className="inline-flex items-center justify-center gap-2 mb-3">
                <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center group-hover:bg-emerald-200 transition-colors">
                  <ReceiptIndianRupee className="w-5 h-5 text-emerald-600" />
                </div>
               
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-emerald-600 transition-colors">
                GST Compliant
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Full compliance with Indian tax regulations and standards
              </p>
            </div>
          </div>

          {/* Secure Payments */}
          <div className="bg-gradient-to-br from-amber-50 to-amber-100/50 rounded-xl p-6 border-2 border-amber-100 hover:border-amber-300 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-amber-100 rounded-lg mb-3 group-hover:bg-amber-200 transition-colors">
                <Lock className="w-5 h-5 text-amber-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-amber-600 transition-colors">
                Secure Payments
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Bank-grade encryption powered by Razorpay
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
