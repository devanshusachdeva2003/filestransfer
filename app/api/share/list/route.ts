import { NextResponse } from 'next/server'
import { getDb } from '@/app/lib/mongo'

export async function GET() {
  try {
    const db = await getDb()
    const col = db.collection('shares')
    const docs = await col.find({}).sort({ createdAt: -1 }).limit(100).toArray()
    const out = docs.map((d: any) => ({ id: d.id, subject: d.subject || null, files: d.files || [], expiry: d.expiry || null, createdAt: d.createdAt || null }))
    return NextResponse.json(out)
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}
