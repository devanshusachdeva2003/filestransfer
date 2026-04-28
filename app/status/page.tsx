import { Activity, CheckCircle, Server } from "lucide-react";

export default function StatusPage() {
  return (
    <main className="min-h-screen bg-emerald-50 px-6 py-24">
      <section className="mx-auto max-w-4xl rounded-3xl bg-white p-8 shadow-xl">
        <div className="text-center">
          <Activity className="mx-auto text-emerald-600" size={46} />

          <h1 className="mt-5 text-5xl font-bold text-gray-900">Status</h1>

          <p className="mt-4 text-gray-600">
            Check our system uptime and health.
          </p>
        </div>

        <div className="mt-10 space-y-4">
          <StatusItem title="Upload Service" />
          <StatusItem title="File Transfer API" />
          <StatusItem title="Dashboard" />
        </div>
      </section>
    </main>
  );
}

function StatusItem({ title }: any) {
  return (
    <div className="flex items-center justify-between rounded-xl border p-4">
      <div className="flex items-center gap-3">
        <Server className="text-emerald-600" />
        <span className="font-semibold text-gray-800">{title}</span>
      </div>

      <div className="flex items-center gap-2 text-emerald-600">
        <CheckCircle size={18} />
        <span className="font-medium">Operational</span>
      </div>
    </div>
  );
}