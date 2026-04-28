"use client";

import { ArrowRight, Users, FolderKanban, ShieldCheck, MessageSquare } from "lucide-react";

export default function ForTeamsPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-600 via-blue-600 to-cyan-500 px-6 py-24">
      <section className="mx-auto max-w-6xl rounded-3xl bg-white p-8 shadow-2xl md:p-14">
        <div className="grid items-center gap-12 md:grid-cols-2">
          <div>
            <span className="rounded-full bg-indigo-100 px-4 py-2 text-sm font-semibold text-indigo-700">
              For Teams
            </span>

            <h1 className="mt-6 text-4xl font-bold leading-tight text-gray-900 md:text-5xl">
              Collaborate and share with your team.
            </h1>

            <p className="mt-5 text-lg leading-8 text-gray-600">
              Keep your team connected with shared folders, secure file access,
              fast collaboration, and simple team management.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <button className="flex items-center gap-2 rounded-full bg-indigo-600 px-6 py-3 font-semibold text-white transition hover:bg-indigo-700">
                Create Team <ArrowRight size={18} />
              </button>

              <button className="rounded-full border border-gray-300 px-6 py-3 font-semibold text-gray-800 transition hover:border-indigo-600 hover:text-indigo-600">
                View Features
              </button>
            </div>
          </div>

          <div className="rounded-3xl bg-gradient-to-br from-indigo-50 to-blue-100 p-6">
            <div className="rounded-2xl bg-white p-6 shadow-lg">
              <Users className="mb-5 text-indigo-600" size={42} />

              <h3 className="text-xl font-bold text-gray-900">
                Team workspace
              </h3>

              <p className="mt-2 text-gray-600">
                Invite members, assign access, share files, and work together
                from one simple dashboard.
              </p>

              <div className="mt-6 space-y-4">
                <Feature icon={<FolderKanban />} title="Shared folders" />
                <Feature icon={<ShieldCheck />} title="Role-based access" />
                <Feature icon={<MessageSquare />} title="Easy collaboration" />
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