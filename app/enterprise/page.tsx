import { ArrowRight, ShieldCheck, Lock, Server, Globe } from "lucide-react";

export default function EnterprisePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-900 to-black px-6 py-24">
      <section className="mx-auto max-w-6xl rounded-3xl bg-white p-8 shadow-2xl md:p-14">
        <div className="grid items-center gap-12 md:grid-cols-2">
          
          {/* LEFT */}
          <div>
            <span className="rounded-full bg-indigo-100 px-4 py-2 text-sm font-semibold text-indigo-700">
              Enterprise
            </span>

            <h1 className="mt-6 text-4xl font-bold leading-tight text-gray-900 md:text-5xl">
              Advanced security for large companies.
            </h1>

            <p className="mt-5 text-lg leading-8 text-gray-600">
              Designed for enterprises that need high-level security, scalability,
              and performance. Manage massive data securely with full control.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <button className="flex items-center gap-2 rounded-full bg-indigo-600 px-6 py-3 font-semibold text-white transition hover:bg-indigo-700">
                Contact Sales <ArrowRight size={18} />
              </button>

              <button className="rounded-full border border-gray-300 px-6 py-3 font-semibold text-gray-800 transition hover:border-indigo-600 hover:text-indigo-600">
                Learn More
              </button>
            </div>
          </div>

          {/* RIGHT */}
          <div className="rounded-3xl bg-gradient-to-br from-indigo-50 to-gray-100 p-6">
            <div className="rounded-2xl bg-white p-6 shadow-lg">
              <ShieldCheck className="mb-5 text-indigo-600" size={42} />

              <h3 className="text-xl font-bold text-gray-900">
                Enterprise-grade platform
              </h3>

              <p className="mt-2 text-gray-600">
                Built for large organizations with strong encryption,
                global infrastructure, and compliance-ready systems.
              </p>

              <div className="mt-6 space-y-4">
                <Feature icon={<Lock />} title="End-to-end encryption" />
                <Feature icon={<Server />} title="High scalability" />
                <Feature icon={<Globe />} title="Global availability" />
              </div>
            </div>
          </div>

        </div>
      </section>
    </main>
  );
}

function Feature({ icon, title }: any) {
  return (
    <div className="flex items-center gap-3 rounded-xl bg-gray-50 p-3">
      <div className="text-indigo-600">{icon}</div>
      <p className="font-medium text-gray-800">{title}</p>
    </div>
  );
}