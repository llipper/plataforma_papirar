import amqp, { type Channel, type ChannelModel } from "amqplib"

import { withRetry } from "./retry.js"

export const EVENTS_QUEUE = "papirar.events"
export const EVENTS_DLQ = "papirar.events.dlq"

function rabbitUrl() {
  if (process.env.RABBITMQ_URL) return process.env.RABBITMQ_URL

  const user = encodeURIComponent(process.env.RABBITMQ_USER ?? "papirar")
  const password = encodeURIComponent(process.env.RABBITMQ_PASSWORD ?? "")
  const host = process.env.RABBITMQ_HOST ?? "127.0.0.1"
  const port = process.env.RABBITMQ_PORT ?? "5672"
  return `amqp://${user}:${password}@${host}:${port}`
}

export class RabbitPublisher {
  private connection?: ChannelModel
  private channel?: Channel
  private connecting?: Promise<void>

  async connect() {
    if (this.channel) return
    if (this.connecting) return this.connecting

    this.connecting = withRetry(async () => {
      this.connection = await amqp.connect(rabbitUrl())
      this.channel = await this.connection.createChannel()
      await this.channel.assertQueue(EVENTS_DLQ, { durable: true })
      await this.channel.assertQueue(EVENTS_QUEUE, {
        durable: true,
        arguments: {
          "x-dead-letter-exchange": "",
          "x-dead-letter-routing-key": EVENTS_DLQ,
        },
      })
    }).finally(() => {
      this.connecting = undefined
    })
    return this.connecting
  }

  async publish(payload: unknown) {
    if (!this.channel) throw new Error("RabbitMQ publisher is not connected")

    return this.channel.sendToQueue(
      EVENTS_QUEUE,
      Buffer.from(JSON.stringify(payload)),
      { persistent: true, contentType: "application/json" }
    )
  }

  async close() {
    await this.channel?.close().catch(() => undefined)
    await this.connection?.close().catch(() => undefined)
    this.channel = undefined
    this.connection = undefined
    this.connecting = undefined
  }
}
