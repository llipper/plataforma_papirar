# Plataforma Educacional — Infraestrutura e Arquitetura

Este documento descreve a arquitetura de infraestrutura planejada para a plataforma, considerando segurança, alta disponibilidade, escalabilidade horizontal e suporte inicial a milhares de usuários simultâneos.

A plataforma possui recursos como:

- Banco de questões
- Criação e gerenciamento de questões
- Simulados
- Vade Mecum / legislação
- Cadernos de estudos
- Materiais didáticos
- Textos e conteúdos estruturados
- PDFs
- Imagens
- Áudios
- Links e vídeos
- Estatísticas
- Progresso de estudo
- Autenticação de usuários
- Painel administrativo
- Processamentos assíncronos
- Recursos de IA

> **Importante:** nenhuma arquitetura garante, por si só, um número específico de usuários simultâneos. A capacidade real deverá ser validada por testes de carga e observabilidade em produção.

---

# 1. Objetivos da arquitetura

A infraestrutura deve ser projetada para:

- suportar inicialmente mais de 5.000 usuários simultâneos;
- permitir crescimento horizontal;
- evitar pontos únicos de falha;
- manter banco de dados e serviços internos protegidos;
- distribuir conteúdo estático globalmente;
- suportar grandes volumes de questões e materiais;
- armazenar PDFs, imagens e áudios de forma eficiente;
- processar tarefas pesadas fora das requisições HTTP;
- implementar cache distribuído;
- possuir rate limiting;
- possuir backups automáticos;
- permitir recuperação de desastre;
- possuir logs, métricas e rastreamento;
- permitir deploys automatizados;
- separar frontend, backend, banco, cache e workers.

---

# 2. Stack principal

| Componente | Tecnologia | Responsabilidade |
|---|---|---|
| Frontend | Next.js + Vercel | Interface web |
| CDN / WAF | Cloudflare | CDN, segurança, WAF e proteção DDoS |
| Backend | Node.js + TypeScript | API e regras de negócio |
| Containers | Docker | Empacotamento da API e workers |
| Orquestração | ECS/Fargate ou Kubernetes | Execução e escalabilidade dos containers |
| Load Balancer | ALB | Distribuição das requisições |
| Banco principal | PostgreSQL | Dados permanentes |
| Connection Pool | PgBouncer | Gerenciamento das conexões PostgreSQL |
| Cache | Redis | Cache distribuído |
| Rate Limit | Redis | Controle de requisições |
| Estado temporário | Redis | Dados efêmeros |
| Filas | SQS / RabbitMQ | Processamento assíncrono |
| Object Storage | Cloudflare R2 | PDFs, imagens, áudio e arquivos |
| Autenticação | Firebase Authentication / Auth0 | Identidade |
| Secrets | Secrets Manager | Chaves, senhas e credenciais |
| Monitoramento | Sentry + OpenTelemetry + Grafana | Erros, métricas e tracing |
| CI/CD | GitHub Actions | Testes, build e deploy |
| Backup | PostgreSQL + Object Storage | Recuperação |
| Teste de carga | k6 | Validação de capacidade |

---

# 3. Arquitetura geral

```text
                         INTERNET
                            │
                            ▼
                ┌─────────────────────┐
                │     Cloudflare      │
                │                     │
                │ DNS                 │
                │ CDN                 │
                │ WAF                 │
                │ DDoS Protection     │
                │ Rate Limiting       │
                └─────────┬───────────┘
                          │
             ┌────────────┴────────────┐
             │                         │
             ▼                         ▼
      ┌───────────────┐         ┌───────────────┐
      │   FRONTEND    │         │  API/BACKEND  │
      │               │         │               │
      │ Next.js       │         │ Load Balancer │
      │ Vercel        │         └───────┬───────┘
      └───────────────┘                 │
                              ┌─────────┼─────────┐
                              │         │         │
                              ▼         ▼         ▼
                           Docker    Docker    Docker
                           API #1    API #2    API #N
                              │         │         │
                              └─────────┼─────────┘
                                        │
                    ┌───────────────────┼──────────────────┐
                    │                   │                  │
                    ▼                   ▼                  ▼
               PgBouncer             Redis              Queue
                    │                                      │
                    ▼                                      ▼
              PostgreSQL                               Workers
                    │                                      │
           ┌────────┴────────┐                  ┌──────────┼──────────┐
           ▼                 ▼                  ▼          ▼          ▼
        Primary           Replica              IA        Email       PDF
           │
           ▼
        Backups


                 ┌──────────────────────┐
                 │    Cloudflare R2     │
                 │                      │
                 │ PDFs                 │
                 │ Imagens              │
                 │ Áudios               │
                 │ Avatares             │
                 │ Anexos               │
                 └──────────────────────┘
```

