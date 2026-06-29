# Gestao

Centro de Gestao Operacional - Dashboard administrativo com indicadores e graficos.

**Rota:** `/gestao`

**Subdominio:** Governanca

**Responsabilidades:**
- 6 cards de indicadores operacionais
- 5 cards de indicadores de colaboradores
- Graficos (Recharts): Barra, Linha, Pizza, Area
- Filtros globais (periodo)
- Exportacao CSV/Excel/PDF
- Permissao: `gestao.read` (admin)

**Indicadores:**
| Categoria | Metricas |
|-----------|----------|
| Operacionais | Usuarios online, acoes pendentes, documentos expirados, comunicados expirados, solicitacoes aguardando aprovacao |
| Colaboradores | Total, ativos, inativos, login 24h, nunca logaram |
| Solicitacoes | Pendentes, aprovadas, reprovadas, canceladas, tempo medio aprovacao, por departamento, por unidade |
| Comunicados | Publicados, nao lidos, taxa leitura, mais visualizados, menos visualizados |
| Documentos | Publicados, pendentes leitura, taxa leitura, downloads, mais acessados, menos acessados |
| Notificacoes | Nao lidas, lidas, por tipo, ultimos 30 dias |

**Graficos:**
- Solicitacoes por mes + por departamento (Barra)
- Comunicados por mes + distribuicao lido/nao lido (Pizza)
- Documentos por mes + mais acessados (Barra horizontal)
- Notificacoes ultimos 30 dias + por tipo (Pizza)

**Arquitetura:**
```
gestao/
├── types/index.ts              # Todas as interfaces de stats e filtros
├── repositories/gestao-repository.ts  # Queries complexas agregadas
├── services/gestao-service.ts         # Logica de negocio
├── components/
│   ├── gestao-page-content.tsx
│   ├── operational-indicators.tsx
│   ├── collaborator-indicators.tsx
│   ├── solicitacao-indicators.tsx
│   ├── comunicado-indicators.tsx
│   ├── documento-indicators.tsx
│   ├── notificacao-indicators.tsx
│   └── charts/                    # 4 tipos de graficos Recharts
└── index.ts
```

**Exportacao:**
- CSV (texto simples)
- Excel (via xlsx)
- PDF (texto formatado .txt)

**Event Engine:**
- Registra `gestao.exported` ao exportar

**Qualidade:**
- 0 erros de lint
- 0 erros de TypeScript
- Build limpo (28 rotas no Sprint 10)