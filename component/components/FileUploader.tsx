"use client"

import React, { useRef, useState, useEffect } from "react"
import { FaWhatsapp, FaFacebook, FaTwitter, FaTelegram, FaInstagram } from 'react-icons/fa'

type Props = {
  onFiles?: (files: File[]) => void
  onPanelChange?: (isOpen: boolean) => void
}

const FileUploader: React.FC<Props> = ({ onFiles, onPanelChange }) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const folderInputRef = useRef<HTMLInputElement | null>(null)

  const [previews, setPreviews] = useState<
    { id: string; file: File; url: string }[]
  >([])
  const [shareUrl, setShareUrl] = useState<string | null>(null)
  const [creating, setCreating] = useState(false)
  const [stagedFiles, setStagedFiles] = useState<File[]>([])
  const [activeTab, setActiveTab] = useState<'send' | 'link'>('link')
  const [email, setEmail] = useState('')
  const [subject, setSubject] = useState('')
  const [customLink, setCustomLink] = useState('')
  const [password, setPassword] = useState('')

  const openFileDialog = () => {
    console.debug('openFileDialog', !!fileInputRef.current)
    if (fileInputRef.current) {
      // clear value so re-selecting same file triggers onChange
      fileInputRef.current.value = ''
      fileInputRef.current.click()
    }
  }
  const openFolderDialog = () => {
    console.debug('openFolderDialog', !!folderInputRef.current)
    if (folderInputRef.current) {
      folderInputRef.current.value = ''
      folderInputRef.current.click()
    }
  }
  const [panelOpen, setPanelOpenState] = useState(false)
  const [loading, setLoading] = useState(false)
  const [showFiles, setShowFiles] = useState(false)
  const [requireAuthModal, setRequireAuthModal] = useState(false)
  const [authTab, setAuthTab] = useState<'login'|'register'>('login')
  const [pendingUpload, setPendingUpload] = useState(false)
  const [authLoading, setAuthLoading] = useState(false)
  const [authError, setAuthError] = useState<string | null>(null)

  const setPanelOpen = (val: boolean | ((s: boolean) => boolean)) => {
    setPanelOpenState(val)
  }

  useEffect(() => {
    onPanelChange?.(panelOpen)
  }, [panelOpen, onPanelChange])

  const handleFiles = (filesList: FileList | null) => {
    const files = Array.from(filesList || [])
    console.debug('handleFiles received', files.length, files.map((f) => ((f as any).webkitRelativePath || f.name)))
    if (!files.length) return

    const next = files.map((f) => ({
      id: crypto.randomUUID(),
      file: f,
      url: URL.createObjectURL(f),
      // preserve folder path when available
      name: (f as any).webkitRelativePath || f.name,
    }))

    setPreviews((prev) => [...prev, ...next])
    setStagedFiles((prev) => [...prev, ...files])
  }

  // Ensure non-standard attributes are present on the folder input
  useEffect(() => {
    if (folderInputRef.current) {
      try {
        folderInputRef.current.setAttribute('webkitdirectory', '')
        folderInputRef.current.setAttribute('directory', '')
      } catch (e) {
        console.debug('failed to set webkitdirectory attribute', e)
      }
    }
  }, [])

  // Upload files to the server and request a public share page
  const uploadFilesToServer = async (files: File[]) => {
    setCreating(true)
    try {
      const fd = new FormData()
      for (const f of files) fd.append('files', f)
      fd.append('createShare', '1')
      if (email) fd.append('email', email)
      if (subject) fd.append('subject', subject)
      if (password) fd.append('password', password)

      const res = await fetch('/api/upload', { method: 'POST', body: fd })
      const data = await res.json()
      if (data?.share) {
        const origin = typeof window !== 'undefined' ? window.location.origin : ''
        setShareUrl(origin + data.share)
      } else if (data?.url) {
        const origin = typeof window !== 'undefined' ? window.location.origin : ''
        setShareUrl(origin + data.url)
      }
    } catch (err) {
      console.error('upload failed', err)
    } finally {
      setCreating(false)
    }
  }

  const copyLink = async () => {
    if (!shareUrl) return
    await navigator.clipboard.writeText(shareUrl)
  }

  const shareToInstagram = async () => {
    if (!shareUrl) return
    // Try Web Share API first (best on mobile where Instagram appears as a target)
    try {
      if (navigator.share) {
        await (navigator as any).share({ title: 'Shared files', text: shareUrl, url: shareUrl })
        return
      }
    } catch (e) {
      // ignore and fallback
    }

    // Fallback: copy link to clipboard and open Instagram
    try {
      await navigator.clipboard.writeText(shareUrl)
    } catch (e) {
      // ignore
    }
    window.open('https://www.instagram.com/', '_blank')
  }

  const openDeepLink = (primary: string, fallback: string) => {
    try {
      // Open primary (could be a custom scheme or intent). We open in a new tab/window.
      window.open(primary, '_blank')
    } catch (e) {
      // ignore
    }
    // After a short delay open the web fallback so users on desktop still get the share dialog
    setTimeout(() => {
      try {
        window.open(fallback, '_blank')
      } catch (e) {
        // ignore
      }
    }, 800)
  }

  const removeFile = (id: string) => {
    setPreviews((prev) => {
      const item = prev.find((p) => p.id === id)
      if (item) {
        // remove matching file from staged files by name/path
        setStagedFiles((sf) => sf.filter((f) => ((f as any).webkitRelativePath || f.name) !== (item as any).name && f.name !== item.file.name))
        try {
          URL.revokeObjectURL(item.url)
        } catch (e) { }
      }
      return prev.filter((p) => p.id !== id)
    })
  }

  const formatBytes = (bytes: number, decimals = 2) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const dm = decimals < 0 ? 0 : decimals
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
  }

  const MAX_SIZE = 100 * 1024 * 1024 // 100 MB

  const getTotalBytes = () => stagedFiles.reduce((acc, f) => acc + f.size, 0)

  const isLoggedIn = () => {
    try {
      return !!localStorage.getItem('token')
    } catch (e) {
      return false
    }
  }

  const getTotalSize = () => {
    const total = stagedFiles.reduce((acc, f) => acc + f.size, 0)
    return formatBytes(total)
  }

  const confirmUpload = async () => {
    if (!stagedFiles.length) return
    const total = getTotalBytes()
    if (total > MAX_SIZE && !isLoggedIn()) {
      // require sign up / login before allowing upload of >100MB
      setRequireAuthModal(true)
      setPendingUpload(true)
      return
    }
    onFiles?.(stagedFiles)
    // show spinner and hide files while processing
    setLoading(true)
    setShowFiles(false)
    await uploadFilesToServer(stagedFiles)
    setStagedFiles([])
    // processing finished: hide spinner, show files
    setLoading(false)
    setShowFiles(true)
  }

  // Click wrapper: allow opening auth modal when over size instead of hard-disabling the button
  const handleConfirmClick = async () => {
    const total = getTotalBytes()
    if (total > MAX_SIZE && !isLoggedIn()) {
      setRequireAuthModal(true)
      setPendingUpload(true)
      return
    }
    await confirmUpload()
  }

  const finishAuthAndContinue = async () => {
    setRequireAuthModal(false)
    setAuthLoading(false)
    // if user intended to upload, continue
    if (pendingUpload) {
      setPendingUpload(false)
      // small delay to ensure modal state cleared
      setTimeout(() => confirmUpload(), 150)
    }
  }

  const handleAuthSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setAuthError(null)
    setAuthLoading(true)
    // This example uses a simple client-side stub. Replace with real API calls.
    try {
      // simulate network
      await new Promise((r) => setTimeout(r, 700))
      // set a token to mark user as logged in
      localStorage.setItem('token', 'demo-token')
      try {
        // also set a cookie so server-side endpoints can read authentication
        document.cookie = `token=demo-token; path=/; max-age=${60 * 60 * 24 * 7}` // 7 days
      } catch (e) {
        // ignore cookie issues (e.g., strict environments)
      }
      finishAuthAndContinue()
    } catch (err) {
      setAuthError('Authentication failed')
      setAuthLoading(false)
    }
  }

  useEffect(() => {
    return () => {
      previews.forEach((p) => URL.revokeObjectURL(p.url))
    }
  }, [previews])

  return (
    <div className="p-6">
      <div className="relative flex items-center justify-center w-full h-full">
        {/* Center control: shown inside Hero spinner */}
        {!panelOpen && (
           <div className="relative group flex items-center justify-center w-full h-full">
    <div
      role="button"
      tabIndex={0}
      onClick={() => {
        setActiveTab("link");
        setPanelOpen(true);
      }}
      className="relative group flex items-center justify-center w-full h-full cursor-pointer"
    >
      <span className="absolute inset-0 flex items-center justify-center text-orange-300 font-semibold transition-opacity duration-150 group-hover:opacity-0 mt-19 text-2xl">
        Start
      </span>

      <span className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-150 group-hover:opacity-100">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-15 h-15 text-orange-300 mt-38"
        >
          <path d="M19 18a4 4 0 0 0-.97-7.88A6 6 0 0 0 6.24 9.2 4.5 4.5 0 0 0 6.5 18H10v-3.59L8.7 15.7a1 1 0 1 1-1.4-1.4l3-3a1 1 0 0 1 1.4 0l3 3a1 1 0 1 1-1.4 1.4L12 14.41V18h7Z" />
        </svg>
      </span>
    </div>
  </div>
)}

        {/* Panel: fixed modal overlay centered on viewport */}

        {/* Panel: Static layout when open */}
        {panelOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 md:p-8 overflow-y-auto animate-in fade-in duration-300">
           
            <div
              className="relative w-full max-w-[1000px] flex flex-row flex-wrap justify-center items-start gap-8"
            >
              <button
                onClick={() => setPanelOpen(false)}
                className="absolute -top-10 right-2 p-2 text-white/60 hover:text-white transition-colors bg-white/10 rounded-full md:bg-transparent"
                title="Close"
              >
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
              <style>{`
                .uploader-scroll::-webkit-scrollbar {
                  width: 6px;
                }
                .uploader-scroll {
                  scrollbar-width: thin;
                  scrollbar-color: #cbd5e1 transparent;
                }
                .uploader-scroll::-webkit-scrollbar-track {
                  background: transparent;
                }
                .uploader-scroll::-webkit-scrollbar-thumb {
                  background: #cbd5e1;
                  border-radius: 10px;
                }
                .uploader-scroll::-webkit-scrollbar-thumb:hover {
                  background: #94a3b8;
                }
              `}</style>

              {/* LEFT CARD: Form & Tabs */}
              <div className="relative bg-white shadow-[0_30px_60px_-12px_rgba(0,0,0,0.25)] rounded-3xl w-full sm:w-[380px] lg:w-[420px] flex flex-col overflow-hidden h-[560px] md:h-[650px] max-h-[calc(100vh-100px)] animate-in slide-in-from-left-8 duration-700">
                {/* Tabs */}
              

                <div className="p-6 flex-1 flex flex-col">
                    <div className="space-y-4 flex-1">
                      <div className="space-y-4">
                        {activeTab === 'send' && (
                          <>
                            <div className="flex flex-col gap-1.5">
                              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Email to</label>
                              <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Your recipient's email"
                                className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all"
                              />
                            </div>
                            <div className="flex flex-col gap-1.5">
                              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Subject</label>
                              <input
                                type="text"
                                value={subject}
                                onChange={(e) => setSubject(e.target.value)}
                                placeholder="What's this about?"
                                className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all"
                              />
                            </div>
                          </>
                        )}
                        
                        <div className="flex flex-col gap-1.5">
                          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Password (Optional)</label>
                          <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Set a password to protect your files"
                            className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all"
                          />
                        </div>
                      </div>

                    {/* Icon Bar */}
                    <div className="flex items-center justify-between py-2 border-t border-slate-100 pt-4 mt-2">
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    onClick={handleConfirmClick}
                    className={`w-full mt-6 ${getTotalBytes() > MAX_SIZE && !isLoggedIn() ? 'bg-gray-300' : 'bg-indigo-600 hover:bg-indigo-700'} text-white font-bold py-4 rounded-lg shadow-lg hover:shadow-indigo-500/30 transition-all flex items-center justify-center gap-2`}
                  >
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      activeTab === 'send' ? 'Transfer' : 'Get a link'
                    )}
                  </button>
                </div>
              </div>

              {/* RIGHT CARD: List & Drop Zones */}
              <div className="bg-white shadow-[0_30px_60px_-12px_rgba(0,0,0,0.25)] rounded-3xl w-full sm:w-[420px] lg:w-[480px] flex flex-col overflow-hidden h-[560px] md:h-[650px] max-h-[calc(100vh-100px)] animate-in slide-in-from-right-8 duration-700">
                {/* Top Drop Zones */}
                <div className="p-6 flex flex-row flex-nowrap gap-4 border-b border-slate-100">
                  <button
                    onClick={() => openFileDialog()}
                    className="flex-1 group flex flex-col items-center justify-center p-4 border-2 border-dashed border-slate-200 rounded-xl hover:border-indigo-400 hover:bg-indigo-50/50 transition-all gap-3"
                  >
                    <div className="w-12 h-12 bg-indigo-50 text-indigo-500 rounded-full flex items-center justify-center group-hover:bg-indigo-100 group-hover:scale-110 transition-all">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                    </div>
                    <span className="text-xs font-bold text-slate-700">Add more files</span>
                  </button>
                  <button
                    onClick={() => openFolderDialog()}
                    className="flex-1 group flex flex-col items-center justify-center p-4 border-2 border-dashed border-slate-200 rounded-xl hover:border-indigo-400 hover:bg-indigo-50/50 transition-all gap-3"
                  >
                    <div className="w-12 h-12 bg-indigo-50 text-indigo-500 rounded-full flex items-center justify-center group-hover:bg-indigo-100 group-hover:scale-110 transition-all">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    </div>
                    <span className="text-xs font-bold text-slate-700">Add folders</span>
                  </button>
                </div>

                <div className="flex-1 flex flex-col min-h-0">
                  <div className="p-6 pb-2 flex items-center justify-between">
                    <h3 className="text-sm font-bold text-slate-900">
                      {stagedFiles.length} files <span className="text-slate-400 font-normal">({getTotalSize()})</span>
                    </h3>
                    <button
                      onClick={() => { setPreviews([]); setStagedFiles([]); setShareUrl(null) }}
                      className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                      title="Clear all"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-4v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                  </div>

                  <div className="flex-1 overflow-y-auto uploader-scroll p-6 pt-0 space-y-2">
                    {previews.length > 0 ? (
                      previews.map((p) => (
                        <div key={p.id} className="group flex items-center justify-between p-3 bg-slate-50 border border-slate-100 rounded-xl hover:border-indigo-200 hover:bg-white hover:shadow-sm transition-all gap-4">
                          <div className="flex items-center gap-3 min-w-0 flex-1">
                            {p.file.type.startsWith("image/") ? (
                              <img src={p.url} className="w-10 h-10 object-cover rounded shadow-sm flex-shrink-0" alt="preview" />
                            ) : (
                              <div className="w-10 h-10 bg-indigo-50 flex items-center justify-center rounded-lg text-indigo-400 flex-shrink-0 group-hover:bg-indigo-100 transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                                </svg>
                              </div>
                            )}
                            <div className="flex flex-col min-w-0 flex-1">
                              <span className="text-sm font-semibold text-slate-800 truncate" title={(p as any).name ?? p.file.name}>{(p as any).name ?? p.file.name}</span>
                              <span className="text-[11px] text-slate-500 font-medium">· {formatBytes(p.file.size)}</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all translate-x-1 group-hover:translate-x-0">
                            <a href={p.url} target="_blank" rel="noreferrer" title="Preview" className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg></a>
                            <a href={p.url} download={(p as any).name ?? p.file.name} title="Download" className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg></a>
                            <button onClick={() => removeFile(p.id)} title="Delete" className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg></button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="flex flex-col items-center justify-center h-48 text-center bg-slate-50/50 border border-dashed border-slate-200 rounded-2xl p-8">
                        <div className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center text-slate-300 mb-3">
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" /></svg>
                        </div>
                        <p className="text-sm font-medium text-slate-500">No files yet.</p>
                        <p className="text-xs text-slate-400 mt-1">Drag files here or use the buttons above.</p>
                      </div>
                    )}
                  </div>

                  {/* Footer / Share Link */}
                  {showFiles && shareUrl && (
                    <div className="p-6 border-t border-slate-50 bg-indigo-50/30">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse" />
                        <p className="text-xs font-bold text-indigo-900 uppercase tracking-wider">Link is ready</p>
                      </div>
                      <div className="flex gap-2 mb-3">
                        <input
                          value={shareUrl ?? ''}
                          readOnly
                          className="flex-1 bg-white border border-indigo-100 rounded-lg px-3 py-2 text-xs text-slate-700 truncate focus:outline-none"
                        />
                        <button
                          onClick={copyLink}
                          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-4 py-2 rounded-lg text-xs transition-all shadow-sm active:scale-95"
                        >
                          Copy
                        </button>
                      </div>

                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => openDeepLink(
                            `whatsapp://send?text=${encodeURIComponent(shareUrl)}`,
                            `https://api.whatsapp.com/send?text=${encodeURIComponent(shareUrl)}`
                          )}
                          className="w-10 h-10 flex items-center justify-center bg-white border border-emerald-100 text-emerald-500 rounded-full hover:bg-emerald-500 hover:text-white transition-all shadow-sm"
                          title="Share on WhatsApp"
                        >
                          <FaWhatsapp className="w-5 h-5" />
                        </button>

                        <button
                          onClick={() => openDeepLink(
                            `fb://facewebmodal/f?href=${encodeURIComponent(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`)}`,
                            `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`
                          )}
                          className="w-10 h-10 flex items-center justify-center bg-white border border-blue-100 text-blue-600 rounded-full hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                          title="Share on Facebook"
                        >
                          <FaFacebook className="w-5 h-5" />
                        </button>

                        <button
                          onClick={() => openDeepLink(
                            `twitter://post?message=${encodeURIComponent(shareUrl)}`,
                            `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}`
                          )}
                          className="w-10 h-10 flex items-center justify-center bg-white border border-slate-100 text-slate-900 rounded-full hover:bg-slate-900 hover:text-white transition-all shadow-sm"
                          title="Share on X (Twitter)"
                        >
                          <FaTwitter className="w-5 h-5" />
                        </button>
                        
                        <button
                          onClick={shareToInstagram}
                          className="w-10 h-10 flex items-center justify-center bg-white border border-pink-100 text-pink-600 rounded-full hover:bg-pink-600 hover:text-white transition-all shadow-sm"
                          title="Share on Instagram (copies link and opens Instagram)"
                        >
                          <FaInstagram className="w-5 h-5" />
                        </button>

                        <button
                          onClick={() => openDeepLink(
                            `tg://msg?text=${encodeURIComponent(shareUrl)}`,
                            `https://telegram.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent('Check out these files I shared with you!')}`
                          )}
                          className="w-10 h-10 flex items-center justify-center bg-white border border-sky-100 text-sky-600 rounded-full hover:bg-sky-600 hover:text-white transition-all shadow-sm"
                          title="Share on Telegram"
                        >
                          <FaTelegram className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Hidden Inputs */}
      {requireAuthModal && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="flex gap-2">
                <button
                  onClick={() => setAuthTab('login')}
                  className={`px-3 py-1 rounded-md ${authTab === 'login' ? 'bg-indigo-600 text-white' : 'bg-transparent text-slate-700'}`}
                >
                  Sign in
                </button>
                <button
                  onClick={() => setAuthTab('register')}
                  className={`px-3 py-1 rounded-md ${authTab === 'register' ? 'bg-indigo-600 text-white' : 'bg-transparent text-slate-700'}`}
                >
                  Register
                </button>
              </div>
              <button onClick={() => { setRequireAuthModal(false); setPendingUpload(false) }} className="text-slate-500">Close</button>
            </div>

            <p className="text-sm text-slate-600 mb-4">Files larger than 100 MB require an account. Sign in or register to continue sharing large files.</p>

            <form onSubmit={handleAuthSubmit} className="space-y-3">
              {authTab === 'register' && (
                <input required name="name" placeholder="Full name" className="w-full px-3 py-2 border rounded-lg" />
              )}

              <input required name="email" type="email" placeholder="Email" className="w-full px-3 py-2 border rounded-lg" />
              <input required name="password" type="password" placeholder="Password" className="w-full px-3 py-2 border rounded-lg" />

              {authError && <p className="text-xs text-red-500">{authError}</p>}

              <div className="flex gap-3 justify-end">
                <button type="button" onClick={() => { setRequireAuthModal(false); setPendingUpload(false) }} className="px-4 py-2 bg-gray-100 rounded-lg">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-lg" disabled={authLoading}>
                  {authLoading ? 'Signing...' : (authTab === 'login' ? 'Sign in' : 'Register')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />

      <input
        ref={folderInputRef}
        type="file"
        multiple
        className="hidden"
        //@ts-ignore
        webkitdirectory="true"
        //@ts-ignore
        directory="true"
        onChange={(e) => handleFiles(e.target.files)}
      />

      {/* Panel rendered absolutely above; duplicate static panel removed. */}
    </div>
  )
}

export default FileUploader