---

# 4. Frontend

## Tecnologia

```text
Next.js
TypeScript
Vercel
```

O frontend deve permanecer separado da infraestrutura principal da API.

Responsabilidades:

- renderização da aplicação;
- interface do aluno;
- painel administrativo;
- navegação;
- autenticação do cliente;
- consumo da API;
- SSR quando necessário;
- conteúdo público;
- gerenciamento do estado da interface.

O frontend nunca deverá acessar diretamente:

```text
PostgreSQL
Redis
SQS
Secrets Manager
```

Todo acesso aos dados privados deve passar pela API.

---

# 5. Cloudflare

O Cloudflare representa a primeira camada pública da infraestrutura.

```text
Internet
   │
   ▼
Cloudflare
   │
   ├── DNS
   ├── CDN
   ├── WAF
   ├── DDoS Protection
   ├── Bot Protection
   └── Rate Limiting
```

Responsabilidades:

- DNS;
- proteção contra DDoS;
- Web Application Firewall;
- bloqueio de tráfego malicioso;
- cache;
- distribuição de conteúdo;
- proteção de endpoints;
- regras de firewall;
- rate limiting de borda.

---

# 6. Backend

## Stack

```text
Node.js
TypeScript
Docker
```

A API deverá ser **stateless** sempre que possível.

Não manter:

```text
sessões locais
arquivos locais permanentes
cache local crítico
estado necessário entre requisições
```

Isso permite executar várias instâncias simultaneamente.

Exemplo:

```text
                   Load Balancer
                         │
             ┌───────────┼───────────┐
             ▼           ▼           ▼
           API #1      API #2      API #3
             │           │           │
             └───────────┼───────────┘
                         │
                     Serviços
```

Quando a demanda aumentar:

```text
3 containers
     │
     ▼
6 containers
     │
     ▼
10 containers
     │
     ▼
20 containers
```

sem alterar a arquitetura da aplicação.

---

# 7. Docker

Cada serviço deve possuir sua própria imagem Docker.

Exemplo:

```text
services/

├── api/
│   └── Dockerfile
│
├── worker-ai/
│   └── Dockerfile
│
├── worker-email/
│   └── Dockerfile
│
├── worker-files/
│   └── Dockerfile
│
└── worker-statistics/
    └── Dockerfile
```

Docker será responsável por:

- padronizar ambiente;
- facilitar deploy;
- isolamento;
- versionamento;
- escalabilidade;
- execução de workers.

---

# 8. Orquestração

Existem duas opções principais:

```text
AWS ECS + Fargate
```

ou

```text
Kubernetes
```

Para uma arquitetura com menor complexidade operacional inicial:

```text
ECS
+
Fargate
+
Application Load Balancer
```

é uma opção adequada.

Kubernetes pode ser adotado posteriormente caso a complexidade e escala operacional justifiquem.

---

# 9. Load Balancer

O backend não deve depender de uma única instância.

```text
                  ALB
                   │
        ┌──────────┼──────────┐
        ▼          ▼          ▼
      API #1     API #2     API #3
```

O Load Balancer distribui as requisições entre instâncias saudáveis.

Também deverá possuir:

```text
Health Checks
HTTPS
timeouts configurados
logs
```

---

# 10. PostgreSQL

PostgreSQL será o banco de dados principal.

Ele armazenará dados permanentes e relacionais.

Exemplos:

```text
users
profiles

disciplines
subjects
topics

questions
question_options
question_answers
question_reports

simulations
simulation_questions
attempts
attempt_answers

notebooks
materials
material_resources

laws
law_versions
law_nodes

annotations
highlights

careers
education_levels
difficulty_levels
exam_boards
competitions

subscriptions
plans
payments

study_sessions
reading_progress
statistics
```

---

# 11. Estrutura relacional

Exemplo:

```text
Question
   │
   ├── Discipline
   │
   ├── Subject
   │
   ├── Topic
   │
   ├── Difficulty
   │
   ├── Exam Board
   │
   ├── Competition
   │
   ├── Career
   │
   └── Education Level
```

