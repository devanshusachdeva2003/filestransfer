import { Boxes, Wrench, Terminal } from "lucide-react";

export default function SdksToolsPage() {
  return (
    <main className="min-h-screen bg-gray-50 px-6 py-24">
      <section className="mx-auto max-w-6xl">
        <div className="text-center">
          <Boxes className="mx-auto text-purple-600" size={46} />

          <h1 className="mt-5 text-5xl font-bold text-gray-900">
            SDKs & Tools
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-gray-600">
            Open source kits for every language. Build faster with ready-made
            tools and simple developer packages.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          <Card icon={<Terminal />} title="JavaScript SDK" />
          <Card icon={<Wrench />} title="CLI Tools" />
          <Card icon={<Boxes />} title="Open Source Kits" />
        </div>
      </section>
    </main>
  );
}

function Card({ icon, title }: any) {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-md transition hover:-translate-y-1 hover:shadow-xl">
      <div className="text-purple-600">{icon}</div>
      <h3 className="mt-4 text-xl font-semibold text-gray-900">{title}</h3>
      <p className="mt-2 text-gray-600">
        Simple setup, clean documentation, and fast integration.
      </p>
    </div>
  );
}