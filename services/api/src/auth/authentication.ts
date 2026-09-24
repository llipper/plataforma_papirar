import {
  applicationDefault,
  cert,
  getApps,
  initializeApp,
} from "firebase-admin/app"
import { getAuth, type DecodedIdToken } from "firebase-admin/auth"
import { readFileSync } from "node:fs"
import type { IncomingHttpHeaders } from "node:http"
import { resolve } from "node:path"
import type { Pool } from "pg"

export class AuthError extends Error {
  constructor(
    public readonly status: 401 | 403,
    public readonly code: "unauthorized" | "forbidden",
    message: string
  ) {
    super(message)
  }
}

export type AuthContext = {
  firebase: DecodedIdToken
  user: {
    id: string
    email: string
    displayName: string | null
    isActive: boolean
  }
  roles: string[]
}

function firebaseAuth() {
  if (getApps().length === 0) {
    const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_JSON
    const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH

    if (serviceAccount) {
      initializeApp({ credential: cert(JSON.parse(serviceAccount)) })
    } else if (serviceAccountPath) {
      const file = readFileSync(resolve(process.cwd(), serviceAccountPath), "utf8")
      initializeApp({ credential: cert(JSON.parse(file)) })
    } else if (process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY) {
      initializeApp({
        credential: cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
        }),
      })
    } else {
      initializeApp({ credential: applicationDefault() })
    }
  }

  return getAuth()
}

function bearerToken(headers: IncomingHttpHeaders) {
  const value = headers.authorization
  if (!value?.startsWith("Bearer ")) return null
  const token = value.slice("Bearer ".length).trim()
  return token.length > 0 ? token : null
}

export async function authenticateRequest(
  headers: IncomingHttpHeaders,
  pool: Pool
): Promise<AuthContext> {
  const token = bearerToken(headers)
  if (!token) {
    throw new AuthError(401, "unauthorized", "Bearer token is required")
  }

  let decoded: DecodedIdToken
  try {
    decoded = await firebaseAuth().verifyIdToken(token, true)
  } catch {
    throw new AuthError(401, "unauthorized", "Invalid or revoked token")
  }

  const email = decoded.email?.trim().toLowerCase()
  if (!email) {
    throw new AuthError(401, "unauthorized", "Authenticated email is required")
  }

  const client = await pool.connect()
  try {
    await client.query("begin")
    const result = await client.query<{
      id: string
      email: string
      display_name: string | null
      is_active: boolean
    }>(
      `select id, email, display_name, is_active
       from app_sync_authenticated_user($1, $2, $3, $4)`,
      [decoded.uid, email, decoded.name ?? null, decoded.email_verified === true]
    )

    const user = result.rows[0]
    if (!user || !user.is_active) {
      await client.query("rollback")
      throw new AuthError(403, "forbidden", "User is inactive")
    }

    await client.query("select set_config('app.user_id', $1, true)", [user.id])
    const roles = await client.query<{ role: string }>(
      "select role::text from user_roles where user_id = $1",
      [user.id]
    )
    await client.query("commit")

    return {
      firebase: decoded,
      user: {
        id: user.id,
        email: user.email,
        displayName: user.display_name,
        isActive: user.is_active,
      },
      roles: roles.rows.map((row) => row.role),
    }
  } catch (error) {
    await client.query("rollback").catch(() => undefined)
    throw error
  } finally {
    client.release()
  }
}

export function requireRole(context: AuthContext, allowedRoles: string[]) {
  if (!context.roles.some((role) => allowedRoles.includes(role))) {
    throw new AuthError(403, "forbidden", "Insufficient role")
  }
}