Isso torna PostgreSQL adequado para o domínio da aplicação.

---

# 12. PgBouncer

A aplicação não deverá criar conexões ilimitadas diretamente com PostgreSQL.

Fluxo:

```text
5.000 usuários
      │
      ▼
Containers da API
      │
      ▼
PgBouncer
      │
      ▼
PostgreSQL
```

PgBouncer funcionará como connection pool.

Exemplo conceitual:

```text
5.000 usuários
      ↓
10 APIs
      ↓
PgBouncer
      ↓
pool controlado
      ↓
PostgreSQL
```

O tamanho correto do pool deverá ser definido por benchmark.

---

# 13. Redis

Redis será utilizado como armazenamento temporário e cache.

Não substituirá PostgreSQL.

Arquitetura:

```text
API
 │
 ▼
Redis
 │
 ├── HIT
 │    └── retorna dado
 │
 └── MISS
      │
      ▼
 PostgreSQL
      │
      ▼
    Redis
```

---

# 14. Cache

Possíveis dados armazenados em cache:

```text
disciplinas
assuntos
bancas
concursos
cadernos
materiais populares
questões populares
dashboard
permissões
planos
configurações
estatísticas agregadas
```

Exemplo:

```text
question:8821

material:192

notebook:29

dashboard:user:182

permissions:user:182
```

Cada tipo deverá possuir TTL apropriado.

---

# 15. Rate Limiting

Redis também poderá controlar limites.

Exemplo:

```text
rate:ip:192.168.x.x

rate:user:182

rate:login:user@email.com

rate:ai:user:182

rate:password-reset:182
```

Endpoints sensíveis devem possuir limites diferentes.

Principalmente:

```text
/login

/signup

/password-reset

/email-verification

/ai/*

/questions/import

/files/upload
```

Cloudflare poderá aplicar uma primeira camada de rate limiting antes da aplicação.

---

# 16. Filas

Processamentos pesados não devem acontecer dentro da requisição HTTP.

Evitar:

```text
REQUEST
   ↓
gerar IA
   ↓
gerar PDF
   ↓
enviar email
   ↓
calcular relatório
   ↓
RESPONSE
```

Utilizar:

```text
USER
 │
 ▼
API
 │
 ├──────────────→ DATABASE
 │
 └──────────────→ QUEUE
                       │
             ┌─────────┼─────────┐
             ▼         ▼         ▼
          Worker     Worker    Worker
            IA        PDF      Email
```

---

# 17. Workers

Workers poderão ser separados por responsabilidade.

```text
workers/

├── ai
├── email
├── files
├── pdf
├── statistics
├── imports
└── notifications
```

Isso permite escalar individualmente.

Por exemplo:

```text
API

10 instâncias

Worker AI

20 instâncias

Worker Email

2 instâncias

Worker PDF

5 instâncias
```

dependendo da demanda.

---

# 18. Cloudflare R2

Arquivos não deverão ser armazenados diretamente no PostgreSQL.

R2 armazenará:

```text
PDF
áudio
imagem
avatar
documentos
anexos
arquivos de questões
materiais
```

Exemplo:

```text
bucket/

├── users/
│   └── avatars/
│
├── materials/
│   ├── pdf/
│   ├── images/
│   └── attachments/
│
├── questions/
│   └── images/
│
├── laws/
│   └── audio/
│
└── exports/
```

PostgreSQL armazenará apenas metadados.

Exemplo:

```text
materials

id
title
type
object_key
mime_type
size
created_at
```

---

# 19. Upload seguro

Fluxo recomendado:

```text
USER
 │
 ▼
API
 │
 ├── autenticação
 ├── autorização
 ├── validação
 └── gera URL assinada
          │
          ▼
          R2
```

Para arquivos privados:

```text
Private Bucket
     │
     ▼
Signed URL
     │
     ▼
User
```

As URLs devem possuir expiração.

---

# 20. Autenticação

Pode ser utilizado:

```text
Firebase Authentication
```

ou outro provedor compatível.

Fluxo:

```text
USER
 │
 ▼
Firebase Auth
 │
 ▼
ID Token
 │
 ▼
API
 │
 ▼
Token Validation
 │
 ▼
Authorization
 │
 ▼
Resource
```

Autenticação e autorização são responsabilidades diferentes.

```text
Authentication

"Quem é você?"

Authorization

"O que você pode fazer?"
```

