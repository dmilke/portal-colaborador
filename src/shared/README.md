# shared

Código compartilhado entre todos os módulos do sistema.

**Estrutura:**

- `app/` - Lógica compartilhada de inicialização da aplicação
- `components/` - Componentes de UI reutilizáveis (shadcn/ui, primitives)
- `domain/` - Entidades de domínio, value objects, erros de domínio
- `hooks/` - Hooks React compartilhados
- `lib/` - Configurações de bibliotecas externas (Supabase, etc.)
- `providers/` - Providers React (contextos, tema, autenticação)
- `repositories/` - Interfaces e implementações base de repositórios
- `services/` - Serviços compartilhados (logger, etc.)
- `types/` - Tipos globais do TypeScript
- `utils/` - Funções utilitárias puras
