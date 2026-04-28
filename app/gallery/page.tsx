"use client"

import React, { useEffect, useState } from 'react'

type ImageItem = { url: string; name: string }

export default function Page() {
  const [images, setImages] = useState<ImageItem[]>([])
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    let mounted = true
    fetch('/api/images')
      .then((r) => r.json())
      .then((data) => {
        if (!mounted) return
        const imgs = (data.images || []).map((u: string) => ({ url: u, name: decodeURIComponent((u.split('/').pop() || 'image')) }))
        setImages(imgs)
      })
      .catch((e) => console.error(e))
      .finally(() => mounted && setLoading(false))

    return () => { mounted = false }
  }, [])

  const downloadBlob = async (url: string, name: string) => {
    try {
      const resp = await fetch(url)
      const blob = await resp.blob()
      const obj = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = obj
      a.download = name
      document.body.appendChild(a)
      a.click()
      a.remove()
      URL.revokeObjectURL(obj)
    } catch (e) {
      console.error('download failed', e)
      // fallback: open in new tab
      window.open(url, '_blank')
    }
  }

  const downloadAll = async () => {
    setBusy(true)
    for (const img of images) {
      // sequential to avoid overwhelming the browser
      // eslint-disable-next-line no-await-in-loop
      await downloadBlob(img.url, img.name)
      // small pause so browser can schedule downloads
      // eslint-disable-next-line no-await-in-loop
      await new Promise((r) => setTimeout(r, 300))
    }
    setBusy(false)
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Image Gallery</h1>
          <div className="flex items-center gap-3">
            <button
              onClick={() => downloadAll()}
              disabled={busy || loading || images.length === 0}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md disabled:opacity-50"
            >
              {busy ? 'Downloading...' : 'Download All'}
            </button>
          </div>
        </div>

        {loading && <p>Loading images…</p>}

        {!loading && images.length === 0 && (
          <div className="p-6 bg-white rounded-md shadow">No images found.</div>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {images.map((img) => (
            <div key={img.url} className="bg-white rounded-md overflow-hidden shadow">
              <div className="w-full h-48 bg-slate-100 flex items-center justify-center overflow-hidden">
                <img src={img.url} alt={img.name} className="object-cover w-full h-full" />
              </div>
              <div className="p-3 flex items-center justify-between gap-2">
                <div className="truncate text-sm text-slate-700">{img.name}</div>
                <div className="flex gap-2">
                  <button
                    onClick={() => downloadBlob(img.url, img.name)}
                    className="px-3 py-1 bg-slate-800 text-white rounded-md text-sm"
                  >
                    Download
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
