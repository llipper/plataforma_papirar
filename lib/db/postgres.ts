import fs from "node:fs"
import { AsyncLocalStorage } from "node:async_hooks"
import path from "node:path"
import { Pool, type PoolClient, type QueryResultRow } from "pg"

let pool: Pool | undefined

export type DatabaseRequestContext = {
  userId: string
  role: "admin" | "moderator" | "user"
}

const databaseRequestContext = new AsyncLocalStorage<DatabaseRequestContext>()

export function runWithDatabaseRequestContext<T>(
  context: DatabaseRequestContext,
  callback: () => Promise<T>
) {
  return databaseRequestContext.run(context, callback)
}

export async function withDatabaseTransaction<T>(
  callback: (client: PoolClient) => Promise<T>
) {
  const context = databaseRequestContext.getStore()
  const client = await getPool().connect()

  try {
    await client.query("begin")

    if (context) {
      await client.query(
        "select set_config('app.user_id', $1, true), set_config('app.role', $2, true), set_config('app.actor_id', $1, true)",
        [context.userId, context.role]
      )
    }

    const result = await callback(client)
    await client.query("commit")
    return result
  } catch (error) {
    await client.query("rollback").catch(() => undefined)
    throw error
  } finally {
    client.release()
  }
}

function readInfraEnv() {
  const envPath = path.join(process.cwd(), "papirar-infra", ".env")
  if (!fs.existsSync(envPath)) return {}

  return Object.fromEntries(
    fs.readFileSync(envPath, "utf8")
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith("#") && line.includes("="))
      .map((line) => {
        const index = line.indexOf("=")
        return [line.slice(0, index), line.slice(index + 1)]
      })
  )
}

function getConnectionString() {
  if (process.env.DATABASE_URL) return process.env.DATABASE_URL

  const infraEnv = readInfraEnv()
  const user = process.env.POSTGRES_USER ?? infraEnv.POSTGRES_USER
  const password = process.env.POSTGRES_PASSWORD ?? infraEnv.POSTGRES_PASSWORD
  const database = process.env.POSTGRES_DB ?? infraEnv.POSTGRES_DB
  const host = process.env.POSTGRES_HOST ?? "127.0.0.1"
  const port =
    process.env.POSTGRES_PORT ??
    infraEnv.PGBOUNCER_PORT ??
    infraEnv.POSTGRES_PORT ??
    "5432"

  if (!user || !password || !database) {
    throw new Error("DATABASE_URL não configurada e papirar-infra/.env incompleto.")
  }

  return `postgres://${encodeURIComponent(user)}:${encodeURIComponent(password)}@${host}:${port}/${encodeURIComponent(database)}`
}

export function getPool() {
  if (!pool) {
    pool = new Pool({
      connectionString: getConnectionString(),
      max: 10,
      idleTimeoutMillis: 30_000,
      connectionTimeoutMillis: 5_000,
    })
  }

  return pool
}

export async function query<T extends QueryResultRow>(text: string, values: unknown[] = []) {
  const context = databaseRequestContext.getStore()

  if (!context) {
    return getPool().query<T>(text, values)
  }

  const client = await getPool().connect()

  try {
    await client.query("begin")
    await client.query(
      "select set_config('app.user_id', $1, true), set_config('app.role', $2, true), set_config('app.actor_id', $1, true)",
      [context.userId, context.role]
    )

    const result = await client.query<T>(text, values)
    await client.query("commit")
    return result
  } catch (error) {
    await client.query("rollback").catch(() => undefined)
    throw error
  } finally {
    client.release()
  }
}
