import { randomUUID } from "node:crypto"
import { createServer, type IncomingMessage, type ServerResponse } from "node:http"
import { Pool } from "pg"
import { runWithDatabaseRequestContext } from "../../../lib/db/postgres.js"

import { AuthError, authenticateRequest, requireRole } from "./auth/authentication.js"
import { closeRedis, connectRedis, createRedisClient, getJsonCache, setJsonCache } from "./infrastructure/redis.js"
import { RabbitPublisher } from "./infrastructure/rabbitmq.js"
import {
  createTaxonomyItem,
  deleteTaxonomyItem,
  listGeographyOptions,
  listTaxonomyItems,
  updateTaxonomyItem,
} from "../../../lib/taxonomies/repository.js"
import { changeAdminQuestionStatus, createAdminQuestion, listAdminQuestions, publishAllAdminQuestions, updateAdminQuestion } from "../../../lib/questions/admin-repository.js"
import { listPublishedQuestions, loadQuestionStatuses, submitQuestionAnswer } from "../../../lib/questions/repository.js"
import type { PublicQuestion } from "../../../lib/questions/repository.js"
import type {
  QuestionAnswerFormat,
  TaxonomyKind,
  TaxonomyLevel,
} from "../../../lib/taxonomies/types.js"

const port = Number(process.env.PORT ?? 3001)
const host = process.env.HOSTNAME ?? "0.0.0.0"

function connectionString() {
  if (process.env.DATABASE_URL) return process.env.DATABASE_URL

  const user = process.env.POSTGRES_USER
  const password = process.env.POSTGRES_PASSWORD
  const database = process.env.POSTGRES_DB
  const dbHost = process.env.POSTGRES_HOST ?? "127.0.0.1"
  const dbPort = process.env.POSTGRES_PORT ?? "6432"

  if (!user || !password || !database) {
    throw new Error("Database configuration is incomplete")
  }

  return `postgres://${encodeURIComponent(user)}:${encodeURIComponent(password)}@${dbHost}:${dbPort}/${encodeURIComponent(database)}`
}

const pool = new Pool({
  connectionString: connectionString(),
  max: Number(process.env.DB_POOL_MAX ?? 20),
  idleTimeoutMillis: 30_000,
  connectionTimeoutMillis: 5_000,
  maxUses: 10_000,
})
const redis = createRedisClient()
const rabbit = new RabbitPublisher()

function withDatabaseContext<T>(
  context: Awaited<ReturnType<typeof authenticateRequest>>,
  operation: () => Promise<T>
) {
  const role = context.roles.includes("admin")
    ? "admin"
    : context.roles.includes("moderator")
      ? "moderator"
      : "user"

  return runWithDatabaseRequestContext(
    { userId: context.user.id, role },
    operation
  )
}

function json(response: ServerResponse, status: number, body: unknown) {
  response.writeHead(status, {
    "content-type": "application/json; charset=utf-8",
    "cache-control": "no-store",
  })
  response.end(JSON.stringify(body))
}

