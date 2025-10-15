import Link from "next/link";
import Hero from "@/components/Hero";

export default function Home() {
  return (
    <div className="bg-white">
      <Hero />

      {/* Value Proposition Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              Why Choose Our Referral Network?
            </h2>
            <p className="mt-4 text-xl text-gray-600">
              Attorney-led ethics with data-driven precision
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Licensed & Compliant
              </h3>
              <p className="text-gray-600">
                Operated by licensed attorneys in full compliance with Texas Bar Rule 1.04(f). 
                Every referral maintains the highest ethical standards and client consent protocols.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Rapid Case Matching
              </h3>
              <p className="text-gray-600">
                AI-assisted case evaluation and intelligent routing to qualified partner firms. 
                Get connected to the right attorney for your case type and severity quickly.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Quality-Driven Network
              </h3>
              <p className="text-gray-600">
                Our partner firms are vetted for experience, settlement records, and capacity. 
                Every referral is tracked with keeper-grade analytics for accountability.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Case Types Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              Case Types We Handle
            </h2>
            <p className="mt-4 text-xl text-gray-600">
              Specialized matching for various personal injury cases
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: "Auto Accidents", icon: "🚗" },
              { name: "Truck Accidents", icon: "🚚" },
              { name: "Catastrophic Injury", icon: "🏥" },
              { name: "Workplace Injury", icon: "⚠️" },
            ].map((caseType) => (
              <div key={caseType.name} className="bg-gray-50 p-6 rounded-lg text-center hover:shadow-md transition-shadow">
                <div className="text-4xl mb-3">{caseType.icon}</div>
                <h3 className="font-semibold text-gray-900">{caseType.name}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white sm:text-4xl mb-4">
            Ready to Connect With the Right Attorney?
          </h2>
          <p className="text-xl text-primary-100 mb-8">
            Submit your case information and we&apos;ll match you with a qualified legal partner 
            who can provide the representation you deserve.
          </p>
          <Link
            href="/intake"
            className="inline-flex items-center px-8 py-4 border border-transparent text-lg font-medium rounded-md text-primary-700 bg-white hover:bg-gray-50 transition-colors"
          >
            Submit Your Case Now
            <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </section>
    </div>
  );
}

