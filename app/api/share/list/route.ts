import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const sharesDir = path.join(process.cwd(), 'data', 'shares')

export async function GET() {
  try {
    if (!fs.existsSync(sharesDir)) return NextResponse.json([])
    const files = await fs.promises.readdir(sharesDir)
    const result = await Promise.all(files.map(async f => {
      try {
        const raw = await fs.promises.readFile(path.join(sharesDir, f), 'utf8')
        const data = JSON.parse(raw)
        return { id: data.id, subject: data.subject || null, files: data.files || [], expiry: data.expiry || null, createdAt: data.createdAt || data.created || null }
      } catch (e) {
        return null
      }
    }))

    const filtered = result.filter(Boolean)
    filtered.sort((a: any, b: any) => (b.createdAt || 0) - (a.createdAt || 0))
    return NextResponse.json(filtered)
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}
