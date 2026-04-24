import { NextRequest, NextResponse } from 'next/server'
import { createUser, createToken } from '@/app/lib/auth'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, email, password } = body || {}
    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Name, email and password are required' }, { status: 400 })
    }

    try {
      await createUser(name, email.toLowerCase(), password)
    } catch (e: any) {
      return NextResponse.json({ error: e?.message || 'Registration failed' }, { status: 400 })
    }

    const token = createToken(email.toLowerCase())
    const res = NextResponse.json({ success: true, token })
    res.cookies.set('token', token, { path: '/' })
    return res
  } catch (err) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
}
