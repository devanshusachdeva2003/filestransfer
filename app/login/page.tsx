"use client"

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || 'Login failed')
      const token = data?.token
      if (token) {
        try { localStorage.setItem('token', token) } catch (e) {}
        try { document.cookie = `token=${token}; path=/` } catch (e) {}
      }
      router.push('/')
    } catch (err: any) {
      setError(err?.message || 'Login failed')
    } finally { setLoading(false) }
  }

  return (
    <div className="min-h-[60vh] flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-2xl font-bold mb-2">Sign in</h2>
        <p className="text-sm text-slate-500 mb-6">Sign in to continue and upload larger files.</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" type="email" required className="w-full px-4 py-3 border rounded-lg" />
          <input value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" type="password" required className="w-full px-4 py-3 border rounded-lg" />
          {error && <div className="text-sm text-red-500">{error}</div>}
          <div className="flex items-center justify-between">
            <button type="submit" className="px-5 py-3 bg-indigo-600 text-white rounded-lg" disabled={loading}>{loading ? 'Signing...' : 'Sign in'}</button>
            <a href="/register" className="text-sm text-indigo-600">Create account</a>
          </div>
        </form>
      </div>
    </div>
  )
}
