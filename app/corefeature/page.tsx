export default function CoreFeaturesPage() {
  return (
    <main className="min-h-screen bg-gray-50 px-6 py-20">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold text-center">Core Features</h1>
        <p className="text-center text-gray-600 mt-3">
          Everything you can do with AD Transfer.
        </p>

        <div className="mt-10 grid md:grid-cols-3 gap-6">
          <Card title="Fast Uploads" />
          <Card title="Secure Sharing" />
          <Card title="Simple Links" />
        </div>
      </div>
    </main>
  );
}

function Card({ title }: any) {
  return (
    <div className="p-6 bg-white rounded-xl shadow hover:shadow-lg transition">
      <h3 className="font-semibold text-lg">{title}</h3>
    </div>
  );
}