import { Rocket } from "lucide-react";

export default function FreeTrialPage() {
  return (
    <main className="min-h-screen bg-blue-600 text-white flex items-center justify-center">
      <div className="text-center px-6">
        <Rocket className="mx-auto mb-4" size={40} />
        <h1 className="text-4xl font-bold">Free Trial</h1>
        <p className="mt-4 text-blue-100">
          Try premium features for 7 days. No credit card required.
        </p>

        <button className="mt-8 bg-white text-blue-600 px-6 py-3 rounded-full font-semibold">
          Start Free Trial
        </button>
      </div>
    </main>
  );
}