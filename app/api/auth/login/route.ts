import { NextRequest, NextResponse } from 'next/server'
import { verifyUser, createToken } from '@/app/lib/auth'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { email, password } = body || {}
    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 })
    }

    const ok = await verifyUser(email.toLowerCase(), password)
    if (!ok) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    const token = createToken(email.toLowerCase())
    const res = NextResponse.json({ success: true, token })
    res.cookies.set('token', token, { path: '/' })
    return res
  } catch (err) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
}
