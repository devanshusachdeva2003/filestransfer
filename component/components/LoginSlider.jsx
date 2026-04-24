"use client";

import { X } from "lucide-react";
import { useState } from "react";

export default function LoginSlider({ openLogin, setOpenLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const submit = async (e) => {
    e?.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Login failed");
      const token = data?.token;
      if (token) {
        try { localStorage.setItem('token', token); } catch (e) {}
        try { document.cookie = `token=${token}; path=/`; } catch (e) {}
      }
      setOpenLogin(false);
      // notify other components that login completed so they can resume actions
      try { window.dispatchEvent(new CustomEvent('logged-in')) } catch (e) {}
    } catch (err) {
      setError(err?.message || "Login failed");
    } finally { setLoading(false); }
  };

  return (
    <>
      <div
        onClick={() => setOpenLogin(false)}
        className={`fixed inset-0 bg-black/30 z-60 transition-opacity duration-300 ${
          openLogin
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      />
      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-105 bg-white z-70 shadow-2xl transform transition-transform duration-300 ease-in-out ${
          openLogin ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="h-full flex flex-col">
          <div className="flex items-center px-6 py-5 border-b">
            <button
              onClick={() => setOpenLogin(false)}
              className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center"
            >
              <X size={20} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-8 bg-gray-50">
            <div className="max-w-md mx-auto bg-white rounded-2xl shadow-md p-8 mt-10">
              <h2 className="text-3xl font-bold mb-8 text-gray-900">Sign in to your account</h2>

              <form onSubmit={submit} className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-500 mb-2">Email address</label>
                  <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-400" />
                </div>

                <div>
                  <label className="block text-sm text-gray-500 mb-2">Password</label>
                  <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" required className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-400" />
                </div>

                {error && <div className="text-sm text-red-500">{error}</div>}

                <div className="flex gap-2 items-center">
                  <button type="submit" disabled={loading} className="flex-1 w-full bg-indigo-600 text-white py-3 rounded-xl font-medium hover:bg-indigo-700 transition">
                    {loading ? "Signing..." : "Sign in"}
                  </button>
                  <a href="/register" className="text-sm text-indigo-600">Create account</a>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}