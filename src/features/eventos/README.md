# Event Engine

Motor de eventos centralizado para automação e observabilidade.

**Subdomínio:** Sistema

**Responsabilidades:**
- Publicação de eventos de domínio
- Handlers para notificações, auditoria e log
- Observabilidade via event_log
- Extensibilidade para integrações futuras

## Arquitetura

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

## Uso

### Publicar um evento

```typescript
import { dispatch, emit } from '@/src/features/eventos'

await dispatch(emit('solicitacao.approved', 'solicitacoes', {
  id: solicitacao.id,
  colaboradorId: solicitacao.colaboradorId,
  status: 'aprovada',
}, approvedBy))
```

### Registrar um handler

```typescript
import { on } from '@/src/features/eventos'

on('solicitacao.approved', async (event) => {
  // Lógica customizada
})
```

## Nota sobre Server/Client Boundary

O barrel `index.ts` exporta tipos e funções do event engine.
Handlers usam `createAdminClient()` para inserções diretas no banco.

- **Server Components** importam: `@/src/features/eventos`
- **Services** importam: `@/src/features/eventos` e chamam `initializeEventHandlers()`
