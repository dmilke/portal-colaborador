# Portal do Colaborador

[![CI](https://github.com/dmilke/portal_colaborador/actions/workflows/ci.yml/badge.svg)](https://github.com/dmilke/portal_colaborador/actions/workflows/ci.yml)
[![CodeQL](https://github.com/dmilke/portal_colaborador/actions/workflows/codeql.yml/badge.svg)](https://github.com/dmilke/portal_colaborador/actions/workflows/codeql.yml)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

> Sistema de gestão de solicitações de folga para colaboradores.

## Status

**Release Candidate 0.2.0** — Auth (login/logout/session recovery), Application Shell, RBAC, Dashboard with real data, Departamentos CRUD, Cargos CRUD, reusable admin components, RLS recursion fix.

## Architecture

| Layer       | Technology                              |
|-------------|----------------------------------------|
| Frontend    | Next.js 16 (App Router, Server Components) |
| Styling     | Tailwind CSS 4                         |
| Database    | PostgreSQL (Supabase)                  |
| Auth        | Supabase Auth                          |
| Migration   | Supabase CLI (local/remote)            |
| CI/CD       | GitHub Actions                         |

### Database (24 tables)

- **RBAC**: roles, permissions, role_permissions, colaborador_roles
- **Organograma**: departamentos, cargos, turnos, colaboradores
- **Core**: solicitacoes, folgas
- **Workflow**: workflow_definitions, workflow_steps, workflow_executions, workflow_step_executions
- **Communications**: notificacoes, auditoria
- **Documents**: documentos, documento_versoes, documento_assinaturas
- **System**: configuracoes, anexos

## Getting Started

```bash
npm ci
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Development Workflow

See [docs/DevelopmentWorkflow.md](docs/DevelopmentWorkflow.md).

## Project Structure

```
├── .github/workflows/     # CI/CD pipelines
├── src/
│   ├── app/               # Next.js App Router pages
│   └── features/          # Feature modules (colaboradores, auth, documentos, etc.)
├── lib/
│   └── supabase/          # Supabase clients (server, client, middleware)
└── supabase/
    ├── migrations/        # Database migrations
    └── tests/             # Database validation tests
```
