import { ShieldCheck, Lock, EyeOff, Database } from "lucide-react";

export default function SecurityPage() {
  return (
    <main className="min-h-screen bg-slate-950 px-6 py-24 text-white">
      <section className="mx-auto max-w-6xl">
        <ShieldCheck className="text-green-400" size={50} />

        <h1 className="mt-6 text-5xl font-bold">Security</h1>
        <p className="mt-4 max-w-2xl text-slate-300">
          Our commitment to your data privacy with secure file transfers,
          protected storage, and privacy-first systems.
        </p>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          <SecurityCard icon={<Lock />} title="Encrypted Files" />
          <SecurityCard icon={<EyeOff />} title="Privacy Protection" />
          <SecurityCard icon={<Database />} title="Secure Storage" />
        </div>
      </section>
    </main>
  );
}

function SecurityCard({ icon, title }: any) {
  return (
    <div className="rounded-2xl bg-slate-900 p-6 border border-slate-800">
      <div className="text-green-400">{icon}</div>
      <h3 className="mt-4 text-xl font-semibold">{title}</h3>
      <p className="mt-2 text-slate-400">
        Built to keep your data safe and private.
      </p>
    </div>
  );
}