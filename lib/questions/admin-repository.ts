import type { PoolClient } from "pg"

import { query, withDatabaseTransaction } from "../db/postgres.js"

export type CreateAdminQuestionInput = {
  disciplineId: string
  subjectId?: string | null
  topicId?: string | null
  subtopicId?: string | null
  difficultyId: string
  questionTypeId: string
  educationLevelId?: string | null
  examBoardId?: string | null
  examId?: string | null
  positionIds?: string[]
  isOriginal: boolean
  statement: string
  supportText?: string | null
  resolution?: string | null
  tip?: string | null
  objective?: string | null
  referenceText?: string | null
  objectives?: string[]
  references?: string[]
  videos?: Array<{ title: string; url: string; durationSeconds?: number | null }>
  visibility?: "private" | "organization" | "public"
  allowComments?: boolean
  reviewMode?: boolean
  status?: "draft" | "in_review" | "published"
  alternatives: Array<{
    letter: string
    content: string
    explanation?: string | null
    referenceText?: string | null
    tip?: string | null
    isCorrect: boolean
  }>
}

function requiredText(value: string, label: string) {
  const normalized = value.trim()
  if (!normalized) throw new Error(`${label} é obrigatório.`)
  return normalized
}

function nullableText(value?: string | null) {
  const normalized = value?.trim() ?? ""
  return normalized || null
}

function createCode() {
  return `Q-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`
}

async function validateTaxonomy(client: PoolClient, input: CreateAdminQuestionInput) {
  const typeResult = await client.query<{
    answer_format: "multiple_choice" | "true_false" | "free_text"
    alternative_count: number | null
  }>(
    `select answer_format, alternative_count
     from question_types
     where id = $1 and is_active`,
    [input.questionTypeId]
  )
  const type = typeResult.rows[0]
  if (!type) throw new Error("Tipo de questão inválido ou inativo.")

  const taxonomyResult = await client.query(
    `select
       exists(select 1 from disciplines where id = $1 and is_active) as discipline_valid,
       exists(select 1 from question_difficulties where id = $2 and is_active) as difficulty_valid,
       ($3::uuid is null or exists(select 1 from education_levels where id = $3 and is_active)) as education_valid,
       ($4::uuid is null or exists(select 1 from exam_boards where id = $4 and is_active)) as board_valid,
       ($5::uuid is null or exists(select 1 from career_exams where id = $5 and is_active)) as exam_valid`,
    [input.disciplineId, input.difficultyId, input.educationLevelId ?? null, input.examBoardId ?? null, input.examId ?? null]
  )
  const valid = taxonomyResult.rows[0]
  if (!valid.discipline_valid) throw new Error("Disciplina inválida ou inativa.")
  if (!valid.difficulty_valid) throw new Error("Nível de dificuldade inválido ou inativo.")
  if (!valid.education_valid) throw new Error("Nível educacional inválido ou inativo.")
  if (!valid.board_valid) throw new Error("Banca examinadora inválida ou inativa.")
  if (!valid.exam_valid) throw new Error("Concurso inválido ou inativo.")

  if (input.positionIds?.length) {
    if (!input.examId) throw new Error("Selecione o concurso antes de vincular um cargo.")
    const positions = await client.query<{ id: string }>(
      `select id from career_positions where exam_id = $1 and id = any($2::uuid[]) and is_active`,
      [input.examId, input.positionIds]
    )
    if (positions.rowCount !== input.positionIds.length) {
      throw new Error("Um ou mais cargos não pertencem ao concurso selecionado.")
    }
  }

  const alternatives = input.alternatives
  if (type.answer_format === "free_text") {
    if (alternatives.length !== 0) throw new Error("Questões discursivas não possuem alternativas.")
  } else {
    const expected = type.alternative_count ?? 2
    if (alternatives.length !== expected) {
      throw new Error(`Este tipo de questão exige ${expected} alternativas.`)
    }
    if (alternatives.filter((alternative) => alternative.isCorrect).length !== 1) {
      throw new Error("Selecione exatamente uma alternativa correta.")
    }
  }

  return type
}

