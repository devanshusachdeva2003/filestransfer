// Simple IndexedDB helper to persist selected files (blobs) across page reloads
const DB_NAME = 'ad-transfer-files'
const STORE_NAME = 'files'

function openDb() {
  return new Promise<IDBDatabase>((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1)
    req.onupgradeneeded = () => {
      const db = req.result
      if (!db.objectStoreNames.contains(STORE_NAME)) db.createObjectStore(STORE_NAME, { keyPath: 'id' })
    }
    req.onsuccess = () => resolve(req.result)
    req.onerror = () => reject(req.error)
  })
}

export async function saveFiles(files: File[]) {
  const db = await openDb()
  const tx = db.transaction(STORE_NAME, 'readwrite')
  const store = tx.objectStore(STORE_NAME)
  const out: { id: string; name: string; type: string; size: number }[] = []
  for (const f of files) {
    const id = crypto.randomUUID()
    // store blob along with metadata
    // @ts-ignore
    store.put({ id, name: f.name, type: f.type, size: f.size, blob: f })
    out.push({ id, name: f.name, type: f.type, size: f.size })
  }
  await new Promise((res, rej) => { tx.oncomplete = res; tx.onerror = rej })
  db.close()
  return out
}

export async function loadAllFiles() {
  const db = await openDb()
  const tx = db.transaction(STORE_NAME, 'readonly')
  const store = tx.objectStore(STORE_NAME)
  const req = store.getAll()
  const res = await new Promise<any[]>((resolve, reject) => {
    req.onsuccess = () => resolve(req.result)
    req.onerror = () => reject(req.error)
  })
  db.close()
  // convert stored blobs back into File objects when possible
  return res.map((r) => {
    const blob = r.blob
    // If stored as File already, return as-is; else, create a File
    const file = blob instanceof File ? blob : new File([blob], r.name, { type: r.type })
    return { id: r.id, name: r.name, file }
  })
}

export async function deleteFile(id: string) {
  const db = await openDb()
  const tx = db.transaction(STORE_NAME, 'readwrite')
  const store = tx.objectStore(STORE_NAME)
  store.delete(id)
  await new Promise((res, rej) => { tx.oncomplete = res; tx.onerror = rej })
  db.close()
}

export async function clearAll() {
  const db = await openDb()
  const tx = db.transaction(STORE_NAME, 'readwrite')
  const store = tx.objectStore(STORE_NAME)
  store.clear()
  await new Promise((res, rej) => { tx.oncomplete = res; tx.onerror = rej })
  db.close()
}

export default { saveFiles, loadAllFiles, deleteFile, clearAll }
