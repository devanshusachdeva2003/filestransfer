import { Code2 } from "lucide-react";

export default function ApiReferencePage() {
  return (
    <main className="min-h-screen bg-slate-950 px-6 py-24 text-white">
      <section className="mx-auto max-w-5xl">
        <Code2 size={46} className="text-blue-400" />

        <h1 className="mt-6 text-5xl font-bold">API Reference</h1>

        <p className="mt-4 max-w-2xl text-lg text-slate-300">
          Built for seamless integrations. Connect your app with powerful,
          secure, and developer-friendly APIs.
        </p>

        <div className="mt-10 rounded-2xl bg-slate-900 p-6">
          <p className="text-sm text-slate-400">Example Endpoint</p>
          <pre className="mt-3 overflow-x-auto rounded-xl bg-black p-5 text-green-400">
            {`GET /api/files
POST /api/upload
DELETE /api/files/:id`}
          </pre>
        </div>
      </section>
    </main>
  );
}