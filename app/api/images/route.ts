import { NextResponse } from "next/server"
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
  // respond with 500 when requested rather than throwing at module load time
  // so the app can still start without cloudinary configured.
  // Individual requests will receive an error JSON.
}

try { cloudinary.config(cloudinaryConfig) } catch (e) { /* ignore */ }

export async function GET() {
  try {
    // list resources in the same folder used by uploads
    const opts = { type: 'upload', prefix: 'ad-transfer', max_results: 500, resource_type: 'image' }
    const res: any = await new Promise((resolve, reject) => {
      cloudinary.api.resources(opts, (err, result) => {
        if (err) return reject(err)
        resolve(result)
      })
    })

    const resources = (res && res.resources) || []
    const images = resources.map((r: any) => r.secure_url || r.url).filter(Boolean)

    return NextResponse.json({ images })
  } catch (err) {
    console.error('images list failed', err)
    return NextResponse.json({ error: 'Failed to list images' }, { status: 500 })
  }
}
