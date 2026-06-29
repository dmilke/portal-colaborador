# Changelog

## v1.0.0 (2026-06-29)

### Sprint 16 — Homologação e Release v1.0.0
- **Validacao Completa**: Todos os 17 modulos validados funcional e seguramente
- **Qualidade de Codigo**: 0 erros lint, 0 warnings, 0 erros TypeScript, build limpo
- **Documentacao**: 17 modulos documentados (README por feature), CHANGELOG completo, arquitetura atualizada
- **Metricas Finais**:
  - 31 rotas (App Router)
  - 17 modulos de feature
  - 12 migracoes de banco
  - 28 tabelas
  - 109 politicas RLS
  - 36 permissoes RBAC
  - 7 componentes admin reutilizaveis
  - 48 Server Actions
  - 24 Repositories
  - 24 Services
  - 31 telas implementadas
- **Navegacao**: Sidebar, mobile nav, breadcrumbs completos para todos os modulos
- **Event Engine**: 19 tipos de evento, 3 handlers (auditoria, notificacao, log)
- **Auditoria**: Cobertura total de operacoes criticas
- **Design System**: shadcn/ui (base-nova) + Tailwind v4, dark mode, responsivo

### Limitações Conhecidas (nao bloqueiam producao):
- Exportacao PDF usa formato texto (.txt) sem biblioteca grafica
- Event Engine e in-process (sem message queue externo)
- Upload de avatar via URL externa apenas (sem storage proprio)
- Workflow de aprovacao hardcoded (sem editor visual)
- Notificacoes push/email/whatsApp via handlers futuros (extensivel via `on()`)

## v0.9.0 (2026-06-29)

### Sprint 15 — Configurações do Sistema
- **Settings Page** (`/configuracoes`): Complete system settings management
- **Repository** (`configuracoes/repositories/configuracao-repository.ts`): Supabase queries keyed by `chave`, update via key
- **Service** (`configuracoes/services/configuracao-service.ts`): Business logic with type validation (integer check), grouped listing
- **Types** (`configuracoes/types/index.ts`): `Configuracao` with `categoria`, `ConfiguracaoCategoria`, `deriveCategory()`, `categoriaLabels`
- **Schemas** (`configuracoes/schemas/configuracao-schema.ts`): Zod validation
- **Actions** (`configuracoes/actions/configuracao-actions.ts`): `updateConfiguracaoAction` with permission check and audit logging
- **Editor** (`configuracoes/components/configuracao-editor.tsx`): Category tabs, inline editing per setting, save with confirmation dialog, original value display, modified indicator dots on tabs
- **Categories**: Settings grouped by derived category (Geral, Sistema, Notificações, Portal) based on key prefix
- **RBAC**: `configuracao.editar` permission required (admin role only)
- **Audit**: `alteracao_configuracoes` action logged with description of key + value change
- **Navigation**: Configurações entry added to sidebar (Sistema group), mobile nav, breadcrumbs
- **No create/delete flow**: Only manages existing predefined settings
- **Quality**: 0 lint errors, 0 TypeScript errors, clean production build (31 routes)

## v0.8.0 (2026-06-29)

### Sprint 14 — Auditoria
- **Audit List** (`/auditoria`): Complete audit log viewer with search, sort, pagination
- **Audit Detail** (`/auditoria/[id]`): Full detail view with all audit fields
- **Repository** (`auditoria/repositories/auditoria-repository.ts`): Supabase queries with colaborador join, date range/user/action/entity filters
- **Service** (`auditoria/services/auditoria-service.ts`): Business logic layer
- **Types** (`auditoria/types/index.ts`): Extended `Auditoria` with `colaboradorNome`, `AuditoriaFiltros` with `entidadeId`
- **Filters**: Date range, colaborador, acao (9 action types), entidade tipo, entidade ID
- **Detail View**: Date/time, user, action (color-coded badge), entity type/ID, description, IP, user agent, previous/new values (JSON)
- **Table**: Searchable by description/colaborador, sortable columns, row click navigation
- **RBAC**: `auditoria.consultar` permission required (admin role only)
- **Navigation**: Already present in sidebar, mobile nav, and breadcrumbs
- **Quality**: 0 lint errors, 0 TypeScript errors, clean production build (30 routes)

## v0.7.0 (2026-06-29)