async function handler(request: IncomingMessage, response: ServerResponse) {
  const requestId = request.headers["x-request-id"]?.toString() ?? randomUUID()
  response.setHeader("x-request-id", requestId)

  if (request.method !== "GET") {
    if (
      !request.url?.startsWith("/v1/admin/taxonomies/") &&
      !request.url?.match(/^\/v1\/admin\/questions(?:\/[^/?]+)?(?:\?.*)?$/) &&
      !request.url?.match(/^\/v1\/questions\/[^/]+\/answers$/)
    ) {
      json(response, 405, { error: "method_not_allowed", requestId })
      return
    }
  }

  if (request.url === "/health/live") {
    json(response, 200, { status: "ok", service: "papirar-api", requestId })
    return
  }

  if (request.url === "/health/ready") {
    try {
      await Promise.all([
        pool.query("select 1"),
        connectRedis(redis),
        rabbit.connect(),
      ])
      json(response, 200, {
        status: "ready",
        service: "papirar-api",
        dependencies: {
          postgres: "ready",
          redis: "ready",
          rabbitmq: "ready",
        },
        requestId,
      })
    } catch (error) {
      console.error("[api] readiness check failed", { requestId, error })
      json(response, 503, {
        status: "not_ready",
        service: "papirar-api",
        dependencies: {
          postgres: "unavailable",
          redis: "unavailable",
          rabbitmq: "unavailable",
        },
        requestId,
      })
    }
    return
  }

  if (request.url === "/v1/me") {
    try {
      const context = await authenticateRequest(request.headers, pool)
      json(response, 200, {
        user: context.user,
        roles: context.roles,
        requestId,
      })
    } catch (error) {
      if (error instanceof AuthError) {
        json(response, error.status, { error: error.code, message: error.message, requestId })
      } else {
        console.error("[api] authentication failed", { requestId, error })
        json(response, 500, { error: "internal_error", requestId })
      }
    }
    return
  }

  if (request.url === "/v1/admin/ping") {
    try {
      const context = await authenticateRequest(request.headers, pool)
      requireRole(context, ["admin"])
      json(response, 200, { status: "authorized", requestId })
    } catch (error) {
      if (error instanceof AuthError) {
        json(response, error.status, { error: error.code, message: error.message, requestId })
      } else {
        console.error("[api] authorization failed", { requestId, error })
        json(response, 500, { error: "internal_error", requestId })
      }
    }
    return
  }

  if (request.url === "/v1/admin/questions" && request.method === "POST") {
    try {
      const context = await authenticateRequest(request.headers, pool)
      requireRole(context, ["admin", "moderator"])
      const body = await readJson(request)
      const result = await withDatabaseContext(context, () =>
        createAdminQuestion(context.user.id, {
          disciplineId: String(body.disciplineId ?? ""),
          subjectId: nullableUuid(body.subjectId),
          topicId: nullableUuid(body.topicId),
          subtopicId: nullableUuid(body.subtopicId),
          difficultyId: String(body.difficultyId ?? ""),
          questionTypeId: String(body.questionTypeId ?? ""),
          educationLevelId: nullableUuid(body.educationLevelId),
          examBoardId: nullableUuid(body.examBoardId),
          examId: nullableUuid(body.examId),
          positionIds: Array.isArray(body.positionIds)
            ? body.positionIds.map((value) => String(value))
            : [],
          isOriginal: body.isOriginal === true,
          statement: String(body.statement ?? ""),
          supportText: optionalString(body.supportText),
          resolution: optionalString(body.resolution),
          tip: optionalString(body.tip),
          objective: optionalString(body.objective),
          referenceText: optionalString(body.referenceText),
          objectives: Array.isArray(body.objectives) ? body.objectives.map((value) => String(value)) : undefined,
          references: Array.isArray(body.references) ? body.references.map((value) => String(value)) : undefined,
          videos: Array.isArray(body.videos)
            ? body.videos.map((video) => ({
                title: String(video?.title ?? ""),
                url: String(video?.url ?? ""),
                durationSeconds: video?.durationSeconds == null ? null : Number(video.durationSeconds),
              }))
            : undefined,
          visibility: body.visibility === "private" || body.visibility === "organization" ? body.visibility : "public",
          allowComments: body.allowComments !== false,
          reviewMode: body.reviewMode === true,
          status: body.status === "published" ? "published" : body.status === "in_review" ? "in_review" : "draft",
          alternatives: Array.isArray(body.alternatives)
            ? body.alternatives.map((alternative) => ({
                letter: String(alternative?.letter ?? ""),
                content: String(alternative?.content ?? ""),
                explanation: optionalString(alternative?.explanation),
                referenceText: optionalString(alternative?.referenceText),
                tip: optionalString(alternative?.tip),
                isCorrect: alternative?.isCorrect === true,
              }))
            : [],
        })
      )
      json(response, 201, { question: result, requestId })
    } catch (error) {
      respondApiError(response, error, requestId)
    }
    return
  }

  if (request.url === "/v1/admin/questions/bulk-publish" && request.method === "POST") {
    try {
      const context = await authenticateRequest(request.headers, pool)
      requireRole(context, ["admin", "moderator"])
      const result = await withDatabaseContext(context, () => publishAllAdminQuestions(context.user.id))
      json(response, 200, { ok: true, ...result, requestId })
    } catch (error) {
      respondApiError(response, error, requestId)
    }
    return
  }

  const adminQuestionMatch = request.url?.match(/^\/v1\/admin\/questions\/([^/?]+)$/)
  if (adminQuestionMatch && (request.method === "PATCH" || request.method === "DELETE")) {
    try {
      const context = await authenticateRequest(request.headers, pool)
      requireRole(context, ["admin", "moderator"])
      const questionId = decodeURIComponent(adminQuestionMatch[1])
      if (request.method === "DELETE") {
        await withDatabaseContext(context, () => changeAdminQuestionStatus(questionId, context.user.id, "archived"))
        json(response, 200, { ok: true, status: "archived", requestId })
      } else {
        const body = await readJson(request)
        const status = body.status === "published" ? "published" : body.status === "in_review" ? "in_review" : "draft"
        if (body.action === "publish") {
          await withDatabaseContext(context, () => changeAdminQuestionStatus(questionId, context.user.id, "published"))
          json(response, 200, { ok: true, status: "published", requestId })
        } else {
          const result = await withDatabaseContext(context, () => updateAdminQuestion(questionId, context.user.id, {
            disciplineId: String(body.disciplineId ?? ""), subjectId: nullableUuid(body.subjectId), topicId: nullableUuid(body.topicId), subtopicId: nullableUuid(body.subtopicId),
            difficultyId: String(body.difficultyId ?? ""), questionTypeId: String(body.questionTypeId ?? ""), educationLevelId: nullableUuid(body.educationLevelId), examBoardId: nullableUuid(body.examBoardId), examId: nullableUuid(body.examId),
            positionIds: Array.isArray(body.positionIds) ? body.positionIds.map((value) => String(value)) : [], isOriginal: body.isOriginal === true, statement: String(body.statement ?? ""), supportText: optionalString(body.supportText), resolution: optionalString(body.resolution), tip: optionalString(body.tip),
            objectives: Array.isArray(body.objectives) ? body.objectives.map((value) => String(value)) : [], references: Array.isArray(body.references) ? body.references.map((value) => String(value)) : [], videos: [], visibility: body.visibility === "private" || body.visibility === "organization" ? body.visibility : "public", allowComments: body.allowComments !== false, reviewMode: body.reviewMode === true, status,
            alternatives: Array.isArray(body.alternatives) ? body.alternatives.map((alternative) => ({ letter: String(alternative?.letter ?? ""), content: String(alternative?.content ?? ""), explanation: optionalString(alternative?.explanation), referenceText: optionalString(alternative?.referenceText), tip: optionalString(alternative?.tip), isCorrect: alternative?.isCorrect === true })) : [],
          }))
          json(response, 200, { question: result, requestId })
        }
      }
    } catch (error) {
      respondApiError(response, error, requestId)
    }
    return
  }

  if (request.url?.startsWith("/v1/admin/questions") && request.method === "GET") {
    try {
      const context = await authenticateRequest(request.headers, pool)
      requireRole(context, ["admin", "moderator"])
      const url = new URL(request.url, "http://localhost")
      const status = url.searchParams.get("status") || undefined
      const id = url.searchParams.get("id") || undefined
      json(response, 200, { items: await withDatabaseContext(context, () => listAdminQuestions(status, id)), requestId })
    } catch (error) {
      respondApiError(response, error, requestId)
    }
    return
  }

  const answerMatch = request.url?.match(/^\/v1\/questions\/([^/]+)\/answers$/)
  if (answerMatch && request.method === "POST") {
    try {
      const context = await authenticateRequest(request.headers, pool)
      const body = await readJson(request)
      const result = await withDatabaseContext(context, () => submitQuestionAnswer(context.user.id, {
        questionId: answerMatch[1],
        alternativeId: optionalString(body.alternativeId),
        alternativeLetter: String(body.alternativeLetter ?? ""),
        timeSeconds: optionalNumber(body.timeSeconds),
        idempotencyKey: request.headers["idempotency-key"]?.toString() || undefined,
      }))

      json(response, 201, { answer: result, requestId })
    } catch (error) {
      respondApiError(response, error, requestId)
    }
    return
  }

  if (request.url?.startsWith("/v1/questions") && request.method === "GET") {
    try {
      const context = await authenticateRequest(request.headers, pool)
      const url = new URL(request.url, "http://localhost")
      const cacheKey = `questions:published:v1:${url.searchParams.toString() || "default"}`
      const cached = await getJsonCache<{ items: PublicQuestion[]; nextCursor: string | null }>(redis, cacheKey)
      const publicResult = cached ?? await withDatabaseContext(context, () => listPublishedQuestions({
        limit: optionalNumber(url.searchParams.get("limit") ?? undefined),
        cursor: url.searchParams.get("cursor") ?? undefined,
        search: url.searchParams.get("search") ?? undefined,
        discipline: url.searchParams.get("discipline") ?? undefined,
        difficulty: url.searchParams.get("difficulty") ?? undefined,
        board: url.searchParams.get("board") ?? undefined,
        career: url.searchParams.get("career") ?? undefined,
        educationLevel: url.searchParams.get("educationLevel") ?? undefined,
        year: url.searchParams.get("year") ?? undefined,
      }))
      if (!cached) await setJsonCache(redis, cacheKey, publicResult, 30)

      const statuses = await withDatabaseContext(context, () =>
        loadQuestionStatuses(context.user.id, publicResult.items.map((item) => item.id))
      )
      const items = publicResult.items.map((item) => ({
        ...item,
        userStatus: statuses[item.id] ?? "none",
      }))
      json(response, 200, {
        items,
        nextCursor: publicResult.nextCursor,
        requestId,
        cache: cached ? "hit" : "miss",
      })
    } catch (error) {
      respondApiError(response, error, requestId)
    }
    return
  }

  if (request.url === "/v1/admin/taxonomies/geography" && request.method === "GET") {
    try {
      const context = await authenticateRequest(request.headers, pool)
      requireRole(context, ["admin", "moderator"])
      json(response, 200, await withDatabaseContext(context, listGeographyOptions))
    } catch (error) {
      respondApiError(response, error, requestId)
    }
    return
  }

  const taxonomyMatch = request.url?.match(/^\/v1\/admin\/taxonomies\/([^/?]+)$/)
  if (taxonomyMatch) {
    try {
      const context = await authenticateRequest(request.headers, pool)
      requireRole(context, ["admin", "moderator"])

      const kind = parseTaxonomyKind(decodeURIComponent(taxonomyMatch[1]))
      if (request.method === "GET") {
        json(response, 200, {
          items: await withDatabaseContext(context, () => listTaxonomyItems(kind)),
        })
      } else {
        const body = await readJson(request)
        const level = parseTaxonomyLevel(body.level)

        if (request.method === "POST") {
          await withDatabaseContext(context, () => createTaxonomyItem({
            kind,
            level,
            name: typeof body.name === "string" ? body.name : "",
            parentId: body.parentId ? String(body.parentId) : null,
            code: optionalString(body.code),
            weight: optionalNumber(body.weight),
            position: optionalNumber(body.position),
            displayColor: optionalString(body.displayColor),
            geographicScopeId: nullableUuid(body.geographicScopeId),
            federativeUnitId: nullableUuid(body.federativeUnitId),
            examYear: nullableInteger(body.examYear),
            answerFormat: parseAnswerFormat(body.answerFormat),
            alternativeCount: nullableInteger(body.alternativeCount),
          }))
          json(response, 201, { ok: true })
        } else if (request.method === "PATCH") {
          const id = typeof body.id === "string" ? body.id.trim() : ""
          if (!id) throw new Error("Identificador é obrigatório.")
          await withDatabaseContext(context, () => updateTaxonomyItem({
            kind,
            level,
            id,
            name: typeof body.name === "string" ? body.name : undefined,
            isActive: typeof body.isActive === "boolean" ? body.isActive : undefined,
            geographicScopeId: nullableUuid(body.geographicScopeId),
            federativeUnitId: nullableUuid(body.federativeUnitId),
            examYear: nullableInteger(body.examYear),
          }))
          json(response, 200, { ok: true })
        } else if (request.method === "DELETE") {
          const id = typeof body.id === "string" ? body.id.trim() : ""
          if (!id) throw new Error("Identificador é obrigatório.")
          await withDatabaseContext(context, () =>
            deleteTaxonomyItem({ kind, level, id })
          )
          json(response, 200, { ok: true })
        } else {
          json(response, 405, { error: "method_not_allowed", requestId })
        }
      }
    } catch (error) {
      respondApiError(response, error, requestId)
    }
    return
  }

  json(response, 404, { error: "not_found", requestId })
}

