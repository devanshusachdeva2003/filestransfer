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

export async function PUT(req: NextRequest) {
  try {
    let token: string | null = null
    const auth = req.headers.get('authorization')
    if (auth && auth.startsWith('Bearer ')) token = auth.slice(7)
    else {
      try { token = req.cookies.get('token')?.value || null } catch (e) { token = null }
    }

    const email = verifyToken(token)
    if (!email) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })

    const body = await req.json()
    const { name, newEmail, password } = body || {}
    if (!name && !newEmail && !password) {
      return NextResponse.json({ error: 'Nothing to update' }, { status: 400 })
    }

    const db = await (await import('@/app/lib/mongo')).getDb()
    const users = db.collection('users')

    // if changing email, ensure not already taken
    if (newEmail && newEmail.toLowerCase() !== email) {
      const exists = await users.findOne({ email: newEmail.toLowerCase() })
      if (exists) return NextResponse.json({ error: 'Email already in use' }, { status: 400 })
    }

    const update: any = {}
    if (name) update.name = name
    if (newEmail) update.email = newEmail.toLowerCase()
    if (password) {
      const crypto = await import('crypto')
      const salt = crypto.randomBytes(12).toString('hex')
      const derived = crypto.scryptSync(password, salt, 64).toString('hex')
      update.salt = salt
      update.derived = derived
    }

    if (Object.keys(update).length === 0) return NextResponse.json({ error: 'No updates' }, { status: 400 })

    await users.updateOne({ email }, { $set: update })

    // if email changed, issue new token
    let res = NextResponse.json({ success: true })
    if (newEmail) {
      const { createToken } = await import('@/app/lib/auth')
      const token2 = createToken(newEmail.toLowerCase())
      res.cookies.set('token', token2, { path: '/' })
    }
    return res
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Update failed' }, { status: 500 })
  }
}
