export type RetryOptions = {
  attempts?: number
  baseDelayMs?: number
  maxDelayMs?: number
}

const sleep = (milliseconds: number) =>
  new Promise<void>((resolve) => setTimeout(resolve, milliseconds))

export async function withRetry<T>(
  operation: (attempt: number) => Promise<T>,
  options: RetryOptions = {}
) {
  const attempts = Math.max(1, options.attempts ?? 3)
  const baseDelayMs = options.baseDelayMs ?? 100
  const maxDelayMs = options.maxDelayMs ?? 2_000

  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      return await operation(attempt)
    } catch (error) {
      if (attempt === attempts) throw error

      const exponentialDelay = Math.min(
        maxDelayMs,
        baseDelayMs * 2 ** (attempt - 1)
      )
      const jitter = Math.floor(Math.random() * Math.max(1, exponentialDelay / 2))
      await sleep(exponentialDelay / 2 + jitter)
    }
  }

  throw new Error("Retry operation did not complete")
}
