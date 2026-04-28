import { Crown } from "lucide-react";

export default function ProPage() {
  return (
    <main className="min-h-screen bg-black text-white px-6 py-20">
      <div className="max-w-4xl mx-auto text-center">
        <Crown className="mx-auto text-yellow-400 mb-4" size={40} />
        <h1 className="text-4xl font-bold">TransferNow Pro</h1>
        <p className="mt-4 text-gray-300">
          The professional way to send files with advanced features and speed.
        </p>

        <button className="mt-8 bg-yellow-400 text-black px-6 py-3 rounded-full font-semibold">
          Upgrade Now
        </button>
      </div>
    </main>
  );
}