import { NextRequest, NextResponse } from 'next/server'
import { verifyToken, getUser } from '@/app/lib/auth'

export async function GET(req: NextRequest) {
  let token: string | null = null
  const auth = req.headers.get('authorization')
  if (auth && auth.startsWith('Bearer ')) token = auth.slice(7)
  else {
    try { token = req.cookies.get('token')?.value || null } catch (e) { token = null }
  }

  const email = verifyToken(token)
  if (!email) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })

  const user = await getUser(email)
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

  return NextResponse.json({ user })
}
