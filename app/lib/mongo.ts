declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined
}
// Lazy-load MongoDB driver at runtime to avoid build-time failures when package missing
let clientPromise: Promise<any> | undefined

export async function getDb() {
  const uri = process.env.MONGODB_URI || process.env.MONGO_URL || process.env.MONGO || process.env.MONGO_URI
  if (!uri) {
    throw new Error('Missing MONGODB_URI environment variable')
  }

  if (!clientPromise) {
    // dynamic import so bundlers don't require 'mongodb' at build time
    const { MongoClient } = await import('mongodb')
    const client = new MongoClient(uri)
    clientPromise = client.connect()
  }

  const client = await clientPromise
  const dbName = process.env.MONGODB_DB || process.env.MONGO_DB || 'ft'
  return client.db(dbName)
}
