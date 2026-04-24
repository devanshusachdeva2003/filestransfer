import crypto from 'crypto'
import { getDb } from './mongo'

const SECRET = process.env.AUTH_SECRET || 'dev-secret'

function hashPassword(password: string, salt: string) {
  return crypto.scryptSync(password, salt, 64).toString('hex')
}

export async function createUser(name: string, email: string, password: string) {
  const db = await getDb()
  const users = db.collection('users')
  const normalized = email.toLowerCase()
  const exists = await users.findOne({ email: normalized })
  if (exists) throw new Error('User already exists')
  const salt = crypto.randomBytes(12).toString('hex')
  const derived = hashPassword(password, salt)
  const doc = { name, email: normalized, salt, derived, createdAt: new Date() }
  await users.insertOne(doc)
  return { name, email: normalized }
}

export async function verifyUser(email: string, password: string) {
  const db = await getDb()
  const users = db.collection('users')
  const normalized = email.toLowerCase()
  const u = await users.findOne<{ salt: string; derived: string } & { name?: string }>( { email: normalized } )
  if (!u) return false
  const check = hashPassword(password, u.salt)
  try {
    return crypto.timingSafeEqual(Buffer.from(check, 'hex'), Buffer.from(u.derived, 'hex'))
  } catch (e) {
    return false
  }
}

export function createToken(email: string) {
  const payload = JSON.stringify({ email, iat: Date.now() })
  const payloadB64 = Buffer.from(payload).toString('base64url')
  const sig = crypto.createHmac('sha256', SECRET).update(payloadB64).digest('base64url')
  return `${payloadB64}.${sig}`
}

export function verifyToken(token: string | null | undefined) {
  try {
    if (!token) return null
    const [payloadB64, sig] = token.split('.')
    if (!payloadB64 || !sig) return null
    const expected = crypto.createHmac('sha256', SECRET).update(payloadB64).digest('base64url')
    if (!crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(sig))) return null
    const payload = JSON.parse(Buffer.from(payloadB64, 'base64').toString('utf8'))
    return payload.email as string
  } catch (e) {
    return null
  }
}

export async function getUser(email: string) {
  const db = await getDb()
  const users = db.collection('users')
  const u = await users.findOne({ email: email.toLowerCase() }, { projection: { derived: 0, salt: 0 } })
  return u || null
}
