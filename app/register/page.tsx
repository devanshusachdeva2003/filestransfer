"use client"

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function RegisterPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || 'Registration failed')
      const token = data?.token
      if (token) {
        try { localStorage.setItem('token', token) } catch (e) {}
        try { document.cookie = `token=${token}; path=/` } catch (e) {}
      }
      router.push('/')
    } catch (err: any) {
      setError(err?.message || 'Registration failed')
    } finally { setLoading(false) }
  }

  return (
    <main className="min-h-screen bg-white flex items-center justify-center px-6 py-20">
    <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">

      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900">
          Create an account
        </h2>

        <p className="mt-2 text-sm text-gray-500">
          Register to upload large files and manage your shares.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Full name"
          required
          className="w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-800 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
        />

        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email address"
          type="email"
          required
          className="w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-800 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
        />

        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          type="password"
          required
          className="w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-800 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
        />

        {error && (
          <div className="text-sm text-red-500">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white transition hover:bg-indigo-700 disabled:opacity-70"
        >
          {loading ? "Creating..." : "Create account"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-500">
        Already have an account?{" "}
        <span className="cursor-pointer font-medium text-indigo-600 hover:underline">
          Login
        </span>
      </p>

    </div>
  </main>
  )
}
