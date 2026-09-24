# Módulos SQL

Esta pasta contém a estrutura relacional do Papirar, organizada por migrações versionadas.

## Organização

- `migrations/`: alterações de schema em ordem numérica.
- `seeds/`: dados controlados para desenvolvimento, sem dados fictícios de produção.
- `infra/`: provisionamento de roles e permissões do PostgreSQL, executado separadamente por um administrador.
- `queries/`: consultas nomeadas quando uma consulta não puder ficar no repositório da feature.

## Questões

A migração `001_create_questions.sql` define a arquitetura completa do domínio: identidade,
organizações, papéis, questões, versões imutáveis, publicação, respostas, estatísticas e
auditoria. Isso evita alterações destrutivas e mantém cada responsabilidade isolada.

O frontend ainda usa Firebase/Firestore. Portanto, esta estrutura é a base SQL e não é
executada automaticamente pela aplicação até que um adaptador de persistência e um banco
PostgreSQL sejam configurados.

## Taxonomias de questões

A migração `002_create_question_taxonomies.sql` adiciona catálogos globais para níveis de
dificuldade, níveis educacionais, bancas examinadoras e tipos de questão. Ela mantém os
campos textuais/enum antigos em `questions` durante a transição e acrescenta chaves
estrangeiras novas, auditoria e índices parciais para consultas de questões publicadas.

A migração `003_create_subjects_and_careers_taxonomies.sql` adiciona as hierarquias
administrativas que não existiam no modelo inicial: Disciplina -> Assunto -> Tópico ->
Subtópico e Carreira -> Instituição -> Órgão -> Concurso -> Cargo. Essas tabelas suportam
o fluxo de criação inline usado na administração.

A migration `004_add_career_exam_location_fields.sql` cria os catálogos geográficos e
associa a UF/abrangência ao órgão (`career_agencies`). A migration
`005_move_location_fields_to_career_agencies.sql` cria as relações entre questões,
concursos e cargos. A migration `006_expand_geographic_taxonomies.sql` adiciona esfera
administrativa e região geográfica. A migration `007_security_hardening.sql` aplica o
baseline de RLS, contexto seguro de auditoria e guards de integridade geográfica.

O concurso (`career_exams`) guarda nome e ano; a localidade permanece no órgão.

Não aplique a migração em produção sem um plano de backfill e sem o adaptador de
autorização da API: os IDs novos começam opcionais justamente para não invalidar registros
existentes.

## Ordem de execução

1. Migrations `001` até `006`, em ordem numérica.
2. Seed geográfico `001_geographic_reference_data.sql`.
3. Seeds de catálogos: dificuldades, níveis educacionais, tipos de questão, disciplinas e bancas.
4. Seed acadêmico `007_academic_taxonomy.sql`.
5. Seeds de carreiras: `001_security_public_careers.sql` e `008_additional_careers.sql`.
6. Seeds de taxonomia por domínio, em ordem: `009_missing_disciplines.sql` e depois `010_taxonomy_portugues.sql` até `029_taxonomy_ppce.sql`. O seed `030_concurso_ppce.sql` cria o concurso e o cargo após a taxonomia. Cada arquivo é independente por disciplina/domínio e pode ser reaplicado com segurança.
7. Migrations `007_security_hardening.sql`, `008_auth_identity_sync.sql`, `009_admin_identity_allowlist.sql`, `010_admin_uid_binding.sql`, `011_admin_allowlist_active_guard.sql`, `012_fix_auth_user_upsert.sql`, `013_qualify_admin_allowlist_columns.sql`, `014_unique_exam_year_per_agency.sql`, `015_question_type_alternatives_4_5.sql`, `016_question_publication_settings.sql`, `017_question_answer_idempotency_and_stats.sql`, `018_question_public_feed_indexes.sql`, `019_question_answer_aggregation_dedup.sql`, `020_question_answer_outbox.sql` e `021_question_answers_user_history_idx.sql`.
8. Execute `infra/001_roles_and_permissions.sql` por último, com administrador do cluster.

### Pacote de taxonomia

O pacote `009`–`029` mantém a separação `disciplina → assunto → tópico → subtópico`.
Os arquivos `001`–`008` existentes continuam sendo a fonte dos catálogos anteriores;
os novos arquivos adicionam as áreas comuns de Português, Matemática, Informática,
Tecnologia da Informação, Segurança Cibernética, Direito Militar, Legislação de Trânsito,
Criminologia, Medicina Legal, Segurança Pública, línguas, redação, humanidades,
ciências e conhecimentos gerais/regionais. A operação usa chaves naturais por pai
(`slug` + entidade-pai), portanto é idempotente e não cria duplicatas ao ser reaplicada.

Os arquivos `002_disciplines_and_exam_boards.sql` e
`004_create_geographic_taxonomies.sql` são apenas guardas de compatibilidade; não criam
DDL nem duplicam dados.

## Regras

- Migrações são aditivas e numeradas; não editar uma migração já aplicada.
- IDs externos nunca devem ser usados para autorização sem validação no servidor.
- O gabarito deve ser protegido no backend e não exposto antes do envio da resposta.
- Conteúdo HTML deve ser sanitizado antes de ser armazenado ou renderizado.
- Estatísticas são derivadas de respostas, não valores digitados manualmente no frontend.
- O gabarito pertence à versão da questão e só pode ser retornado por uma operação autorizada.
- Publicação deve ocorrer por fluxo de revisão e gerar registro em `question_publications`.
- A aplicação deve configurar `SET LOCAL app.user_id`, `SET LOCAL app.role` e, em operações administrativas, `SET LOCAL app.actor_id` na mesma transação da operação.
- A role de runtime não pode ser owner das tabelas, superuser, `CREATEDB` ou `CREATEROLE`.
- A identidade externa deve ser validada pelo backend antes de sincronizar `app_users`; e-mail não substitui o UID do provedor.
- O arquivo `infra/001_roles_and_permissions.sql` deve ser executado por pipeline/operador controlado, nunca pela aplicação.
- Migrations e seeds devem falhar integralmente em caso de erro; não executar arquivos parcialmente.

Os lotes editoriais do PPCE ficam em `../ppce`. Os seeds de questões do PPCE
foram removidos para reconstrução; permanecem apenas os seeds de taxonomia e
concurso, que não devem ser confundidos com conteúdo de questões.