### Sprint 13 — Turnos
- **Turnos Module** (`/turnos`): Complete CRUD for organizational shifts
- **Types** (`turnos/types/index.ts`): `Turno`, `CreateTurnoInput`, `UpdateTurnoInput`
- **Repository** (`turnos/repositories/turno-repository.ts`): Supabase queries with department join, soft-delete, unique constraint validation per (departamento, nome)
- **Service** (`turnos/services/turno-service.ts`): Business logic with unique name-per-department validation
- **Schema** (`turnos/schemas/turno-schema.ts`): Zod validation for create and update
- **Actions** (`turnos/actions/turno-actions.ts`): `createTurnoAction`, `updateTurnoAction`, `deleteTurnoAction`, `restoreTurnoAction`, `toggleActiveTurnoAction`
- **Form** (`turnos/components/turno-form.tsx`): Department select, name, description fields with validation
- **Table** (`turnos/components/turno-table.tsx`): DataTable with search, sort, pagination, status badges, action buttons
- **Pages**: List (`/turnos`), Create (`/turnos/novo`), Edit (`/turnos/[id]`)
- **RBAC**: `turnos.create`, `turnos.update`, `turnos.delete` permissions (admin role)
- **RLS**: Inherits existing RLS policies (admin write, authenticated read)
- **Audit**: All operations logged via existing audit infrastructure
- **Navigation**: Turnos entry added to sidebar (Gestão group) and mobile nav
- **Breadcrumbs**: Turnos label added to breadcrumb map
- **Quality**: 0 lint errors, 0 TypeScript errors, clean production build (30 routes)

## v0.6.0 (2026-06-29)

### Sprint 12 — Perfil do Colaborador
- **Profile Page** (`/perfil`): Complete "Meu Perfil" module with 3 tabs
- **Profile Header**: Avatar with initials, full name, job title, role badges
- **Profile Display**: Personal info card (nome, e-mail, telefone, data nascimento, gênero, estado civil)
- **Profile Work Info**: Professional info card (departamento, cargo, unidade)
- **Profile Edit Form**: Edit allowed fields (nome, telefone, data nascimento, gênero, estado civil, avatar URL)
- **Password Change**: Supabase Auth integration with current password validation
- **Password Security**: Validates minimum 6 chars, confirmation match, re-authenticates current password before change
- **Audit Logging**: Profile updates and password changes recorded in `auditoria` table
- **Event Dispatching**: `user.updated` event emitted on profile changes
- **RBAC**: Collaborator can only view/edit their own profile
- **Repository** (`perfil-repository.ts`): Supabase queries with joins for department, cargo, unidade, roles
- **Service** (`perfil-service.ts`): Business logic using `getCurrentColaborador` for session binding
- **Actions** (`perfil-actions.ts`): `updatePerfilAction`, `changePasswordAction` server actions
- **Responsive**: Mobile-first layout with sm: breakpoints for grid columns
- **Dark mode**: Full support via design system
- **Loading states**: Pending feedback on buttons, redirect on success
- **Quality**: 0 lint errors, 0 TypeScript errors, clean production build (28 routes)

## v0.5.0 (2026-06-28)

### Sprint 11 — Event Engine
- **Event Engine** (`src/features/eventos/`): Centralized in-process event system
- **Event Types**: 19 domain events across auth, users, solicitacoes, comunicados, documentos, notificações
- **Event Dispatcher**: `emit()` to create events, `dispatch()` to publish, `on()` to subscribe
- **Event Handlers**: Notification creation, audit logging, event log persistence
- **Event Log**: Database table `event_log` with indexes for observability
- **Event Dashboard** (`/eventos`): Stats overview (processed/failed/24h), event type breakdown chart, recent events
- **Event Log Page** (`/eventos/log`): Full history with filters (type, status), pagination
- **Integration**: All business modules now publish domain events:
  - Auth: `login`, `logout`
  - Colaboradores: `user.created`, `user.activated`, `user.deactivated`
  - Solicitações: `solicitacao.created`, `solicitacao.approved`, `solicitacao.rejected`, `solicitacao.cancelled`
  - Comunicados: `comunicado.published`, `comunicado.read`
  - Documentos: `documento.published`, `documento.read`, `documento.downloaded`