export async function createAdminQuestion(ownerId: string, input: CreateAdminQuestionInput) {
  return withDatabaseTransaction(async (client) => {
    const statement = requiredText(input.statement, "O enunciado")
    const type = await validateTaxonomy(client, input)
    const code = createCode()
    const published = input.status === "published"

    const questionResult = await client.query<{ id: string }>(
      `insert into questions (
         organization_id, owner_id, code, visibility, status, is_original,
         allow_comments, review_mode,
         current_version, created_by, updated_by, published_at,
         question_difficulty_id, question_type_id, education_level_id,
         exam_board_id, discipline_id, subject_id, topic_id, subtopic_id, exam_id
       ) values (
         null, $1, $2, $3::question_visibility, $4::question_status, $5,
         $6, $7,
         1, $1, $1, case when $8 then now() else null end,
         $9, $10, $11, $12, $13, $14, $15, $16, $17
       )
       returning id`,
      [
        ownerId,
        code,
        input.visibility ?? "public",
        input.status,
        input.isOriginal,
        input.allowComments ?? true,
        input.reviewMode ?? false,
        published,
        input.difficultyId,
        input.questionTypeId,
        input.educationLevelId ?? null,
        input.examBoardId ?? null,
        input.disciplineId,
        input.subjectId ?? null,
        input.topicId ?? null,
        input.subtopicId ?? null,
        input.examId ?? null,
      ]
    )

    const questionId = questionResult.rows[0].id
    const versionResult = await client.query<{ id: string }>(
      `insert into question_versions (
         question_id, version, support_text, statement, resolution, tip,
         created_by, published_at
       ) values ($1, 1, $2, $3, $4, $5, $6, case when $7 then now() else null end)
       returning id`,
      [
        questionId,
        nullableText(input.supportText),
        statement,
        nullableText(input.resolution),
        nullableText(input.tip),
        ownerId,
        published,
      ]
    )
    const versionId = versionResult.rows[0].id

    for (const [index, alternative] of input.alternatives.entries()) {
      await client.query(
        `insert into question_version_alternatives (
           question_version_id, letter, content, explanation,
           reference_text, tip, is_correct, position
         ) values ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [
          versionId,
          requiredText(alternative.letter, "A letra da alternativa"),
          requiredText(alternative.content, `A alternativa ${alternative.letter}`),
          nullableText(alternative.explanation),
          nullableText(alternative.referenceText),
          nullableText(alternative.tip),
          alternative.isCorrect,
          index + 1,
        ]
      )
    }

    for (const positionId of input.positionIds ?? []) {
      await client.query(
        `insert into question_positions (question_id, exam_id, position_id, created_by)
         values ($1, $2, $3, $4)`,
        [questionId, input.examId, positionId, ownerId]
      )
    }

    const objectives = (input.objectives?.length ? input.objectives : [input.objective ?? ""])
      .map((value) => value.trim())
      .filter(Boolean)
    for (const [index, objective] of objectives.entries()) {
      await client.query(
        `insert into question_objectives (question_version_id, content, position)
         values ($1, $2, $3)`,
        [versionId, objective, index + 1]
      )
    }

    const references = (input.references?.length ? input.references : [input.referenceText ?? ""])
      .map((value) => value.trim())
      .filter(Boolean)
    for (const [index, reference] of references.entries()) {
      await client.query(
        `insert into question_references (question_version_id, content, position)
         values ($1, $2, $3)`,
        [versionId, reference, index + 1]
      )
    }

    for (const [index, video] of (input.videos ?? []).entries()) {
      const title = nullableText(video.title)
      const url = nullableText(video.url)
      if (!title || !url) continue
      await client.query(
        `insert into question_videos (question_version_id, title, url, duration_seconds, position)
         values ($1, $2, $3, $4, $5)`,
        [versionId, title, url, video.durationSeconds ?? null, index + 1]
      )
    }

    if (published) {
      await client.query(
        `insert into question_publications (question_id, question_version_id, published_by)
         values ($1, $2, $3)`,
        [questionId, versionId, ownerId]
      )
    }

    return { id: questionId, versionId, code, format: type.answer_format }
  })
}

export type AdminQuestionListItem = {
  id: string
  code: string
  status: string
  visibility: string
  isOriginal: boolean
  supportText: string | null
  questionText: string
  resolution: string | null
  tip: string | null
  objectives: string[]
  references: string[]
  videos: Array<{ title: string; url: string; durationMinutes?: number }>
  stats: {
    totalAnswers: number
    correctRate: number
    averageTimeSeconds?: number
    mostSelectedWrongAlternative?: string
    answerDistribution: Record<string, { percentage: number; responseCount: number }>
  } | null
  alternatives: Array<{
    id: string
    letter: string
    text: string
    isCorrect: boolean
    explanation?: string | null
    reference?: string | null
    tip?: string | null
  }>
  discipline: string
  subject: string | null
  topic: string | null
  subtopic: string | null
  difficulty: string
  educationLevel: string | null
  board: string | null
  institution: string | null
  career: string | null
  year: number | null
  questionType: string
  createdAt: string
  publishedAt: string | null
  disciplineId: string
  subjectId: string | null
  topicId: string | null
  subtopicId: string | null
  difficultyId: string
  questionTypeId: string
  educationLevelId: string | null
  examBoardId: string | null
  examId: string | null
  positionIds: string[]
  allowComments: boolean
  reviewMode: boolean
}

export async function listAdminQuestions(status?: string, questionId?: string) {
  const result = await query<AdminQuestionListItem>(
    `select
       q.id,
       q.code,
       q.status::text as status,
       q.visibility::text as visibility,
       q.is_original as "isOriginal",
       qv.support_text as "supportText",
       qv.statement as "questionText",
       qv.resolution,
       qv.tip,
       coalesce(objective_items.items, '[]'::json) as objectives,
       coalesce(reference_items.items, '[]'::json) as references,
       coalesce(video_items.items, '[]'::json) as videos,
       coalesce(alternative_items.items, '[]'::json) as alternatives,
       case when qs.question_id is null then null else json_build_object(
         'totalAnswers', coalesce(qs.total_answers, 0),
         'correctRate', coalesce(round(100.0 * qs.correct_answers / nullif(qs.total_answers, 0)), 0)::int,
         'averageTimeSeconds', qs.average_time_seconds,
         'mostSelectedWrongAlternative', qs.most_selected_wrong_letter,
         'answerDistribution', case
           when coalesce(qs.total_answers, 0) > 0 then distribution.items
           else '{}'::json
         end
       ) end as stats,
       d.name as discipline,
       ds.name as subject,
       dt.name as topic,
       dst.name as subtopic,
       qd.slug as difficulty,
       el.name as "educationLevel",
       eb.name as board,
       ca.name as institution,
       c.name as career,
       ce.exam_year as year,
       qt.name as "questionType",
       q.created_at as "createdAt",
       q.published_at as "publishedAt"
       ,q.discipline_id as "disciplineId"
       ,q.subject_id as "subjectId"
       ,q.topic_id as "topicId"
       ,q.subtopic_id as "subtopicId"
       ,q.question_difficulty_id as "difficultyId"
       ,q.question_type_id as "questionTypeId"
       ,q.education_level_id as "educationLevelId"
       ,q.exam_board_id as "examBoardId"
       ,q.exam_id as "examId"
       ,q.allow_comments as "allowComments"
       ,q.review_mode as "reviewMode"
       ,coalesce(position_items.items, '[]'::json) as "positionIds"
     from questions q
     join question_versions qv on qv.question_id = q.id and qv.version = q.current_version
     join disciplines d on d.id = q.discipline_id
     left join discipline_subjects ds on ds.id = q.subject_id
     left join discipline_topics dt on dt.id = q.topic_id
     left join discipline_subtopics dst on dst.id = q.subtopic_id
     join question_difficulties qd on qd.id = q.question_difficulty_id
     left join education_levels el on el.id = q.education_level_id
     left join exam_boards eb on eb.id = q.exam_board_id
     left join career_exams ce on ce.id = q.exam_id
     left join career_agencies ca on ca.id = ce.agency_id
     left join career_subcareers cs on cs.id = ca.subcareer_id
     left join careers c on c.id = cs.career_id
     join question_types qt on qt.id = q.question_type_id
     left join lateral (
       select json_agg(qo.content order by qo.position) as items
       from question_objectives qo
       where qo.question_version_id = qv.id
     ) objective_items on true
     left join lateral (
       select json_agg(qr.content order by qr.position) as items
       from question_references qr
       where qr.question_version_id = qv.id
     ) reference_items on true
     left join lateral (
       select json_agg(json_build_object(
         'title', qvideo.title,
         'url', qvideo.url,
         'durationMinutes', case
           when qvideo.duration_seconds is null then null
           else ceil(qvideo.duration_seconds / 60.0)::int
         end
       ) order by qvideo.position) as items
       from question_videos qvideo
       where qvideo.question_version_id = qv.id
     ) video_items on true
     left join lateral (
       select json_agg(json_build_object(
         'id', qva.id,
         'letter', qva.letter,
         'text', qva.content,
         'isCorrect', qva.is_correct,
         'explanation', qva.explanation,
         'reference', qva.reference_text,
         'tip', qva.tip
       ) order by qva.position) as items
       from question_version_alternatives qva
       where qva.question_version_id = qv.id
     ) alternative_items on true
     left join question_stats qs on qs.question_id = q.id
     left join lateral (
       select coalesce(json_object_agg(answer_distribution.letter, json_build_object(
         'percentage', answer_distribution.percentage,
         'responseCount', answer_distribution.response_count
       )), '{}'::json) as items
       from (
         select
           qva.letter,
           count(qa.id)::int as response_count,
           round(100.0 * count(qa.id) / nullif(qs.total_answers, 0))::int as percentage
         from question_version_alternatives qva
         left join question_answers qa
           on qa.alternative_id = qva.id
          and qa.question_id = q.id
          and qa.question_version_id = qv.id
         where qva.question_version_id = qv.id
         group by qva.letter
       ) answer_distribution
     ) distribution on true
     left join lateral (
       select coalesce(json_agg(qp.position_id), '[]'::json) as items
       from question_positions qp
       where qp.question_id = q.id
     ) position_items on true
     where (($1::text is null and q.status <> 'archived'::question_status) or ($1::text is not null and q.status::text = $1))
       and ($2::uuid is null or q.id = $2)
     order by coalesce(q.published_at, q.updated_at) desc, q.created_at desc
     limit 100`,
    [status || null, questionId || null]
  )
  return result.rows
}

export async function changeAdminQuestionStatus(
  questionId: string,
  actorId: string,
  status: "published" | "archived"
) {
  return withDatabaseTransaction(async (client) => {
    const question = await client.query<{ id: string; version_id: string; status: string }>(
      `select q.id, q.status::text, qv.id as version_id
       from questions q
       join question_versions qv on qv.question_id = q.id and qv.version = q.current_version
       where q.id = $1
       for update`,
      [questionId]
    )
    const row = question.rows[0]
    if (!row) throw new Error("Questão não encontrada.")

    if (status === "published") {
      await client.query(
        `update questions
         set status = 'published'::question_status, published_at = coalesce(published_at, now()), archived_at = null,
             updated_by = $2, updated_at = now()
         where id = $1`,
        [questionId, actorId]
      )
      await client.query(
        `update question_publications
         set revoked_at = now(), revoked_by = $2
         where question_id = $1 and revoked_at is null`,
        [questionId, actorId]
      )
      await client.query(
        `insert into question_publications (question_id, question_version_id, published_by)
         values ($1, $3, $2)`,
        [questionId, actorId, row.version_id]
      )
    } else {
      await client.query(
        `update questions
         set status = 'archived'::question_status, archived_at = now(), updated_by = $2, updated_at = now()
         where id = $1`,
        [questionId, actorId]
      )
      await client.query(
        `update question_publications
         set revoked_at = now(), revoked_by = $2
         where question_id = $1 and revoked_at is null`,
        [questionId, actorId]
      )
    }
    return { id: questionId, status }
  })
}

export async function publishAllAdminQuestions(actorId: string) {
  return withDatabaseTransaction(async (client) => {
    const pending = await client.query<{ id: string; version_id: string }>(
      `select q.id, qv.id as version_id
       from questions q
       join question_versions qv on qv.question_id = q.id and qv.version = q.current_version
       where q.status in ('draft'::question_status, 'in_review'::question_status)
       for update`
    )
    if (!pending.rowCount) return { publishedCount: 0 }

    const ids = pending.rows.map((row) => row.id)
    await client.query(
      `update question_publications
       set revoked_at = now(), revoked_by = $1
       where question_id = any($2::uuid[]) and revoked_at is null`,
      [actorId, ids]
    )
    await client.query(
      `update questions
       set status = 'published'::question_status, published_at = now(), archived_at = null,
           updated_by = $1, updated_at = now()
       where id = any($2::uuid[])`,
      [actorId, ids]
    )
    for (const row of pending.rows) {
      await client.query(
        `insert into question_publications (question_id, question_version_id, published_by)
         values ($1, $2, $3)`,
        [row.id, row.version_id, actorId]
      )
    }
    return { publishedCount: pending.rows.length }
  })
}

export type UpdateAdminQuestionInput = Omit<CreateAdminQuestionInput, "status"> & {
  status?: "draft" | "in_review" | "published"
}

export async function updateAdminQuestion(questionId: string, actorId: string, input: UpdateAdminQuestionInput) {
  return withDatabaseTransaction(async (client) => {
    const existing = await client.query<{ version_id: string; version: number }>(
      `select qv.id as version_id, qv.version
       from questions q join question_versions qv on qv.question_id = q.id and qv.version = q.current_version
       where q.id = $1 for update`, [questionId]
    )
    const current = existing.rows[0]
    if (!current) throw new Error("Questão não encontrada.")
    const type = await validateTaxonomy(client, input)
    const statement = requiredText(input.statement, "O enunciado")
    const nextStatus = input.status ?? "draft"
    const published = nextStatus === "published"
    const nextVersion = current.version + 1

    await client.query(
      `update questions set status = $2::question_status, visibility = $3::question_visibility,
       is_original = $4, allow_comments = $5, review_mode = $6, current_version = $7,
       updated_by = $8, updated_at = now(), published_at = case when $2 = 'published' then now() else null end,
       archived_at = null, question_difficulty_id = $9, question_type_id = $10, education_level_id = $11,
       exam_board_id = $12, discipline_id = $13, subject_id = $14, topic_id = $15, subtopic_id = $16, exam_id = $17
       where id = $1`,
      [questionId, nextStatus, input.visibility ?? "public", input.isOriginal, input.allowComments ?? true, input.reviewMode ?? false, nextVersion, actorId,
        input.difficultyId, input.questionTypeId, input.educationLevelId ?? null, input.examBoardId ?? null, input.disciplineId, input.subjectId ?? null, input.topicId ?? null, input.subtopicId ?? null, input.examId ?? null]
    )
    const version = await client.query<{ id: string }>(
      `insert into question_versions (question_id, version, support_text, statement, resolution, tip, created_by, published_at)
       values ($1, $2, $3, $4, $5, $6, $7, case when $8 then now() else null end) returning id`,
      [questionId, nextVersion, nullableText(input.supportText), statement, nullableText(input.resolution), nullableText(input.tip), actorId, published]
    )
    const versionId = version.rows[0].id
    for (const [index, alternative] of input.alternatives.entries()) {
      await client.query(
        `insert into question_version_alternatives (question_version_id, letter, content, explanation, reference_text, tip, is_correct, position)
         values ($1,$2,$3,$4,$5,$6,$7,$8)`,
        [versionId, requiredText(alternative.letter, "A letra da alternativa"), requiredText(alternative.content, `A alternativa ${alternative.letter}`), nullableText(alternative.explanation), nullableText(alternative.referenceText), nullableText(alternative.tip), alternative.isCorrect, index + 1]
      )
    }
    for (const value of (input.objectives ?? []).map((item) => item.trim()).filter(Boolean).entries()) {
      await client.query(`insert into question_objectives (question_version_id, content, position) values ($1,$2,$3)`, [versionId, value[1], value[0] + 1])
    }
    for (const value of (input.references ?? []).map((item) => item.trim()).filter(Boolean).entries()) {
      await client.query(`insert into question_references (question_version_id, content, position) values ($1,$2,$3)`, [versionId, value[1], value[0] + 1])
    }
    await client.query(`delete from question_positions where question_id = $1`, [questionId])
    for (const positionId of input.positionIds ?? []) {
      await client.query(
        `insert into question_positions (question_id, exam_id, position_id, created_by) values ($1,$2,$3,$4)`,
        [questionId, input.examId ?? null, positionId, actorId]
      )
    }
    await client.query(`update question_publications set revoked_at = now(), revoked_by = $2 where question_id = $1 and revoked_at is null`, [questionId, actorId])
    if (published) {
      await client.query(`insert into question_publications (question_id, question_version_id, published_by) values ($1,$2,$3)`, [questionId, versionId, actorId])
    }
    return { id: questionId, versionId, format: type.answer_format }
  })
}
