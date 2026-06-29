# Perfil do Colaborador

Gestão do perfil do colaborador logado.

**Rota:** `/perfil`

**Subdomínio:** Pessoas

## Funcionalidades

### Exibição do Perfil
- Avatar com iniciais
- Nome completo, cargo e badges de papéis
- Informações pessoais: e-mail, telefone, data de nascimento, gênero, estado civil
- Informações profissionais: departamento, cargo, unidade

### Edição do Perfil
- Campos editáveis: nome, telefone, data de nascimento, gênero, estado civil, avatar URL
- Campos protegidos (somente leitura): e-mail, cargo, departamento, unidade
- Validação de formulário

### Alteração de Senha
- Validação da senha atual via Supabase Auth
- Requisito mínimo de 6 caracteres
- Confirmação de senha
- Re-autenticação antes da alteração

## Segurança

- O colaborador só acessa seu próprio perfil
- Campos protegidos não podem ser editados
- Re-autenticação obrigatória para alteração de senha
- RBAC: qualquer colaborador autenticado pode acessar

## Auditoria

- Atualizações de perfil registradas na tabela `auditoria`
- Alterações de senha também registradas
- Evento `user.updated` emitido via Event Engine

## Arquitetura

```
perfil/
├── types/index.ts           # ColaboradorPerfil, UpdatePerfilInput, AlterarSenhaInput
├── repositories/perfil-repository.ts  # Queries Supabase com joins
├── services/perfil-service.ts         # Lógica de negócio
├── actions/perfil-actions.ts          # Server actions
├── components/
│   ├── profile-header.tsx             # Avatar, nome, cargo, roles
│   ├── profile-display.tsx            # Card de informações pessoais
│   ├── profile-work-info.tsx          # Card de informações profissionais
│   ├── profile-edit-form.tsx          # Formulário de edição
│   └── password-change-form.tsx       # Formulário de senha
└── README.md
```

## Tabs

| Tab | Conteúdo |
|-----|----------|
| Perfil | Exibição das informações pessoais e profissionais |
| Editar | Formulário de edição dos campos permitidos |
| Senha | Formulário de alteração de senha |
