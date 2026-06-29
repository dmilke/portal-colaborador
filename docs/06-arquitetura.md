# 06 - Arquitetura

**Projeto:** Portal do Colaborador

**Versão:** 1.0.0

**Status:** CONGELADO

---

# Objetivo

Definir a arquitetura técnica oficial do Portal do Colaborador.

---

# Arquitetura Geral

O sistema utilizará arquitetura em camadas.

```
Frontend
│
├── React
├── Next.js
├── TypeScript
├── Tailwind CSS
└── shadcn/ui
        │
        ▼
Supabase
│
├── Auth
├── PostgreSQL
├── Storage
└── RLS
        │
        ▼
Banco de Dados
```

---

# Stack Tecnológica

## Frontend

* React
* Next.js
* TypeScript
* Tailwind CSS
* shadcn/ui

---

## Backend

* Supabase
* PostgreSQL
* Auth
* Storage
* Row Level Security

---

## Infraestrutura

* GitHub
* Vercel

---

# Estrutura do Projeto

```
portal-colaborador/

docs/

apps/
    web/

supabase/
    migrations/
    policies/
    seeds/
    functions/

scripts/

.github/
```

---

# Autenticação

Responsabilidade exclusiva do Supabase Auth.

Nenhuma senha será armazenada em tabelas próprias.

A tabela TB_COLABORADORES utilizará o campo:

auth_user_id

como relacionamento com auth.users.

---

# Banco de Dados

* PostgreSQL
* UUID como chave primária
* Migrações SQL obrigatórias
* Foreign Keys
* Constraints
* Transactions

---

# Segurança

* HTTPS obrigatório
* RLS em todas as tabelas
* Controle por perfil
* Auditoria obrigatória

---

# Comunicação

O Frontend comunicará diretamente com o Supabase utilizando o SDK oficial.

Não haverá backend intermediário no MVP.

---

# Deploy

Fluxo oficial:

VS Code

↓

GitHub

↓

Vercel

---

# Evolução

A arquitetura suporta futuramente:

* Banco de Horas
* Escalas
* Comunicação Interna
* Documentos
* Treinamentos
* Push Notifications
* WhatsApp

---

# Sprint 9 — Workspace

O Home Dashboard (`/`) funciona como workspace personalizado do colaborador.

**Widgets modulares** (Server Components com Suspense independentes):
- Profile Summary (dados do colaborador)
- Solicitações Pendentes
- Comunicados Não Lidos
- Documentos Pendentes de Leitura
- Documentos Recentes
- Notificações Recentes
- Ações Rápidas (filtradas por RBAC)
- Atividade Recente (audit trail)

**Central de Notificações** (`/notificacoes`):
- Contagem de não lidas
- Marcar como lida / Marcar todas como lidas
- Filtro por status (lida/não lida) e tipo
- Paginação

**Padrão de Server/Client boundary:**
- Barrel exports (`index.ts`) incluem apenas tipos e Server Actions
- Serviços e repositórios são importados diretamente por Server Components
- Client Components importam apenas Server Actions para evitar bundling de `server-only`

---

# Sprint 10 — Management Center

O Centro de Gestão (`/gestao`) fornece inteligência operacional para gestores.

**Visão restrita:** Requer permissão `gestao.read` (role admin).

**Indicadores operacionais** (5 cards):
- Usuários online (últimas 24h)
- Ações pendentes
- Documentos expirados
- Comunicados expirados
- Solicitações aguardando aprovação

**Indicadores por domínio** (5 cards):
- Colaboradores: total, ativos, inativos, último login, nunca logaram
- Solicitações: pendentes, aprovadas, reprovadas, canceladas, tempo médio
- Comunicados: publicados, não lidos, taxa de leitura, mais vistos
- Documentos: publicados, pendentes, taxa de leitura, downloads, mais acessados
- Notificações: não lidas, lidas, por tipo

**Charts** (Recharts, responsivos):
- Bar chart: Solicitações por mês + por departamento
- Line chart: Comunicados por mês
- Pie chart: Distribuição de leitura (comunicados) + Notificações por tipo
- Area chart: Documentos publicados por mês
- Bar chart horizontal: Documentos mais acessados

**Filtros globais:**
- Departamento, Unidade, Cargo
- Período (data início / data fim)

**Export:**
- CSV (indicadores tabulados)
- Excel (múltiplas abas: Indicadores, Mensal, Por Departamento)
- PDF (texto formatado)

**Feature module:** `src/features/gestao/`
- `types/index.ts` — interfaces de dados
- `repositories/gestao-repository.ts` — queries complexas com joins
- `services/gestao-service.ts` — lógica de negócio
- `index.ts` — barrel exports

**Dependências:** recharts, xlsx

**Migration:** 0011_gestao_permissions.sql (gestao.read para role admin)

---

# Sprint 11 — Event Engine

O Event Engine é um sistema centralizado de eventos in-process para automação e observabilidade.

**Feature module:** `src/features/eventos/`

**Arquitetura:**
```
eventos/
├── types/index.ts           # EventType, DomainEvent, payloads
├── lib/
│   ├── event-engine.ts      # on(), dispatch(), emit()
│   ├── event-logger.ts      # Persistência no event_log
│   └── handlers/
│       ├── index.ts         # initializeEventHandlers()
│       ├── notification-handler.ts
│       └── audit-handler.ts
├── repositories/
│   └── event-log-repository.ts
├── services/
│   └── event-log-service.ts
└── index.ts                 # Barrel exports
```

**Event Types (19):**
- Auth: `login`, `logout`
- Users: `user.created`, `user.activated`, `user.deactivated`, `user.updated`
- Solicitações: `solicitacao.created`, `solicitacao.approved`, `solicitacao.rejected`, `solicitacao.cancelled`
- Comunicados: `comunicado.published`, `comunicado.read`, `comunicado.archived`
- Documentos: `documento.published`, `documento.read`, `documento.downloaded`, `documento.archived`
- Notificações: `notification.created`, `notification.read`

**API:**
- `emit(type, origin, payload, colaboradorId?)` — cria evento
- `dispatch(event)` — publica para todos os handlers registrados
- `on(eventType, handler)` — registra handler
- `off(eventType, handler)` — remove handler

**Handlers registrados:**
1. Event Log (persistência em `event_log`)
2. Notification Handler (cria notificações para aprovações/publicações)
3. Audit Handler (cria registros de auditoria)

**Observabilidade:**
- Tabela `event_log` com campos: event_type, origin, payload, status, execution_ms, error_message
- Painel (`/eventos`): stats, chart por tipo, últimos eventos
- Log (`/eventos/log`): histórico completo com filtros e paginação

**Extensibilidade:**
O padrão `on()` permite adicionar handlers para:
- n8n (webhooks)
- Evolution API (WhatsApp)
- SMTP (email)
- ERP (integração)
- Cache invalidation

**Migration:** 0012_event_engine.sql (event_log table + eventos.read permission)

---

Versão: 1.0.0

Status: CONGELADO
