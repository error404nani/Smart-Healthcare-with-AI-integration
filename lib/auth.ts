import type { NextRequest } from 'next/server'
import { cookies } from 'next/headers'
import { randomUUID } from 'crypto'
import bcrypt from 'bcryptjs'
import { ObjectId } from 'mongodb'
import { getDb } from './mongodb'

const SESSION_COOKIE_NAME = 'sessionToken'

// In-memory session cache to avoid hitting MongoDB on every request
// Cleared automatically after 30 minutes (TTL)
const sessionCache = new Map<string, { user: AuthUser; expiresAt: number }>()
const SESSION_CACHE_TTL_MS = 30 * 60 * 1000 // 30 minutes

export type UserRole = 'patient' | 'admin' | 'doctor' | 'pharmacy' | 'clinic'

export interface AuthUser {
  id: string
  email: string
  role: UserRole
}

export async function createUser(email: string, password: string, role: UserRole = 'patient'): Promise<AuthUser> {
  const db = await getDb()
  const existing = await db.collection('users').findOne({ email })
  if (existing) {
    throw new Error('User with this email already exists')
  }

  const passwordHash = await bcrypt.hash(password, 10)
  const result = await db.collection('users').insertOne({
    email,
    passwordHash,
    role,
    createdAt: new Date(),
  })

  return { id: result.insertedId.toString(), email, role }
}

export async function verifyUser(email: string, password: string): Promise<AuthUser | null> {
  const db = await getDb()
  const user = await db.collection('users').findOne<{ _id: ObjectId; email: string; passwordHash: string; role: UserRole }>({ email })
  if (!user) return null

  const isValid = await bcrypt.compare(password, user.passwordHash)
  if (!isValid) return null

  return { id: user._id.toString(), email: user.email, role: user.role || 'patient' }
}

export async function createSession(user: AuthUser) {
  const db = await getDb()
  const token = randomUUID()

  await db.collection('sessions').insertOne({
    token,
    userId: new ObjectId(user.id),
    createdAt: new Date(),
  })

  const cookieStore = await cookies()
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
  })
}

export async function destroySession() {
  const cookieStore = await cookies()
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value

  if (token) {
    const db = await getDb()
    await db.collection('sessions').deleteOne({ token })
  }

  cookieStore.set(SESSION_COOKIE_NAME, '', {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  })
}

export async function getUserFromRequest(req: NextRequest): Promise<AuthUser | null> {
  const token = req.cookies.get(SESSION_COOKIE_NAME)?.value
  if (!token) return null

  // Check in-memory cache first to avoid MongoDB round-trips
  const cached = sessionCache.get(token)
  if (cached && cached.expiresAt > Date.now()) {
    return cached.user
  }
  // Clean up expired entry if present
  if (cached) sessionCache.delete(token)

  const db = await getDb()
  const session = await db.collection('sessions').findOne<{ token: string; userId: ObjectId }>({ token })
  if (!session) return null

  const user = await db.collection('users').findOne<{ _id: ObjectId; email: string; role: UserRole }>({ _id: session.userId })
  if (!user) return null

  const authUser: AuthUser = { id: user._id.toString(), email: user.email, role: user.role || 'patient' }

  // Store in cache for future requests
  sessionCache.set(token, { user: authUser, expiresAt: Date.now() + SESSION_CACHE_TTL_MS })

  return authUser
}