const taxonomyKinds = new Set<TaxonomyKind>([
  "subjects",
  "careers",
  "difficulty",
  "education",
  "boards",
  "question-types",
])

const taxonomyLevels = new Set<TaxonomyLevel>([
  "disciplina",
  "assunto",
  "topico",
  "subtopico",
  "carreira",
  "subcarreira",
  "orgao",
  "concurso",
  "cargo",
  "dificuldade",
  "nivelEducacional",
  "banca",
  "tipoQuestao",
])

const answerFormats = new Set<QuestionAnswerFormat>([
  "multiple_choice",
  "true_false",
  "free_text",
])

function parseTaxonomyKind(value: string): TaxonomyKind {
  if (!taxonomyKinds.has(value as TaxonomyKind)) throw new Error("Taxonomia inválida.")
  return value as TaxonomyKind
}

function parseTaxonomyLevel(value: unknown): TaxonomyLevel {
  if (typeof value !== "string" || !taxonomyLevels.has(value as TaxonomyLevel)) {
    throw new Error("Nível de taxonomia inválido.")
  }
  return value as TaxonomyLevel
}

function optionalString(value: unknown) {
  if (typeof value !== "string") return undefined
  const normalized = value.trim()
  return normalized || undefined
}

function nullableUuid(value: unknown) {
  if (value === undefined) return undefined
  if (value === null || value === "") return null
  if (typeof value !== "string") throw new Error("Identificador inválido.")
  return value.trim() || null
}

