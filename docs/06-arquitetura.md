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

Versão: 1.0.0

Status: CONGELADO
