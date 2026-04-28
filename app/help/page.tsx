import { LifeBuoy, Search, BookOpen } from "lucide-react";

export default function HelpCenterPage() {
  return (
    <main className="min-h-screen bg-blue-50 px-6 py-24">
      <section className="mx-auto max-w-5xl text-center">
        <LifeBuoy className="mx-auto text-blue-600" size={48} />
        <h1 className="mt-5 text-5xl font-bold text-gray-900">Help Center</h1>
        <p className="mt-4 text-gray-600">
          Guides, tips, and troubleshooting for using our platform.
        </p>

        <div className="mx-auto mt-10 flex max-w-2xl items-center gap-3 rounded-2xl bg-white p-4 shadow">
          <Search className="text-gray-400" />
          <input
            className="w-full outline-none"
            placeholder="Search help articles..."
          />
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          <Card title="Getting Started" />
          <Card title="File Uploads" />
          <Card title="Account Settings" />
        </div>
      </section>
    </main>
  );
}

function Card({ title }: any) {
  return (
    <div className="rounded-2xl bg-white p-6 shadow hover:shadow-lg transition">
      <BookOpen className="mx-auto mb-3 text-blue-600" />
      <h3 className="font-semibold text-gray-900">{title}</h3>
    </div>
  );
}