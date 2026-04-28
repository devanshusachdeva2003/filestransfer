"use client"

import React, { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Navbar from '../../../component/components/Navbar'

type ShareMeta = { id: string; expiry: number; protected: boolean; files?: string[] }

export default function SharePage() {
  const params = useParams()
  const id = params?.id as string
  const [meta, setMeta] = useState<ShareMeta | null>(null)
  const [loading, setLoading] = useState(true)
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [files, setFiles] = useState<string[]>([])
  const [openLogin, setOpenLogin] = useState(false)
  const router = useRouter()

  useEffect(() => {
    if (!id) {
      setError('Invalid share id')
      setLoading(false)
      return
    }

    let mounted = true
    fetch(`/api/share/${id}`)
      .then((r) => r.json())
      .then((d) => {
        if (!mounted) return
        if (d.error) {
          setError(d.error)
          setMeta(null)
        } else {
          setMeta(d)
          if (!d.protected && d.files) setFiles(d.files)
        }
      })
      .catch((e) => setError(String(e)))
      .finally(() => mounted && setLoading(false))

    return () => { mounted = false }
  }, [id])

  const tryPassword = async () => {
    setError(null)
    setLoading(true)
    try {
      const res = await fetch(`/api/share/${id}`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ password }) })
      const d = await res.json()
      if (res.ok && d.files) {
        setFiles(d.files)
      } else {
        setError(d.error || 'Invalid password')
      }
    } catch (e) {
      setError('Request failed')
    } finally {
      setLoading(false)
    }
  }

  const downloadBlob = async (url: string, name: string) => {
    try {
      const resp = await fetch(url)
      const blob = await resp.blob()
      const u = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = u
      a.download = name
      document.body.appendChild(a)
      a.click()
      a.remove()
      URL.revokeObjectURL(u)
    } catch (e) {
      window.open(url, '_blank')
    }
  }

  const downloadAll = async () => {
    for (const f of files) {
      // eslint-disable-next-line no-await-in-loop
      await downloadBlob(f, decodeURIComponent((f.split('/').pop() || 'file')))
      // eslint-disable-next-line no-await-in-loop
      await new Promise((r) => setTimeout(r, 300))
    }
  }

  const [busyZip, setBusyZip] = useState(false)
  const [busyPdf, setBusyPdf] = useState(false)

  const downloadZip = async () => {
    if (!files.length) return
    setBusyZip(true)
    try {
      const JSZip = (await import('jszip')).default
      const zip = new JSZip()
      for (const f of files) {
        try {
          const resp = await fetch(f)
          const blob = await resp.blob()
          const name = decodeURIComponent((f.split('/').pop() || 'file'))
          zip.file(name, blob)
        } catch (e) {
          console.error('add to zip failed', e)
        }
      }
      const content = await zip.generateAsync({ type: 'blob' })
      const url = URL.createObjectURL(content)
      const a = document.createElement('a')
      a.href = url
      a.download = `${id || 'files'}.zip`
      document.body.appendChild(a)
      a.click()
      a.remove()
      URL.revokeObjectURL(url)
    } catch (e) {
      console.error(e)
      alert('Failed to create ZIP')
    } finally {
      setBusyZip(false)
    }
  }

  const downloadPdf = async () => {
    if (!files.length) return
    setBusyPdf(true)
    try {
      const { jsPDF } = await import('jspdf')
      const pdf = new jsPDF({ unit: 'pt', format: 'a4' })
      const pageWidth = pdf.internal.pageSize.getWidth()
      const pageHeight = pdf.internal.pageSize.getHeight()

      let first = true
      for (const f of files) {
        try {
          const resp = await fetch(f)
          const blob = await resp.blob()
          // convert blob to dataURL
          const dataUrl: string = await new Promise((res, rej) => {
            const r = new FileReader()
            r.onload = () => res(String(r.result))
            r.onerror = rej
            r.readAsDataURL(blob)
          })

          // add image to PDF, scale preserving aspect ratio
          const img = new Image()
          img.src = dataUrl
          await new Promise((r) => { img.onload = r; img.onerror = r })
          const iw = img.width
          const ih = img.height
          const ratio = Math.min(pageWidth / iw, pageHeight / ih)
          const w = iw * ratio
          const h = ih * ratio
          const x = (pageWidth - w) / 2
          const y = (pageHeight - h) / 2

          if (!first) pdf.addPage()
          first = false
          // jspdf expects JPEG/PNG data URL; it will auto-detect
          pdf.addImage(dataUrl, 'JPEG', x, y, w, h)
        } catch (e) {
          console.error('add to pdf failed', e)
        }
      }

      const blob = pdf.output('blob')
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${id || 'files'}.pdf`
      document.body.appendChild(a)
      a.click()
      a.remove()
      URL.revokeObjectURL(url)
    } catch (e) {
      console.error(e)
      alert('Failed to create PDF')
    } finally {
      setBusyPdf(false)
    }
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading…</div>
  if (!id) return <div className="min-h-screen p-6"><div className="max-w-3xl mx-auto text-center p-8 bg-white rounded shadow">Invalid share id</div></div>
  if (error) return <div className="min-h-screen p-6"><div className="max-w-3xl mx-auto text-center p-8 bg-white rounded shadow">{error}</div></div>

  return (
    <div className="min-h-screen bg-slate-50 pt-20">
      <Navbar setOpenLogin={setOpenLogin} />
      <div className="max-w-4xl mx-auto py-16">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">Your files are ready!</h1>
          <div className="mt-6 flex items-center justify-center gap-3">
            <button onClick={downloadAll} disabled={!files.length} className="px-6 py-3 bg-indigo-600 text-white rounded-full">Download ALL files</button>
            <button onClick={downloadZip} disabled={!files.length || busyZip} className="px-4 py-2 bg-slate-800 text-white rounded-full">{busyZip ? 'Creating ZIP…' : 'Download ZIP'}</button>
            <button onClick={downloadPdf} disabled={!files.length || busyPdf} className="px-4 py-2 bg-slate-800 text-white rounded-full">{busyPdf ? 'Creating PDF…' : 'Download PDF'}</button>
          </div>
        </div>

        {meta?.protected && files.length === 0 && (
          <div className="max-w-md mx-auto bg-white p-8 rounded shadow text-center">
            <h3 className="text-xl font-semibold mb-3">Protected Share</h3>
            <p className="text-sm text-slate-600 mb-4">Enter the password to view and download files.</p>
            <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" className="w-full p-3 border rounded mb-3" placeholder="Password" />
            <div className="flex gap-3 justify-center">
              <button onClick={tryPassword} className="px-4 py-2 bg-indigo-600 text-white rounded">View Files</button>
              <button onClick={() => router.back()} className="px-4 py-2 border rounded">Cancel</button>
            </div>
            {error && <div className="text-red-500 mt-3">{error}</div>}
          </div>
        )}

        {files.length > 0 && (
          <div className="mt-8 bg-white rounded shadow p-4">
            {files.map((f) => (
              <div key={f} className="flex items-center justify-between p-3 border-b last:border-b-0">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-slate-100 rounded flex items-center justify-center">📄</div>
                  <div className="truncate">{decodeURIComponent((f.split('/').pop() || f))}</div>
                </div>
                <div>
                  <button onClick={() => downloadBlob(f, decodeURIComponent((f.split('/').pop() || f)))} className="px-4 py-2 bg-indigo-600 text-white rounded">Download</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