---

# 21. RBAC

A aplicação deverá possuir controle de acesso por papéis.

Exemplo:

```text
SUPER_ADMIN

ADMIN

EDITOR

TEACHER

STUDENT
```

Exemplo de permissões:

```text
questions.create
questions.update
questions.delete

materials.create
materials.update

notebooks.manage

users.manage

reports.view

billing.manage
```

Nunca confiar apenas na interface para bloquear ações.

Toda permissão deve ser validada no backend.

---

# 22. Secrets

Nunca armazenar secrets diretamente no código.

Não:

```text
DATABASE_PASSWORD=123456
```

dentro do repositório.

Utilizar:

```text
AWS Secrets Manager
```

ou solução equivalente.

Armazenar:

```text
DATABASE_URL

REDIS_URL

JWT_SECRET

R2_SECRET

FIREBASE_PRIVATE_KEY

EMAIL_PASSWORD

AI_API_KEY

PAYMENT_SECRET
```

---

# 23. Rede privada

PostgreSQL e Redis não devem ficar expostos publicamente.

Arquitetura:

```text
                     INTERNET
                        │
                        ▼
                   Cloudflare
                        │
                        ▼
                  Load Balancer
                        │
                        ▼
                     API
                        │
              PRIVATE NETWORK
                 │           │
                 ▼           ▼
            PostgreSQL     Redis
```

Somente serviços autorizados devem acessar a rede interna.

---

# 24. Segurança

A infraestrutura deverá implementar:

```text
HTTPS/TLS
WAF
DDoS Protection
Rate Limiting
RBAC
MFA administrativo
Secrets Management
Network Isolation
Input Validation
SQL Parameterization
Audit Logs
Signed URLs
CORS restritivo
CSP
Security Headers
File Validation
Backup
Monitoring
```

---

# 25. Segurança de uploads

Uploads são uma superfície importante de ataque.

Validar:

```text
extensão
MIME type
tamanho
assinatura do arquivo
permissão
```

Quando aplicável:

```text
upload
   ↓
quarantine
   ↓
malware scan
   ↓
approved
   ↓
storage definitivo
```

Nunca executar arquivos enviados pelo usuário.

---

# 26. PostgreSQL High Availability

Produção não deve depender de uma única instância.

```text
               PostgreSQL
                    │
          ┌─────────┴─────────┐
          ▼                   ▼
       Primary             Replica
          │                   │
         AZ A                 AZ B
```

Caso o primary falhe:

```text
Primary
   X

   ↓

Failover

   ↓

Replica → Primary
```

Preferencialmente utilizar PostgreSQL gerenciado com failover automático.

---

# 27. Backup

Implementar múltiplas camadas.

```text
PostgreSQL
   │
   ├── automated backups
   │
   ├── snapshots
   │
   ├── Point-in-Time Recovery
   │
   └── disaster recovery
```

Também é importante manter cópias fora do ambiente principal.

Backup sem teste de restauração não deve ser considerado suficiente.

Periodicamente executar:

```text
RESTORE TEST
```

---

# 28. Redis High Availability

Redis deverá preferencialmente ser gerenciado.

Configuração esperada:

```text
Redis
 │
 ├── TLS
 ├── ACL
 ├── Private Network
 ├── Replication
 ├── Monitoring
 └── Automatic Failover
```

Redis deve ser tratado prioritariamente como camada temporária.

A aplicação deve continuar funcional caso o cache fique indisponível.

```text
Redis funcionando

API
 ↓
Redis
 ↓
rápido
```

Falha:

```text
Redis indisponível
       ↓
PostgreSQL
       ↓
sistema continua funcionando
```

com possível degradação de performance.

---

# 29. Observabilidade

Não basta saber que o sistema caiu.

É necessário saber:

```text
o que aconteceu
quando aconteceu
onde aconteceu
qual usuário foi afetado
qual endpoint
qual serviço
quanto demorou
qual dependência falhou
```

---

# 30. Sentry

Utilizar para:

```text
exceptions
stack traces
frontend errors
backend errors
performance problems
release tracking
```

---

# 31. OpenTelemetry

Utilizar tracing distribuído.

Exemplo:

```text
Request

Cloudflare
    ↓
Load Balancer
    ↓
API
    ↓
Redis
    ↓
PostgreSQL
    ↓
Queue
    ↓
Worker
```

Um `trace_id` deverá permitir acompanhar a requisição pelos diferentes serviços.

