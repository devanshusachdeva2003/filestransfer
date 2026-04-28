import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const sharesDir = path.join(process.cwd(), 'data', 'shares')

export async function GET(req: NextRequest, context: { params: any }) {
  try {
    const params = await context.params
    const id = params.id
    const filePath = path.join(sharesDir, `${id}.json`)
    if (!fs.existsSync(filePath)) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    const raw = await fs.promises.readFile(filePath, 'utf8')
    const data = JSON.parse(raw)
    if (Date.now() > data.expiry) return NextResponse.json({ error: 'Expired' }, { status: 410 })

    const protectedFlag = !!data.password
    const resp: any = { id: data.id, expiry: data.expiry, protected: protectedFlag, subject: data.subject || null }
    if (!protectedFlag) resp.files = data.files
    return NextResponse.json(resp)
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}

export async function POST(req: NextRequest, context: { params: any }) {
  try {
    const params = await context.params
    const id = params.id
    const body = await req.json()
    const { password } = body || {}
    const filePath = path.join(sharesDir, `${id}.json`)
    if (!fs.existsSync(filePath)) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    const raw = await fs.promises.readFile(filePath, 'utf8')
    const data = JSON.parse(raw)
    if (Date.now() > data.expiry) return NextResponse.json({ error: 'Expired' }, { status: 410 })
    if (!data.password) return NextResponse.json({ files: data.files })
    if (String(password) === String(data.password)) {
      return NextResponse.json({ files: data.files })
    }
    return NextResponse.json({ error: 'Invalid password' }, { status: 401 })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}
