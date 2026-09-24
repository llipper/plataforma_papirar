import { Redis } from "ioredis"

import { withRetry } from "./retry.js"

export function createRedisClient() {
  const client = new Redis({
    host: process.env.REDIS_HOST ?? "127.0.0.1",
    port: Number(process.env.REDIS_PORT ?? 6379),
    password: process.env.REDIS_PASSWORD,
    lazyConnect: true,
    maxRetriesPerRequest: 1,
    enableOfflineQueue: false,
  })

  return client
}

let connecting: Promise<void> | undefined

export async function connectRedis(client: Redis) {
  if (client.status === "ready") return
  if (connecting) return connecting

  connecting = withRetry(async () => {
    if (client.status === "ready") return
    if (client.status === "wait") await client.connect()
    await client.ping()
  }).finally(() => {
    connecting = undefined
  })

  return connecting
}

export async function getJsonCache<T>(client: Redis, key: string): Promise<T | null> {
  try {
    await connectRedis(client)
    const value = await client.get(key)
    return value ? (JSON.parse(value) as T) : null
  } catch (error) {
    console.warn("[api] redis read failed; using database", { key, error })
    return null
  }
}

export async function setJsonCache(client: Redis, key: string, value: unknown, ttlSeconds: number) {
  try {
    await connectRedis(client)
    await client.set(key, JSON.stringify(value), "EX", ttlSeconds)
  } catch (error) {
    console.warn("[api] redis write failed; continuing without cache", { key, error })
  }
}

export async function closeRedis(client: Redis) {
  if (client.status === "end") return
  await client.quit()
}
