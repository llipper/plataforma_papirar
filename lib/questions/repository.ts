import { randomUUID } from "node:crypto"
import type { PoolClient } from "pg"

import { query, withDatabaseTransaction } from "../db/postgres.js"
import type { QuestionData, QuestionAnswerResult } from "./types.js"

type PublicAlternative = {
  id: string
  letter: string
  text: string
}

export type PublicQuestion = Omit<QuestionData, "alternatives"> & {
  alternatives: PublicAlternative[]
  publishedAt: string
}

export type QuestionListFilters = {
  limit?: number
  cursor?: string
  search?: string
  discipline?: string
  difficulty?: string
  board?: string
  career?: string
  educationLevel?: string
  year?: string
}

export type QuestionListResult = {
  items: PublicQuestion[]
  nextCursor: string | null
}

export type QuestionStatusMap = Record<string, "correct" | "wrong">

type Cursor = { publishedAt: string; id: string }

function encodeCursor(cursor: Cursor) {
  return Buffer.from(JSON.stringify(cursor), "utf8").toString("base64url")
}

function decodeCursor(value?: string): Cursor | null {
  if (!value) return null
  try {
    const parsed = JSON.parse(Buffer.from(value, "base64url").toString("utf8")) as Partial<Cursor>
    if (typeof parsed.publishedAt !== "string" || typeof parsed.id !== "string") return null
    return parsed as Cursor
  } catch {
    return null
  }
}

function boundedLimit(value?: number) {
  if (!Number.isFinite(value)) return 20
  return Math.min(50, Math.max(1, Math.trunc(value ?? 20)))
}

export async function listPublishedQuestions(filters: QuestionListFilters = {}): Promise<QuestionListResult> {
  const limit = boundedLimit(filters.limit)
  const cursor = decodeCursor(filters.cursor)
  const result = await query<PublicQuestion>(
    [
      "select q.id, q.code, q.published_at::text as \"publishedAt\",",
      "d.name as discipline, ds.name as subject, dt.name as topic,",
      "qv.support_text as \"supportText\", qv.statement as \"questionText\",",
      "qd.slug as difficulty, q.is_original as \"isUnique\", ce.exam_year as year,",
      "eb.name as board, ca.name as institution, c.name as career,",
      "el.name as \"educationLevel\", coalesce(alternative_items.items, '[]'::json) as alternatives",
      "from questions q",
      "join question_versions qv on qv.question_id = q.id and qv.version = q.current_version",
      "join disciplines d on d.id = q.discipline_id",
      "left join discipline_subjects ds on ds.id = q.subject_id",
      "left join discipline_topics dt on dt.id = q.topic_id",
      "left join education_levels el on el.id = q.education_level_id",
      "left join exam_boards eb on eb.id = q.exam_board_id",
      "left join career_exams ce on ce.id = q.exam_id",
      "left join career_agencies ca on ca.id = ce.agency_id",
      "left join career_subcareers cs on cs.id = ca.subcareer_id",
      "left join careers c on c.id = cs.career_id",
      "join question_difficulties qd on qd.id = q.question_difficulty_id",
      "left join lateral (",
      "  select json_agg(json_build_object('id', qva.id, 'letter', qva.letter, 'text', qva.content) order by qva.position) as items",
      "  from question_version_alternatives qva where qva.question_version_id = qv.id",
      ") alternative_items on true",
      "where q.status = 'published'::question_status",
      "and q.visibility = 'public'::question_visibility",
      "and ($1::timestamptz is null or (q.published_at, q.id) < ($1::timestamptz, $2::uuid))",
      "and ($3::text = '' or d.name ilike '%' || $3 || '%' or qv.statement ilike '%' || $3 || '%')",
      "and ($4::text = '' or d.slug = $4)",
      "and ($5::text = '' or qd.slug = $5)",
      "and ($6::text = '' or eb.slug = $6)",
      "and ($7::text = '' or c.slug = $7)",
      "and ($8::text = '' or el.slug = $8)",
      "and ($9::text = '' or ce.exam_year::text = $9)",
      "order by q.published_at desc, q.id desc",
      "limit $10",
    ].join("\n"),
    [
      cursor?.publishedAt ?? null,
      cursor?.id ?? null,
      filters.search?.trim() ?? "",
      filters.discipline?.trim() ?? "",
      filters.difficulty?.trim() ?? "",
      filters.board?.trim() ?? "",
      filters.career?.trim() ?? "",
      filters.educationLevel?.trim() ?? "",
      filters.year?.trim() ?? "",
      limit + 1,
    ]
  )

  const hasMore = result.rows.length > limit
  const items = hasMore ? result.rows.slice(0, limit) : result.rows
  const last = items.at(-1)
  return {
    items,
    nextCursor: hasMore && last
      ? encodeCursor({ publishedAt: last.publishedAt, id: last.id })
      : null,
  }
}