function optionalNumber(value: unknown) {
  if (value === undefined || value === null || value === "") return undefined
  const parsed = typeof value === "number" ? value : Number(value)
  if (!Number.isFinite(parsed)) throw new Error("Valor numérico inválido.")
  return parsed
}

function nullableInteger(value: unknown) {
  if (value === undefined) return undefined
  if (value === null || value === "") return null
  const parsed = typeof value === "number" ? value : Number.parseInt(String(value), 10)
  if (!Number.isInteger(parsed)) throw new Error("Valor inteiro inválido.")
  return parsed
}

function parseAnswerFormat(value: unknown): QuestionAnswerFormat | undefined {
  if (value === undefined || value === null || value === "") return undefined
  if (typeof value !== "string" || !answerFormats.has(value as QuestionAnswerFormat)) {
    throw new Error("Formato de questão inválido.")
  }
  return value as QuestionAnswerFormat
}

async function readJson(request: IncomingMessage) {
  let body = ""
  for await (const chunk of request) {
    body += chunk.toString()
    if (body.length > 1_000_000) throw new Error("Payload excede o limite permitido.")
  }
  return body ? (JSON.parse(body) as Record<string, unknown>) : {}
}

function respondApiError(response: ServerResponse, error: unknown, requestId: string) {
  if (error instanceof AuthError) {
    json(response, error.status, { error: error.code, message: error.message, requestId })
    return
  }
  console.error("[api] request failed", { requestId, error })
  json(response, 400, {
    error: "bad_request",
    message: error instanceof Error ? error.message : "Erro inesperado.",
    requestId,
  })
}

const server = createServer((request, response) => {
  void handler(request, response).catch((error) => {
    console.error("[api] unhandled request error", error)
    if (!response.headersSent) json(response, 500, { error: "internal_error" })
    else response.end()
  })
})

let shuttingDown = false
async function shutdown(signal: string) {
  if (shuttingDown) return
  shuttingDown = true
  console.log(`[api] received ${signal}; shutting down`)

  server.close(async () => {
    await pool.end()
    await rabbit.close()
    await closeRedis(redis)
    process.exit(0)
  })

  setTimeout(() => process.exit(1), 10_000).unref()
}

process.on("SIGTERM", () => void shutdown("SIGTERM"))
process.on("SIGINT", () => void shutdown("SIGINT"))

server.listen(port, host, () => {
  console.log(`[api] listening on ${host}:${port}`)
})
