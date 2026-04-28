"use client";


import { ArrowRight, ShieldCheck, UploadCloud, Link2, Clock } from "lucide-react";

export default function ForIndividualsPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 px-6 py-24">
      <section className="mx-auto max-w-6xl rounded-3xl bg-white p-8 shadow-2xl md:p-14">
        <div className="grid items-center gap-12 md:grid-cols-2">
          <div>
            <span className="rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-700">
              For Individuals
            </span>

            <h1 className="mt-6 text-4xl font-bold leading-tight text-gray-900 md:text-5xl">
              Secure file sharing for everyone.
            </h1>

            <p className="mt-5 text-lg leading-8 text-gray-600">
              Upload, share, and manage your personal files easily with fast,
              safe, and simple file transfer tools.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <button className="flex items-center gap-2 rounded-full bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700">
                Start Sharing <ArrowRight size={18} />
              </button>

              <button className="rounded-full border border-gray-300 px-6 py-3 font-semibold text-gray-800 transition hover:border-blue-600 hover:text-blue-600">
                Learn More
              </button>
            </div>
          </div>

          <div className="rounded-3xl bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
            <div className="rounded-2xl bg-white p-6 shadow-lg">
              <UploadCloud className="mb-5 text-blue-600" size={42} />

              <h3 className="text-xl font-bold text-gray-900">
                Upload your files
              </h3>

              <p className="mt-2 text-gray-600">
                Drag and drop your documents, images, videos, or folders and
                share them in seconds.
              </p>

              <div className="mt-6 space-y-4">
                <Feature icon={<ShieldCheck />} title="Private & secure" />
                <Feature icon={<Link2 />} title="Share using one simple link" />
                <Feature icon={<Clock />} title="Fast transfer anytime" />
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
      <div className="text-blue-600">{icon}</div>
      <p className="font-medium text-gray-800">{title}</p>
    </div>
  );
}