import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { email, password } = body || {}
    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 })
    }

    // NOTE: This is a demo stub. Replace with real authentication.
    // For demo purposes accept any credentials and return a token.
    const token = `demo-${Date.now()}`

    return NextResponse.json({ success: true, token })
  } catch (err) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
}