- **Extensibility**: Handler registration pattern for future n8n, WhatsApp, SMTP, webhooks, ERP integrations
- **RBAC**: `eventos.read` permission (admin role)
- **Migration**: 0012_event_engine.sql (event_log table, RLS, permission)
- **Sidebar**: "Eventos" entry in Sistema group with Zap icon
- **Quality**: 0 lint errors, 0 TypeScript errors, clean production build (28 routes)

## v0.4.0 (2026-06-28)

### Sprint 10 — Management Center
- **Management Dashboard** (`/gestao`): Operational intelligence for managers
- **RBAC**: Visible only to users with `gestao.read` permission (admin role)
- **Operational Indicators**: 5 real-time cards (users online, pending actions, expired documents, expired communications, requests awaiting approval)
- **Collaborator Indicators**: Total, active, inactive, last login (24h), never logged in
- **Solicitação Indicators**: Pending, approved, rejected, cancelled, average approval time, by department, by unit
- **Comunicado Indicators**: Published, unread, read rate, top viewed, least viewed
- **Documento Indicators**: Published, pending reading, read rate, downloads, most accessed, least accessed
- **Notificação Indicators**: Unread, read, by type, last 30 days
- **Charts** (Recharts): Bar chart, Line chart, Pie chart, Area chart — all responsive
  - Solicitações by month + by department
  - Comunicados by month + read distribution (pie)
  - Documentos by month + most accessed (horizontal bar)
  - Notificações last 30 days + by type (pie)
- **Global Filters**: Department, unit, date range, role
- **Export**: CSV, Excel (xlsx), PDF (text format)
- **Sidebar**: "Centro de Gestão" navigation entry with BarChart3 icon
- **New dependencies**: recharts, xlsx
- **New migration**: 0011_gestao_permissions.sql (gestao.read for admin role)
- **Quality**: 0 lint errors, 0 TypeScript errors, clean production build (26 routes)

## v0.3.0 (2026-06-28)

### Sprint 9 — My Workspace (Home Dashboard)
- **Personalized Home Workspace** (`/`): Modular dashboard with 8 independent widgets
- **Profile Summary Widget**: Avatar, name, department, role, unit, roles, admission date
- **Pending Leave Requests Widget**: Shows up to 5 pending solicitations with links
- **Unread Communications Widget**: Highlights pinned/unread comunicados with priority badges
- **Documents Pending Reading Widget**: Lists published documents the user hasn't read yet
- **Recently Published Documents Widget**: Shows recently published documents with read status
- **Recent Notifications Widget**: Last 5 notifications with unread indicators + Mark All as Read
- **Quick Actions Widget**: RBAC-filtered actions — only shows actions the user is allowed to perform
- **Recent Activity Widget**: Audit trail feed (refactored from StatsCards)
- **Notification Center** (`/notificacoes`): Full page with unread counter, mark as read, mark all as read, filter by status/type, pagination
- **Header Notification Bell**: Real unread count from database (replaces hardcoded "3"), links to `/notificacoes`
- **Performance**: All widgets use Server Components, independent Suspense boundaries, parallel data fetching via `Promise.all`
- **Responsive Layout**: Card-based grid layout (1-col mobile, 2-col tablet, 3-col desktop)
- **Dark Mode**: All widgets respect theme with proper contrast and color tokens
- **New feature module**: `notificacoes` — repository, service, actions, types
- **Quality**: 0 lint errors, 0 TypeScript errors, clean production build
- **Sidebar**: Renamed "Dashboard" to "Meu Workspace"

## v0.2.0-rc1 (2026-06-27)

### Sprint 1 — Foundation
- Auth (login/logout/session recovery) with Supabase SSR
- Application Shell (sidebar, header, breadcrumbs, mobile-nav, theme-toggle)
- RBAC data loading (colaborador + roles + permissions)
- Protected dashboard with real user data

### Sprint 2 — Dashboard & CRUDs
- Production Dashboard: 8 stats cards, recent activity timeline, quick actions
- Departamentos CRUD: list, create, edit with RBAC + Zod validation
- Auth repository fix: `codigo` → `nome` permissions column alias
- RLS recursion fix: `SECURITY DEFINER is_admin()` function (Migration 0004)

