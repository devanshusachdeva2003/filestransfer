import { NextRequest, NextResponse } from "next/server"
import fs from "fs"
import path from "path"
import { v2 as cloudinary } from 'cloudinary'

const cloudinaryConfig = process.env.CLOUDINARY_URL
  ? { cloudinary_url: process.env.CLOUDINARY_URL, secure: true }
  : {
      cloud_name: process.env.CLOUD_NAME || process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUD_API_KEY || process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUD_API_SECRET || process.env.CLOUDINARY_API_SECRET,
      secure: true,
    }

if (!cloudinaryConfig.cloudinary_url && (!cloudinaryConfig.cloud_name || !cloudinaryConfig.api_key || !cloudinaryConfig.api_secret)) {
  throw new Error(
    'Missing Cloudinary configuration. Set CLOUDINARY_URL, or CLOUD_NAME/CLOUD_API_KEY/CLOUD_API_SECRET, or CLOUDINARY_CLOUD_NAME/CLOUDINARY_API_KEY/CLOUDINARY_API_SECRET.'
  )
}

cloudinary.config(cloudinaryConfig)

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const files = formData.getAll("files") as File[]
    const createShare = Boolean(formData.get('createShare'))

    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: "No files uploaded" },
        { status: 400 }
      )
    }

    // Note: do not write into the deployed bundle. Share pages are uploaded
    // to Cloudinary as raw files so they are persistent and publicly accessible.

    const uploadedFiles: string[] = []

    // Server-side enforcement: compute total bytes up-front so we can require auth for large uploads
    const MAX_SIZE = 100 * 1024 * 1024 // 100 MB

    // Build buffers for each file (we'll reuse these buffers when uploading)
    const fileBuffers: { file: File; buffer: Buffer }[] = []
    let totalBytes = 0
    for (const file of files) {
      const bytes = await file.arrayBuffer()
      const buffer = Buffer.from(bytes)

      // keep track of total size (bytes) for server-side enforcement
      totalBytes += buffer.length
      fileBuffers.push({ file, buffer })
    }

    // Check authentication: validate token when present
    const authHeader = req.headers.get('authorization')
    let token: string | null = null
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.slice(7)
    } else {
      try {
        const cookie = req.cookies.get('token')
        if (cookie) token = cookie.value
      } catch (e) {
        // ignore
      }
    }

    // validate token using in-memory auth module if present
    let validUser: string | null = null
    if (token) {
      try {
        const mod = await import('@/app/lib/auth')
        const verifyToken = mod.verifyToken
        if (typeof verifyToken === 'function') {
          // support both sync and async verifyToken implementations
          const maybe = verifyToken(token)
          if (maybe && typeof (maybe as any).then === 'function') {
            validUser = await maybe
          } else {
            validUser = maybe
          }
        } else {
          validUser = null
        }
      } catch (e) {
        console.error('auth verify/import failed', e)
        // expose minimal debug info in response body for local debugging (non-sensitive)
        return NextResponse.json({ error: 'Auth verify failed', detail: String(e) }, { status: 500 })
      }
    }

    console.log('upload route debug', { totalBytes, tokenPresent: !!token, validUser })

    if (totalBytes > MAX_SIZE && !validUser) {
      return NextResponse.json({ error: 'Authentication required for uploads larger than 100MB' }, { status: 401 })
    }

    // Upload each buffered file to Cloudinary
    for (const entry of fileBuffers) {
      const file = entry.file
      const buffer = entry.buffer

      const result = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: 'ad-transfer',
            resource_type: 'auto',
            public_id: `${Date.now()}-${file.name.replace(/\.[^/.]+$/, "")}`
          },
          (error, result) => {
            if (error) reject(error)
            else resolve(result)
          }
        )
        uploadStream.end(buffer)
      }) as any

      uploadedFiles.push(result.secure_url)
      console.log("Cloudinary Upload Successful:", result.secure_url)
    }

    // Server-side: if total upload > 100MB and no auth token, block share creation
    const LIMIT = 100 * 1024 * 1024
    const cookie = req.headers.get('cookie') || ''
    const hasToken = /(^|; )token=([^;]+)/.test(cookie)

    if (createShare && totalBytes > LIMIT && !hasToken) {
      return NextResponse.json({ error: 'Authentication required for shares larger than 100MB' }, { status: 401 })
    }

    // If requested, create a public HTML share page that lists links to uploaded files
    const password = formData.get('password') as string | null
    const email = formData.get('email') as string | null
    const subject = formData.get('subject') as string | null

    let sharePath: string | null = null
    // expiration timestamp (4 hours from creation)
    const EXPIRY_MS = 4 * 60 * 60 * 1000 // 4 hours
    const expiryTimestamp = Date.now() + EXPIRY_MS
    if (createShare && uploadedFiles.length) {
      try {
        const sharesDir = path.join(process.cwd(), 'data', 'shares')
        try { await fs.promises.mkdir(sharesDir, { recursive: true }) } catch (e) { }

        const id = `share-${Date.now()}-${Math.random().toString(36).slice(2,9)}`
        const expiry = Date.now() + (4 * 60 * 60 * 1000) // 4 hours

        const payload = {
          id,
          files: uploadedFiles,
          createdAt: Date.now(),
          expiry,
          password: password || null,
          subject: subject || null,
          email: email || null,
        }

        const filePath = path.join(sharesDir, `${id}.json`)
        await fs.promises.writeFile(filePath, JSON.stringify(payload, null, 2), 'utf8')

        // return a relative path; client will prefix origin
        sharePath = `/shares/${id}`
      } catch (e) {
        console.error('create local share failed', e)
        sharePath = null
      }
    }

    return NextResponse.json({
      success: true,
      url: uploadedFiles[0], // first file link
      files: uploadedFiles, // all files
      share: sharePath,
    })
  } catch (error) {
    console.error(error)

    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Upload failed" },
      { status: 500 }
    )
  }
}