export async function loadQuestionStatuses(userId: string, questionIds: string[]): Promise<QuestionStatusMap> {
  if (questionIds.length === 0) return {}

  const result = await query<{ questionId: string; status: "correct" | "wrong" }>(
    `select distinct on (question_id)
       question_id as "questionId",
       case when is_correct then 'correct' else 'wrong' end as status
     from question_answers
     where user_id = $1 and question_id = any($2::uuid[])
     order by question_id, answered_at desc, id desc`,
    [userId, questionIds]
  )

  return Object.fromEntries(result.rows.map((row) => [row.questionId, row.status]))
}

async function loadRevealedQuestion(client: PoolClient, questionId: string): Promise<QuestionData> {
  const result = await client.query<QuestionData>(
    [
      "select q.id, q.code, d.name as discipline, ds.name as subject, dt.name as topic,",
      "qv.support_text as \"supportText\", qv.statement as \"questionText\", qv.resolution, qv.tip,",
      "qd.slug as difficulty, q.is_original as \"isUnique\", ce.exam_year as year, eb.name as board,",
      "ca.name as institution, c.name as career, el.name as \"educationLevel\",",
      "coalesce(objective_items.items, '[]'::json) as objectives,",
      "coalesce(reference_items.items, '[]'::json) as references,",
      "coalesce(alternative_items.items, '[]'::json) as alternatives,",
      "case when qs.question_id is null then null else json_build_object(",
      "  'totalAnswers', qs.total_answers,",
      "  'correctRate', coalesce(round(100.0 * qs.correct_answers / nullif(qs.total_answers, 0)), 0)::int,",
      "  'averageTimeSeconds', qs.average_time_seconds,",
      "  'answerDistribution', coalesce(distribution.items, '{}'::json)",
      ") end as stats",
      "from questions q",
      "join question_versions qv on qv.question_id = q.id and qv.version = q.current_version",
      "join disciplines d on d.id = q.discipline_id",
      "left join discipline_subjects ds on ds.id = q.subject_id",
      "left join discipline_topics dt on dt.id = q.topic_id",
      "left join education_levels el on el.id = q.education_level_id",
      "left join exam_boards eb on eb.id = q.exam_board_id",
      "left join career_exams ce on ce.id = q.exam_id",
      "left join career_agencies ca on ca.id = ce.agency_id",
      "left join career_subcareers cs on cs.id = ca.subcareer_id",
      "left join careers c on c.id = cs.career_id",
      "join question_difficulties qd on qd.id = q.question_difficulty_id",
      "left join lateral (select json_agg(qo.content order by qo.position) as items from question_objectives qo where qo.question_version_id = qv.id) objective_items on true",
      "left join lateral (select json_agg(qr.content order by qr.position) as items from question_references qr where qr.question_version_id = qv.id) reference_items on true",
      "left join lateral (",
      "  select json_agg(json_build_object('id', qva.id, 'letter', qva.letter, 'text', qva.content, 'isCorrect', qva.is_correct, 'explanation', qva.explanation, 'reference', qva.reference_text, 'tip', qva.tip) order by qva.position) as items",
      "  from question_version_alternatives qva where qva.question_version_id = qv.id",
      ") alternative_items on true",
      "left join question_stats qs on qs.question_id = q.id",
      "left join lateral (",
      "  select coalesce(json_object_agg(qva.letter, json_build_object('percentage', round(100.0 * coalesce(qas.response_count, 0) / nullif(qs.total_answers, 0))::int, 'responseCount', coalesce(qas.response_count, 0))), '{}'::json) as items",
      "  from question_version_alternatives qva",
      "  left join question_alternative_stats qas on qas.alternative_id = qva.id and qas.question_id = q.id",
      "  where qva.question_version_id = qv.id",
      ") distribution on true",
      "where q.id = $1 and q.status = 'published'::question_status and q.visibility = 'public'::question_visibility",
    ].join("\n"),
    [questionId]
  )
  const question = result.rows[0]
  if (!question) throw new Error("Questão publicada não encontrada.")
  return question
}

