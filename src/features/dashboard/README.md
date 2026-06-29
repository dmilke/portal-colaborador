# Dashboard

Painel inicial do colaborador (Meu Workspace).

**Rota:** `/`

**Subdominio:** Pessoal

**Responsabilidades:**
- Exibicao de 8 widgets modulares:
  - Resumo do Perfil
  - Solicitacoes Pendentes
  - Comunicados Nao Lidos
  - Documentos Pendentes de Leitura
  - Documentos Publicados Recentemente
  - Notificacoes Recentes
  - Acoes Rapidas (com RBAC)
  - Atividade Recente
- Busca de dados agregados para o painel
- Central de Notificacoes (`/notificacoes`)

**Arquitetura:**
```
dashboard/
├── types/index.ts              # DashboardStats, RecentActivityItem
├── repositories/dashboard-repository.ts
├── services/dashboard-service.ts
└── components/                 # Widgets usados em app/(dashboard)/page.tsx
```

**Widgets (Server Components com Suspense):**
Cada widget e um Server Component independente envolto em `<Suspense>` com skeleton de loading. Falhas isoladas nao quebram a pagina.

**Integracao:**
- Consome servicos de: solicitacoes, comunicados, documentos, notificacoes
- Event Engine emite eventos `dashboard.viewed` (se implementado)

**Qualidade:**
- 0 erros de lint
- 0 erros de TypeScript
- Build limpo