---

# 32. Métricas

Monitorar pelo menos:

```text
CPU

RAM

requests/sec

response time

p50
p95
p99

HTTP 4xx
HTTP 5xx

database connections

database query duration

Redis hit rate

Redis memory

queue size

worker processing time

failed jobs

active containers
```

---

# 33. Logs

Utilizar logs estruturados.

Exemplo:

```json
{
  "level": "info",
  "service": "api",
  "requestId": "req_82js91",
  "userId": "user_182",
  "route": "/api/questions",
  "method": "GET",
  "status": 200,
  "durationMs": 43
}
```

Nunca registrar:

```text
senha
token completo
private key
dados de cartão
secrets
```

---

# 34. Health Checks

Criar endpoints separados.

```text
/health
```

Verifica se a aplicação está funcionando.

```text
/ready
```

Verifica se está pronta para receber tráfego.

Exemplo:

```json
{
  "status": "ok",
  "database": "ok",
  "redis": "ok"
}
```

Evitar expor detalhes sensíveis publicamente.

---

# 35. CI/CD

Pipeline:

```text
Developer
    │
    ▼
GitHub
    │
    ▼
Pull Request
    │
    ├── lint
    ├── typecheck
    ├── unit tests
    ├── integration tests
    ├── security checks
    └── build
            │
            ▼
        Docker Image
            │
            ▼
     Container Registry
            │
            ▼
          Deploy
```

---

# 36. Ambientes

Separar:

```text
development

staging

production
```

Nunca utilizar banco de produção durante desenvolvimento.

Idealmente:

```text
DEV DATABASE

STAGING DATABASE

PRODUCTION DATABASE
```

Secrets também devem ser separados.

---

# 37. Deploy

Deploy deverá suportar estratégia sem indisponibilidade significativa.

Exemplo:

```text
API V1
 │
 ├── API V1
 ├── API V1
 └── API V1

deploy V2

        ↓

API V1
API V1
API V2

        ↓

health check

        ↓

API V2
API V2
API V2
```

Em caso de problema:

```text
ROLLBACK
```

---

# 38. Banco e migrations

Migrations deverão ser versionadas.

Exemplo:

```text
migrations/

001_users.sql
002_questions.sql
003_materials.sql
004_simulations.sql
005_indexes.sql
```

Deploys precisam considerar compatibilidade entre:

```text
API antiga
API nova
schema antigo
schema novo
```

para evitar downtime.

---

# 39. Índices

À medida que o banco crescer, índices tornam-se críticos.

Exemplo:

```sql
CREATE INDEX idx_questions_discipline
ON questions(discipline_id);
```

Também poderão existir índices compostos:

```sql
CREATE INDEX idx_questions_filter
ON questions (
    discipline_id,
    difficulty_id,
    exam_board_id
);
```

Índices deverão ser definidos com base nas queries reais e analisados com ferramentas como:

```sql
EXPLAIN ANALYZE
```

---

# 40. Paginação

Nunca retornar milhares de registros de uma vez.

Não:

```http
GET /questions
```

retornando 200.000 questões.

Utilizar paginação.

Preferencialmente cursor quando adequado:

```http
GET /questions?limit=30&cursor=abc123
```

Resposta:

```json
{
  "items": [],
  "nextCursor": "xyz789"
}
```

---

# 41. Busca

Inicialmente PostgreSQL pode atender diversas buscas.

Exemplo:

```text
Questões contendo:

"controle de constitucionalidade"
```

Conforme o volume e requisitos aumentarem, poderá ser avaliado um mecanismo dedicado de busca.

Exemplos:

```text
OpenSearch

Meilisearch

Typesense
```

Isso não deve ser adicionado sem necessidade comprovada.

---

# 42. Estatísticas

Evitar recalcular estatísticas complexas em todas as requisições.

Não:

```text
Dashboard
   ↓
varrer milhões de respostas
   ↓
calcular tudo
```

Preferir:

```text
Answer
   ↓
Event
   ↓
Queue
   ↓
Statistics Worker
   ↓
Aggregate
   ↓
Cache
```

Dashboard:

```text
Dashboard
   ↓
Redis / aggregate table
   ↓
Response
```

---

# 43. Arquitetura orientada a eventos

Eventos podem ser utilizados para desacoplar funcionalidades.

Exemplo:

```text
QUESTION_ANSWERED
```

Pode gerar:

```text
update_statistics
update_progress
update_streak
update_performance
```

Outro exemplo:

```text
USER_CREATED
```

Pode gerar:

```text
create_profile
send_welcome_email
initialize_preferences
```

---

# 44. Idempotência

Operações importantes devem suportar idempotência.

Principalmente:

```text
pagamentos
webhooks
jobs
imports
emails críticos
```

Exemplo:

```text
Idempotency-Key:
payment_182_2026
```

Evita executar a mesma operação duas vezes.

---

# 45. Graceful Shutdown

Containers não devem simplesmente morrer durante deploy.

Fluxo:

```text
SIGTERM
   ↓
parar novas requests
   ↓
finalizar requests atuais
   ↓
fechar conexões
   ↓
encerrar worker
```

Importante para:

```text
API
Workers
Queues
Database connections
```

---

# 46. Resiliência

Chamadas externas devem possuir:

```text
timeout
retry
exponential backoff
circuit breaker quando necessário
```

Nunca permitir que:

```text
serviço de email caiu
```

cause:

```text
API inteira caiu
```

Ou:

```text
serviço de IA caiu
```

cause indisponibilidade no estudo normal.

---

# 47. Testes de carga

Antes de declarar suporte a 5.000 usuários simultâneos, executar testes.

Ferramenta:

```text
k6
```

Cenários deverão reproduzir comportamento real.

Exemplo:

```text
login

abrir dashboard

abrir caderno

abrir material

carregar PDF

abrir Vade Mecum

salvar progresso

buscar questões

responder questão

iniciar simulado

finalizar simulado

consultar estatísticas
```

---

# 48. Teste progressivo

Exemplo:

```text
100 usuários

500 usuários

1.000 usuários

2.500 usuários

5.000 usuários

10.000 usuários
```

Monitorar:

```text
p95

p99

CPU

RAM

PostgreSQL CPU

conexões

queries lentas

Redis

queue lag

erros 5xx
```

---

# 49. SLOs

Definir objetivos mensuráveis.

Exemplo inicial:

```text
Disponibilidade:

>= 99,9%

API p95:

< 500 ms

Erro HTTP 5xx:

< 1%
```

Os valores definitivos deverão ser definidos com base nos requisitos reais do produto.

---

# 50. Disaster Recovery

Deve existir um plano para cenários como:

```text
banco corrompido

região indisponível

deploy quebrado

credencial vazada

arquivo apagado

falha do Redis

falha de provedor
```

Definir:

```text
RPO
```

quanto dado pode ser perdido.

E:

```text
RTO
```

quanto tempo pode levar para restaurar o serviço.

---

# 51. Arquitetura final

```text
                           INTERNET
                              │
                              ▼
                    ┌─────────────────┐
                    │   CLOUDFLARE    │
                    │                 │
                    │ DNS             │
                    │ CDN             │
                    │ WAF             │
                    │ DDoS            │
                    │ Rate Limit      │
                    └────────┬────────┘
                             │
               ┌─────────────┴─────────────┐
               │                           │
               ▼                           ▼
         ┌───────────┐              ┌─────────────┐
         │  VERCEL   │              │     ALB     │
         │  Next.js  │              └──────┬──────┘
         └───────────┘                     │
                                ┌──────────┼──────────┐
                                ▼          ▼          ▼
                              API        API        API
                            Docker     Docker     Docker
                                │          │          │
                                └──────────┼──────────┘
                                           │
                ┌──────────────────────────┼───────────────────────┐
                │                          │                       │
                ▼                          ▼                       ▼
            PgBouncer                    Redis                   Queue
                │                          │                       │
                ▼                          │                 ┌─────┼─────┐
           PostgreSQL                     │                 ▼     ▼     ▼
                │                          │                AI   PDF  Email
        ┌───────┴────────┐                 │
        ▼                ▼                 │
     Primary          Replica              │
        │                                  │
        ▼                                  │
     Backups                               │
                                           │
                                    Cache / Rate Limit


                 ┌──────────────────────────────┐
                 │       CLOUDFLARE R2          │
                 │                              │
                 │ PDFs                         │
                 │ Áudios                       │
                 │ Imagens                      │
                 │ Avatares                     │
                 │ Anexos                       │
                 └──────────────────────────────┘


                 ┌──────────────────────────────┐
                 │       OBSERVABILITY          │
                 │                              │
                 │ Sentry                       │
                 │ OpenTelemetry                │
                 │ Grafana                      │
                 │ Logs                         │
                 │ Metrics                      │
                 │ Traces                       │
                 └──────────────────────────────┘
```