### Sprint 3 — Shared Components & Cargos
- 8 reusable admin components (AdminPageLayout, DataTable, etc.)
- Cargos full CRUD following Departamentos pattern
- Dashboard: cards as `<Link>` tags, Quick Actions use `window.location.href`
- Auth: login redirect `/dashboard` → `/`, sidebar link `/dashboard` → `/`
- Proxy middleware protects all non-public routes, preserves Supabase cookies
- FK join name fixes (`use-auth.ts`, `lookupColaborador`)
- Shared `checkPermission()` helper extracted

### RC 0.2.0 — Hardening
- `verifySession()` removed (dead code)
- `setAll` catch block logs errors instead of swallowing silently
- DropdownMenuTrigger renders its own `<button>` (no more nested buttons)
- 56 scaffold placeholder stub files removed
- `@tanstack/react-table` removed (unused dependency)
- Removed noop `<Suspense>` wrappers from Cargos and Departamentos pages
- `_headers` unused parameter warning fixed

## v0.2.0-rc3 (2026-06-28)

### Sprint 6 — Solicitações de Folga
- Full leave request workflow: create, list, approve, reject, cancel with 5 statuses (pendente/aprovada/reprovada/cancelada/expirada)
- 3 new routes: `/solicitacoes`, `/solicitacoes/nova`, `/solicitacoes/[id]`
- New feature module: types, Zod schemas, validators, repository, service, 5 Server Actions, 4 components (form, table, timeline, status badge)
- Workflow engine using `workflow_definitions` and `workflow_steps` tables (fluxo_folga_padrao)
- Timeline component reads from `auditoria` — shows creation, approvals, rejections, cancellations
- Automatic notifications in `notificacoes` table (created via admin client)
- Automatic audit records in `auditoria` table for every workflow transition
- RBAC with 5 permissions: `solicitacoes.{read,create,approve,reject,cancel}` — migration 0008 replaces old `solicitacao.*` permissions
- Dashboard: 2 new stats cards (Aprovadas Hoje, Reprovadas Hoje), Quick Action "Nova Solicitação"
- Blocked date validation, date-future validation, status-based action buttons
- Confirmation dialogs for approve/cancel actions
- Reuses admin CRUD platform (AdminPageLayout, DataTable, AdminToolbar, AdminConfirmDialog)
- Migration 0008: fixes notificacoes INSERT policy for all authenticated users
- Quality: 0 errors, 0 warnings

## v0.2.0-rc2 (2026-06-28)

### Sprint 4 — Unidades Module
- Unidades CRUD: full create, read, update, soft-delete with RBAC + Zod validation
- 3 new routes: `/unidades`, `/unidades/novo`, `/unidades/[id]`
- New feature module: schemas, validators, repository, service, actions (5 Server Actions), components (form + table)
- Reuses 100% of the admin CRUD platform (DataTable, AdminToolbar, AdminPageLayout, AdminStatusBadge, AdminConfirmDialog, AdminActionButtons)
- Seed migration 0005: 4 new permissions (`unidades.read/create/update/delete`) assigned to admin role
- Screenshots in `docs/screenshots/Sprint-04/`

### Sprint 5 — Colaboradores Module
- Colaboradores full CRUD: create, read, update, soft-delete with RBAC + Zod validation
- 3 new routes: `/colaboradores`, `/colaboradores/novo`, `/colaboradores/[id]`
- 15+ fields per migration 0001 (nome, matrícula, CPF, email, telefone, data_nascimento, data_admissão, genero, estado_civil, departamento, cargo, unidade)
- CPF validation with proper algorithm (`src/shared/lib/cpf.ts`)
- Zod schemas for all fields with CPF, email, phone validation
- Unique constraints on matrícula, CPF, and email (checked in service)
- Role assignment UI with `ColaboradorRoles` component
- Auth integration: invite user, activate/deactivate auth.users via Supabase Admin API
- Profile view with avatar, vínculos (departamento/cargo/unidade), roles, status
- RBAC: 4 permissions (`colaboradores.read/create/update/delete`) seeded via migration 0007
- RLS fix migrated from Sprint 4 (migration 0006) — admins see all rows including soft-deleted
- Reuses admin CRUD platform (DataTable, AdminToolbar, AdminPageLayout, AdminStatusBadge, AdminConfirmDialog, AdminActionButtons)
- Supabase admin client for auth operations (`lib/supabase/admin.ts`)
- Seed migration 0007: 4 permissions assigned to admin role
- Screenshots in `docs/screenshots/Sprint-05/` (desktop + mobile)
