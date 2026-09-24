import amqp, { type ConsumeMessage } from "amqplib"
import { Pool } from "pg"

import { withRetry } from "../../api/src/infrastructure/retry.js"

const queue = "papirar.events"
const deadLetterQueue = "papirar.events.dlq"
const rabbitUrl =
  process.env.RABBITMQ_URL ??
  `amqp://${encodeURIComponent(process.env.RABBITMQ_USER ?? "papirar")}:${encodeURIComponent(process.env.RABBITMQ_PASSWORD ?? "")}@${process.env.RABBITMQ_HOST ?? "127.0.0.1"}:${process.env.RABBITMQ_PORT ?? "5672"}`

let connection: Awaited<ReturnType<typeof amqp.connect>> | undefined
let channel: Awaited<ReturnType<NonNullable<typeof connection>["createChannel"]>> | undefined
let shuttingDown = false
let outboxTimer: NodeJS.Timeout | undefined
let publishingOutbox = false
const pool = new Pool({
  host: process.env.POSTGRES_HOST ?? "127.0.0.1",
  port: Number(process.env.POSTGRES_PORT ?? 5432),
  database: process.env.POSTGRES_DB ?? "papirar",
  user: process.env.POSTGRES_USER ?? "papirar",
  password: process.env.POSTGRES_PASSWORD,
  max: 10,
  idleTimeoutMillis: 30_000,
  connectionTimeoutMillis: 5_000,
})

async function processMessage(message: ConsumeMessage) {
  const payload = JSON.parse(message.content.toString()) as {
    type?: string
    answerId?: string
    questionId?: string
    questionVersionId?: string
    alternativeId?: string
    isCorrect?: boolean
    timeSeconds?: number | null
  }
  if (payload.type !== "QUESTION_ANSWERED") return
  if (!payload.answerId || !payload.questionId || !payload.questionVersionId || !payload.alternativeId) {
    throw new Error("QUESTION_ANSWERED incompleto")
  }

  const client = await pool.connect()
  try {
    await client.query("begin")
    const processed = await client.query(
      `insert into question_answer_aggregation_events (answer_id)
       values ($1)
       on conflict (answer_id) do nothing`,
      [payload.answerId]
    )
    if (processed.rowCount === 0) {
      await client.query("commit")
      return
    }

    const correct = payload.isCorrect === true ? 1 : 0
    const incorrect = payload.isCorrect === false ? 1 : 0
    const time = typeof payload.timeSeconds === "number" ? Math.max(0, payload.timeSeconds) : null
    await client.query(
      `insert into question_stats (
         question_id, total_answers, correct_answers, incorrect_answers,
         pending_review_answers, average_time_seconds
       ) values ($1, 1, $2, $3, 0, $4)
       on conflict (question_id) do update set
         total_answers = question_stats.total_answers + 1,
         correct_answers = question_stats.correct_answers + excluded.correct_answers,
         incorrect_answers = question_stats.incorrect_answers + excluded.incorrect_answers,
         average_time_seconds = case
           when excluded.average_time_seconds is null then question_stats.average_time_seconds
           when question_stats.average_time_seconds is null then excluded.average_time_seconds
           else ((question_stats.average_time_seconds * question_stats.total_answers) + excluded.average_time_seconds)
             / (question_stats.total_answers + 1)
         end,
         updated_at = now()`,
      [payload.questionId, correct, incorrect, time]
    )
    await client.query(
      `insert into question_alternative_stats (
         question_id, question_version_id, alternative_id, response_count
       ) values ($1, $2, $3, 1)
       on conflict (question_id, alternative_id) do update set
         response_count = question_alternative_stats.response_count + 1,
         updated_at = now()`,
      [payload.questionId, payload.questionVersionId, payload.alternativeId]
    )
    await client.query("commit")
  } catch (error) {
    await client.query("rollback").catch(() => undefined)
    throw error
  } finally {
    client.release()
  }
}

async function publishPendingOutbox() {
  if (!channel || shuttingDown || publishingOutbox) return
  publishingOutbox = true
  const client = await pool.connect()
  try {
    await client.query("begin")
    const result = await client.query<{ answer_id: string; payload: unknown }>(
      `select answer_id, payload
       from question_answer_event_outbox
       where published_at is null and available_at <= now()
       order by created_at
       for update skip locked
       limit 50`
    )
    if (result.rows.length === 0) {
      await client.query("commit")
      return
    }

    await client.query(
      `update question_answer_event_outbox
       set attempts = attempts + 1, available_at = now() + interval '30 seconds'
       where answer_id = any($1::uuid[])`,
      [result.rows.map((row) => row.answer_id)]
    )
    await client.query("commit")

    for (const row of result.rows) {
      try {
        const accepted = channel.sendToQueue(
          queue,
          Buffer.from(JSON.stringify(row.payload)),
          { persistent: true, contentType: "application/json" }
        )
        if (!accepted) throw new Error("RabbitMQ publisher buffer is full")
        await pool.query(
          `update question_answer_event_outbox
           set published_at = now()
           where answer_id = $1 and published_at is null`,
          [row.answer_id]
        )
      } catch (error) {
        console.error("[worker] outbox publish failed", { answerId: row.answer_id, error })
        await pool.query(
          `update question_answer_event_outbox
           set available_at = now() + interval '5 seconds'
           where answer_id = $1 and published_at is null`,
          [row.answer_id]
        )
      }
    }
  } catch (error) {
    await client.query("rollback").catch(() => undefined)
    console.error("[worker] outbox poll failed", error)
  } finally {
    client.release()
    publishingOutbox = false
  }
}

async function start() {
  connection = await withRetry(() => amqp.connect(rabbitUrl))
  channel = await connection.createChannel()
  await channel.assertQueue(deadLetterQueue, { durable: true })
  await channel.assertQueue(queue, {
    durable: true,
    arguments: {
      "x-dead-letter-exchange": "",
      "x-dead-letter-routing-key": deadLetterQueue,
    },
  })
  await channel.prefetch(10)

  await channel.consume(queue, (message) => {
    if (!message || shuttingDown) return

    void withRetry(() => processMessage(message), { attempts: 3 })
      .then(() => channel?.ack(message))
      .catch((error) => {
        console.error("[worker] event failed after retries", error)
        channel?.nack(message, false, false)
      })
  })

  outboxTimer = setInterval(() => void publishPendingOutbox(), 500)
  outboxTimer.unref()

  console.log("[worker] consuming", queue)
}

async function shutdown(signal: string) {
  if (shuttingDown) return
  shuttingDown = true
  console.log(`[worker] received ${signal}; shutting down`)
  if (outboxTimer) clearInterval(outboxTimer)
  await channel?.close().catch(() => undefined)
  await connection?.close().catch(() => undefined)
  await pool.end().catch(() => undefined)
  process.exit(0)
}

process.on("SIGTERM", () => void shutdown("SIGTERM"))
process.on("SIGINT", () => void shutdown("SIGINT"))

void start().catch((error) => {
  console.error("[worker] failed to start", error)
  process.exit(1)
})