type AnswerInput = {
  questionId: string
  alternativeId?: string
  alternativeLetter: string
  timeSeconds?: number
  idempotencyKey?: string
}

export async function submitQuestionAnswer(userId: string, input: AnswerInput) {
  const idempotencyKey = input.idempotencyKey ?? randomUUID()
  return withDatabaseTransaction(async (client) => {
    const target = await client.query<{ versionId: string; alternativeId: string; isCorrect: boolean }>(
      [
        "select qv.id as \"versionId\", qva.id as \"alternativeId\", qva.is_correct as \"isCorrect\"",
        "from questions q",
        "join question_versions qv on qv.question_id = q.id and qv.version = q.current_version",
        "join question_version_alternatives qva on qva.question_version_id = qv.id and qva.letter = $2",
        "where q.id = $1 and q.status = 'published'::question_status and q.visibility = 'public'::question_visibility",
      ].join("\n"),
      [input.questionId, input.alternativeLetter.trim().toUpperCase()]
    )
    const selected = target.rows[0]
    if (!selected) throw new Error("Alternativa inválida para esta questão.")
    if (input.alternativeId && input.alternativeId !== selected.alternativeId) {
      throw new Error("A alternativa enviada não pertence à questão publicada.")
    }

    const inserted = await client.query<{ id: string }>(
      [
        "insert into question_answers (question_id, question_version_id, user_id, alternative_id, is_correct, time_seconds, idempotency_key)",
        "values ($1, $2, $3, $4, $5, $6, $7)",
        "on conflict (user_id, idempotency_key) where idempotency_key is not null do nothing",
        "returning id",
      ].join("\n"),
      [
        input.questionId,
        selected.versionId,
        userId,
        selected.alternativeId,
        selected.isCorrect,
        input.timeSeconds == null ? null : Math.max(0, Math.trunc(input.timeSeconds)),
        idempotencyKey,
      ]
    )
    const created = Boolean(inserted.rows[0]?.id)
    const answerId = inserted.rows[0]?.id ?? (await client.query<{ id: string }>(
      "select id from question_answers where user_id = $1 and idempotency_key = $2",
      [userId, idempotencyKey]
    )).rows[0]?.id
    if (!answerId) throw new Error("Não foi possível registrar a resposta.")

    if (created) {
      await client.query(
        `insert into question_answer_event_outbox (answer_id, payload)
         values ($1::uuid, jsonb_build_object(
           'type', 'QUESTION_ANSWERED',
           'answerId', $1::uuid,
           'questionId', $2::uuid,
           'questionVersionId', $3::uuid,
           'alternativeId', $4::uuid,
           'isCorrect', $5::boolean,
           'timeSeconds', $6::integer
         ))
         on conflict (answer_id) do nothing`,
        [
          answerId,
          input.questionId,
          selected.versionId,
          selected.alternativeId,
          selected.isCorrect,
          input.timeSeconds == null ? null : Math.max(0, Math.trunc(input.timeSeconds)),
        ]
      )
    }

    const question = await loadRevealedQuestion(client, input.questionId)
    const correctAlternativeLetter = question.alternatives.find((alternative) => alternative.isCorrect)?.letter ?? ""
    return {
      answerId,
      created,
      questionId: input.questionId,
      questionVersionId: selected.versionId,
      alternativeId: selected.alternativeId,
      isCorrect: selected.isCorrect,
      correctAlternativeLetter,
      timeSeconds: input.timeSeconds,
      question,
    } satisfies QuestionAnswerResult & { answerId: string; created: boolean; questionId: string; questionVersionId: string; alternativeId: string; question: QuestionData }
  })
}
