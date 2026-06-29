# notificacoes

Sistema de notificações internas do portal.

**Subdomínio:** Comunicação

**Responsabilidades:**
- Notificações geradas por eventos do sistema
  (aprovação, reprovação, cancelamento, novo comunicado, novo documento)
- Marcação de leitura (individual e em lote)
- Contagem de não lidas
- Central de notificações no dashboard
- Widget de notificações recentes na Home

## Arquitetura

```
notificacoes/
├── types/index.ts          # Notificacao, CreateNotificacaoInput, NotificacaoListResult
├── repositories/
│   └── notificacao-repository.ts   # CRUD + countUnread + markAsRead + markAllAsRead
├── services/
│   └── notificacao-service.ts      # Business logic (getCurrentColaborador)
├── actions/
│   └── notificacao-actions.ts      # Server Actions (markAsRead, markAllAsRead)
└── index.ts                # Barrel exports (types + actions only)
```

## Nota sobre Server/Client Boundary

O barrel `index.ts` exporta apenas **tipos** e **Server Actions** (`'use server'`).
Serviços e repositórios NÃO são re-exportados pelo barrel para evitar que
módulos `server-only` (`auth.ts`, `createClient`) sejam importados por
componentes Client.

- **Server Components** importam diretamente: `@/src/features/notificacoes/services/notificacao-service`
- **Client Components** importam diretamente: `@/src/features/notificacoes/actions/notificacao-actions`

## Uso

### Widget na Home
```tsx
import { notificacaoService } from '@/src/features/notificacoes/services/notificacao-service'

const [notifications, unreadCount] = await Promise.all([
  notificacaoService.getRecent(5),
  notificacaoService.getUnreadCount(),
])
```

### Server Action (Client Component)
```tsx
import { markNotificacaoAsReadAction } from '@/src/features/notificacoes/actions/notificacao-actions'

await markNotificacaoAsReadAction(id)
```

### Layout (unread count for header)
```tsx
import { notificacaoService } from '@/src/features/notificacoes/services/notificacao-service'

const unreadCount = await notificacaoService.getUnreadCount()
```
