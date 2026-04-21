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

    // 📁 Folder where files will be stored
    const uploadDir = path.join(process.cwd(), "public/uploads")

    // Create folder if not exists
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true })
    }

    const uploadedFiles: string[] = []

    for (const file of files) {
      const bytes = await file.arrayBuffer()
      const buffer = Buffer.from(bytes)

      // Upload to Cloudinary
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

      // Store Secure Cloud URL
      uploadedFiles.push(result.secure_url)
      console.log("Cloudinary Upload Successful:", result.secure_url)
    }

    // If requested, create a public HTML share page that lists links to uploaded files
    const password = formData.get('password') as string | null
    const email = formData.get('email') as string | null
    const subject = formData.get('subject') as string | null

    let sharePath: string | null = null
    if (createShare && uploadedFiles.length) {
      const css = `
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        body { font-family: 'Inter', sans-serif; background: #f8fafc; margin: 0; padding: 0; color: #1e293b; }
        .navbar { background: #4f46e5; color: white; padding: 0 40px; height: 70px; display: flex; align-items: center; justify-content: space-between; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1); }
        .logo { font-size: 24px; font-weight: 800; font-style: italic; letter-spacing: -1px; }
        .nav-links { display: none; gap: 24px; align-items: center; }
        @media (min-width: 1024px) { .nav-links { display: flex; } }
        .nav-link { color: rgba(255,255,255,0.8); text-decoration: none; font-size: 14px; font-weight: 500; transition: color 0.2s; }
        .nav-link:hover { color: white; }
        .auth-buttons { display: flex; gap: 12px; }
        .btn { padding: 8px 18px; border-radius: 8px; font-size: 14px; font-weight: 600; cursor: pointer; text-decoration: none; transition: all 0.2s; border: none; }
        .btn-white { background: white; color: #1e293b; }
        .btn-outline { background: rgba(255,255,255,0.1); color: white; border: 1px solid rgba(255,255,255,0.2); }
        .btn-primary { background: #4f46e5; color: white; }
        
        .hero { padding: 60px 20px; text-align: center; }
        .container { max-width: 1000px; margin: 0 auto; padding: 20px; }
        .card { background: white; border-radius: 12px; box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1); overflow: hidden; }
        .file-row { display: flex; align-items: center; justify-content: space-between; padding: 16px 24px; border-bottom: 1px solid #f1f5f9; transition: background 0.2s; }
        .file-row:last-child { border-bottom: none; }
        .file-row:hover { background: #f8fafc; }
        .file-info { display: flex; align-items: center; gap: 16px; flex: 1; min-w-0; }
        .file-icon { width: 40px; height: 40px; background: #eff6ff; color: #3b82f6; border-radius: 8px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .file-details { display: flex; flex-col; min-w-0; }
        .file-name { font-weight: 600; color: #0f172a; font-size: 15px; margin: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .file-size { font-size: 12px; color: #64748b; margin: 2px 0 0; }
        .download-btn { background: #6366f1; color: white; padding: 8px 20px; border-radius: 6px; font-weight: 600; font-size: 14px; text-decoration: none; transition: background 0.2s; }
        .download-btn:hover { background: #4f46e5; }
        
        .login-container { display: flex; align-items: center; justify-content: center; min-height: calc(100vh - 70px); padding: 20px; }
        .login-card { background: white; padding: 40px; border-radius: 24px; box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1); width: 100%; max-width: 400px; text-align: center; }
        .login-card h2 { margin: 0 0 12px; font-size: 24px; }
        .login-card p { color: #64748b; margin-bottom: 24px; font-size: 14px; }
        .input-group { position: relative; margin-bottom: 20px; }
        .input { width: 100%; padding: 12px 16px; border: 2px solid #e2e8f0; border-radius: 12px; font-size: 16px; box-sizing: border-box; transition: all 0.2s; }
        .input:focus { outline: none; border-color: #6366f1; box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.1); }
        .submit-btn { width: 100%; background: #6366f1; color: white; padding: 12px; border-radius: 12px; font-weight: 700; font-size: 16px; border: none; cursor: pointer; transition: all 0.2s; }
        .submit-btn:hover { background: #4f46e5; transform: translateY(-1px); }
        .hidden { display: none; }
        .error { color: #ef4444; font-size: 13px; margin-top: 12px; display: none; }
        .batch-btn { background: #4f46e5; color: white; padding: 14px 32px; border-radius: 12px; font-weight: 700; font-size: 16px; margin-top: 24px; border: none; cursor: pointer; display: inline-block; text-decoration: none; transition: all 0.2s; }
        .batch-btn:hover { background: #4338ca; transform: scale(1.05); }
      `;

      const navHtml = `
        <nav class="navbar">
          <div class="logo">AD Transfer</div>
          <div class="nav-links">
            <a href="#" class="nav-link">Discover</a>
            <a href="#" class="nav-link">Offers and prices</a>
            <a href="#" class="nav-link">Apps</a>
            <a href="#" class="nav-link">Developers</a>
            <a href="#" class="nav-link">Resources</a>
          </div>
          <div class="auth-buttons">
            <a href="#" class="btn btn-white">Sign in</a>
            <a href="#" class="btn btn-outline">Try for free</a>
          </div>
        </nav>
      `;

      const parts: string[] = []
      
      if (password) {
        // PASSWORD PROTECTED VERSION
        const fileListJson = JSON.stringify(uploadedFiles)
        parts.push('<!doctype html><html><head><meta charset="utf-8"><title>Shared files (Protected)</title>')
        parts.push('<meta name="viewport" content="width=device-width,initial-scale=1"/>')
        parts.push(`<style>${css}</style>`)
        parts.push('</head><body>')
        parts.push(navHtml)
        parts.push('<div class="login-container">')
        parts.push('<div class="login-card" id="login-card">')
        parts.push('<h2>Protected Share</h2>')
        parts.push('<p>This link is password protected. Enter the password to view and download files.</p>')
        parts.push('<div class="input-group">')
        parts.push('<input type="password" id="pwd" class="input" placeholder="Enter password" onkeydown="if(event.key===\'Enter\')unlock()">')
        parts.push('</div>')
        parts.push('<button class="submit-btn" onclick="unlock()">View Files</button>')
        parts.push('<p id="err" class="error">Incorrect password. Please try again.</p>')
        parts.push('</div>')
        parts.push('<div class="container hidden" id="files-card">')
        parts.push('<div class="hero" style="padding-top:0"><h2>Your files are ready!</h2><button onclick="downloadAll()" class="batch-btn">Download ALL files</button></div>')
        parts.push('<div class="card"><div id="file-list"></div></div>')
        parts.push('</div>')
        parts.push('</div>')
        
        const encrypt = (text: string, key: string) => {
            return btoa(text.split('').map((char, i) => 
                String.fromCharCode(char.charCodeAt(0) ^ key.charCodeAt(i % key.length))
            ).join(''));
        };
        const encryptedData = encrypt(fileListJson, password);
        
        parts.push('<script>')
        parts.push(`const data = "${encryptedData}";`)
        parts.push('function decrypt(encoded, key) {')
        parts.push('  try {')
        parts.push('    const decoded = atob(encoded);')
        parts.push('    return decoded.split("").map((char, i) => String.fromCharCode(char.charCodeAt(0) ^ key.charCodeAt(i % key.length))).join("");')
        parts.push('  } catch(e) { return null; }')
        parts.push('}')
        parts.push('let currentFiles = [];')
        parts.push('function unlock() {')
        parts.push('  const pwd = document.getElementById("pwd").value;')
        parts.push('  const decrypted = decrypt(data, pwd);')
        parts.push('  try {')
        parts.push('    const files = JSON.parse(decrypted);')
        parts.push('    if (!Array.isArray(files)) throw new Error();')
        parts.push('    currentFiles = files;')
        parts.push('    const list = document.getElementById("file-list");')
        parts.push('    files.forEach(f => {')
        parts.push('      const name = f.split("/").pop();')
        parts.push('      const row = document.createElement("div");')
        parts.push('      row.className = "file-row";')
        parts.push('      row.innerHTML = `')
        parts.push('        <div class="file-info">')
        parts.push('          <div class="file-icon"><svg width="20" height="20" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clip-rule="evenodd"></path></svg></div>')
        parts.push('          <div class="file-details"><div class="file-name">${name}</div></div>')
        parts.push('        </div>')
        parts.push('        <a href="${f}" download class="download-btn file-link">Download</a>')
        parts.push('      `;')
        parts.push('      list.appendChild(row);')
        parts.push('    });')
        parts.push('    document.getElementById("login-card").classList.add("hidden");')
        parts.push('    document.getElementById("files-card").classList.remove("hidden");')
        parts.push('    document.querySelector(".login-container").style.alignItems = "flex-start";')
        parts.push('  } catch(e) {')
        parts.push('    document.getElementById("err").style.display = "block";')
        parts.push('  }')
        parts.push('}')
        parts.push('async function downloadAll(){')
        parts.push('  const links = Array.from(document.querySelectorAll(".file-link")).map(a=>({url:a.href,name:a.getAttribute("download")||a.textContent.trim()}));')
        parts.push('  for(const f of links){')
        parts.push('    try{')
        parts.push('      const resp = await fetch(f.url); const blob = await resp.blob(); const u = URL.createObjectURL(blob); const a = document.createElement("a"); a.href = u; a.download = decodeURIComponent(f.name||""); document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(u);')
        parts.push('      await new Promise(r => setTimeout(r, 300));')
        parts.push('    }catch(e){console.error(e)}')
        parts.push('  }')
        parts.push('}')
        parts.push('</script>')
        parts.push('</body></html>')
      } else {
        // STANDARD VERSION
        parts.push('<!doctype html><html><head><meta charset="utf-8"><title>Shared files</title>')
        parts.push('<meta name="viewport" content="width=device-width,initial-scale=1"/>')
        parts.push(`<style>${css}</style>`)
        parts.push('</head><body>')
        parts.push(navHtml)
        parts.push('<div class="hero">')
        parts.push('<h2>Your files are ready!</h2>')
        parts.push('<button onclick="downloadAll()" class="batch-btn">Download ALL files</button>')
        parts.push('</div>')
        parts.push('<div class="container">')
        parts.push('<div class="card">')
        for (const f of uploadedFiles) {
          const name = f.split('/').pop() || f
          parts.push('<div class="file-row">')
          parts.push('<div class="file-info">')
          parts.push('<div class="file-icon"><svg width="20" height="20" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clip-rule="evenodd"></path></svg></div>')
          parts.push('<div class="file-details">')
          parts.push(`<div class="file-name">${name}</div>`)
          parts.push('</div>')
          parts.push('</div>')
          parts.push(`<a class="file-link download-btn" href="${f}" download="${encodeURIComponent(name)}">Download</a>`)
          parts.push('</div>')
        }
        parts.push('</div>')
        parts.push('</div>')
        parts.push('<script>')
        parts.push('async function downloadAll(){')
        parts.push('  const links = Array.from(document.querySelectorAll(".file-link")).map(a=>({url:a.href,name:a.getAttribute("download")||a.textContent.trim()}));')
        parts.push('  for(const f of links){')
        parts.push('    try{')
        parts.push('      const resp = await fetch(f.url); const blob = await resp.blob(); const u = URL.createObjectURL(blob); const a = document.createElement("a"); a.href = u; a.download = decodeURIComponent(f.name||""); document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(u);')
        parts.push('      await new Promise(r => setTimeout(r, 300));')
        parts.push('    }catch(e){console.error(e)}')
        parts.push('  }')
        parts.push('}')
        parts.push('</script>')
        parts.push('</body></html>')
      }

      const shareHtml = parts.join('\n')
      const shareName = `share-${Date.now()}.html`
      const shareFilePath = path.join(uploadDir, shareName)
      fs.writeFileSync(shareFilePath, shareHtml, 'utf8')
      sharePath = `/uploads/${shareName}`
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