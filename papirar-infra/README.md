# Infraestrutura local do Papirar

No Kali/WSL, execute:

```bash
cd /mnt/c/Users/Ignotus/plataforma_papirar/papirar-infra
docker compose up -d
docker compose ps
```

| Serviço | Endereço local | Uso |
| --- | --- | --- |
| Web/API | `127.0.0.1:3000` | Next.js App Router e Route Handlers |
| API dedicada | `127.0.0.1:3001` | Serviço Node.js/TypeScript separado |
| Worker | interno | Consumidor da fila `papirar.events` |
| PostgreSQL | `127.0.0.1:5432` | Dados relacionais |
| PgBouncer | `127.0.0.1:6432` | Pool da futura API |
| Redis | `127.0.0.1:6379` | Cache e rate limit |
| RabbitMQ | `127.0.0.1:5672` | Filas de workers |
| RabbitMQ UI | `http://127.0.0.1:15672` | Administração de filas |
| MinIO API | `http://127.0.0.1:9000` | Simulação local de R2/S3 |
| MinIO UI | `http://127.0.0.1:9001` | Administração de objetos |

A API usa Redis para cache/rate limit e RabbitMQ para eventos assíncronos. O worker
processa a fila `papirar.events`, aplica até três tentativas com backoff e encaminha
mensagens que continuam falhando para `papirar.events.dlq`.

A autenticação do backend exige um token Firebase ID no header
`Authorization: Bearer <token>`. O serviço verifica assinatura e revogação do token,
sincroniza o UID em `app_users` e consulta os papéis no PostgreSQL. As credenciais
Firebase Admin devem ser fornecidas somente por variáveis de ambiente; nunca entram
no repositório.

As variáveis locais ficam em `.env`, ignorado pelo Git. Use `.env.example` como
modelo para novos ambientes.

```bash
# Para sem apagar os dados
docker compose stop

# Acompanha os logs
docker compose logs -f

# Apaga containers e volumes locais
docker compose down -v
```

Cloudflare, Vercel, AWS/ECS, R2 real, Secrets Manager, Sentry, CI/CD e backups
externos são recursos de produção e dependem de suas contas e credenciais.