---

# 52. Fluxo de uma requisição

Exemplo: aluno abre um caderno.

```text
Aluno
  │
  ▼
Cloudflare
  │
  ▼
Frontend
  │
  ▼
API
  │
  ▼
Redis
  │
  ├── HIT ───────────────→ Response
  │
  └── MISS
        │
        ▼
    PgBouncer
        │
        ▼
   PostgreSQL
        │
        ▼
      Redis
        │
        ▼
     Response
```

---

# 53. Fluxo de arquivo

Aluno abre um PDF:

```text
Aluno
  │
  ▼
API
  │
  ├── autenticação
  ├── autorização
  └── signed URL
          │
          ▼
     Cloudflare R2
          │
          ▼
        Aluno
```

O arquivo não precisa passar pela API inteira.

---

# 54. Fluxo de IA

```text
Aluno
  │
  ▼
API
  │
  ├── Auth
  ├── Rate Limit
  ├── valida quota
  └── cria Job
          │
          ▼
         Queue
          │
          ▼
      AI Worker
          │
          ▼
      AI Provider
          │
          ▼
      PostgreSQL
          │
          ▼
        Cache
```

---

# 55. Princípios da infraestrutura

A arquitetura deverá seguir estes princípios:

### Stateless

APIs devem poder ser destruídas e recriadas sem perda de dados.

### Horizontal Scaling

```text
mais tráfego
    ↓
mais containers
```

### Defense in Depth

Segurança deve existir em múltiplas camadas.

### Least Privilege

Cada serviço recebe somente as permissões necessárias.

### Fail Gracefully

Falhas secundárias não devem derrubar o produto inteiro.

### Observability First

Todo serviço importante deve produzir:

```text
logs
metrics
traces
```

### Automate Everything

Automatizar:

```text
testes
deploy
backup
monitoramento
alertas
scaling
```

---

# 56. Resultado esperado

A arquitetura deverá permitir evolução semelhante a:

```text
5.000 usuários simultâneos
            │
            ▼
10.000
            │
            ▼
30.000
            │
            ▼
50.000+
```

sem exigir uma reescrita completa da aplicação.

O crescimento deverá ocorrer principalmente através de:

```text
mais containers

mais workers

mais capacidade PostgreSQL

read replicas quando necessárias

mais memória/cache Redis

otimização de queries

CDN/cache

particionamento quando realmente necessário
```

---

# 57. Regra fundamental

A capacidade da plataforma não será determinada apenas pelas tecnologias escolhidas.

```text
Arquitetura
+
Código
+
Queries
+
Índices
+
Cache
+
Infraestrutura
+
Testes de carga
+
Observabilidade
=
Capacidade real
```

Portanto, a afirmação de suporte a **5.000+ usuários simultâneos** somente deverá ser feita após testes de carga representativos do comportamento real dos usuários.

---

# 58. Stack resumida

```text
Frontend
└── Next.js
    └── Vercel

Edge
└── Cloudflare
    ├── DNS
    ├── CDN
    ├── WAF
    ├── DDoS
    └── Rate Limiting

Backend
└── Node.js + TypeScript
    └── Docker
        └── ECS/Fargate

Traffic
└── Application Load Balancer

Database
└── PostgreSQL
    ├── PgBouncer
    ├── Primary
    ├── Replica
    ├── PITR
    └── Backups

Cache
└── Redis
    ├── Cache
    ├── Rate Limit
    └── Temporary State

Async
└── SQS / RabbitMQ
    └── Workers
        ├── AI
        ├── Email
        ├── PDF
        ├── Import
        └── Statistics

Storage
└── Cloudflare R2
    ├── PDF
    ├── Images
    ├── Audio
    └── Attachments

Authentication
└── Firebase Authentication

Secrets
└── Secrets Manager

Observability
├── Sentry
├── OpenTelemetry
└── Grafana

CI/CD
└── GitHub Actions

Load Testing
└── k6
```

---

## Status

```text
Architecture: Planned
Target: 5,000+ concurrent users
Scaling strategy: Horizontal
Database: PostgreSQL
Cache: Redis
Object Storage: Cloudflare R2
Containers: Docker
Backend: Node.js + TypeScript
Frontend: Next.js
```