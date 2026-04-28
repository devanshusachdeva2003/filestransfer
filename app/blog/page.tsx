import { Newspaper } from "lucide-react";

export default function BlogPage() {
  return (
    <main className="min-h-screen bg-gray-50 px-6 py-24">
      <section className="mx-auto max-w-6xl">
        <div className="text-center">
          <Newspaper className="mx-auto text-purple-600" size={50} />
          <h1 className="mt-5 text-5xl font-bold text-gray-900">Blog</h1>
          <p className="mt-4 text-gray-600">
            Latest news and product updates.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          <BlogCard title="What’s new in file sharing" />
          <BlogCard title="How secure uploads work" />
          <BlogCard title="Product update: Faster transfers" />
        </div>
      </section>
    </main>
  );
}

function BlogCard({ title }: any) {
  return (
    <article className="rounded-2xl bg-white p-6 shadow hover:-translate-y-1 hover:shadow-xl transition">
      <p className="text-sm font-semibold text-purple-600">Product Update</p>
      <h3 className="mt-3 text-xl font-bold text-gray-900">{title}</h3>
      <p className="mt-3 text-gray-600">
        Read our latest updates, tips, and platform improvements.
      </p>
    </article>
  );
}