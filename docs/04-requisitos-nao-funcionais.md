# 04 - Requisitos Não Funcionais

**Projeto:** Portal do Colaborador

**Versão:** 1.0.0

**Status:** CONGELADO

---

# Objetivo

Definir os requisitos de qualidade do Portal do Colaborador.

---

# RNF-001 - Plataforma

Aplicação Web responsiva.

---

# RNF-002 - Tecnologias

Frontend:

* React
* Next.js
* TypeScript
* Tailwind CSS
* shadcn/ui

Backend:

* Supabase
* PostgreSQL
* Auth
* Storage
* RLS

Hospedagem:

* Vercel

---

# RNF-003 - Responsividade

Compatível com:

* Desktop
* Tablet
* Smartphone

---

# RNF-004 - Desempenho

Carregamento inicial inferior a 3 segundos.

Operações comuns inferiores a 2 segundos.

---

# RNF-005 - Disponibilidade

Disponibilidade conforme infraestrutura do Supabase e Vercel.

---

# RNF-006 - Segurança

* HTTPS
* Auth
* RLS
* Hash de senhas
* Controle por perfil

---

# RNF-007 - LGPD

Observar princípios da Lei Geral de Proteção de Dados.

---

# RNF-008 - Auditoria

Todas as operações críticas deverão ser registradas.

---

# RNF-009 - Integridade

Validação tanto na aplicação quanto no banco.

---

# RNF-010 - Concorrência

A primeira transação gravada será considerada válida.

---

# RNF-011 - Usabilidade

Priorizar:

* simplicidade;
* clareza;
* baixo número de cliques.

---

# RNF-012 - Manutenibilidade

Seguir o padrão de código definido pelo projeto.

---

# RNF-013 - Escalabilidade

Arquitetura preparada para novos módulos.

---

# RNF-014 - Versionamento

Todo código deverá ser versionado no GitHub.

Banco somente por migrações SQL.

---

# RNF-015 - Logs

Registrar erros técnicos.

Não expor detalhes internos ao usuário.

---

# RNF-016 - Backup

Utilizar mecanismos do Supabase.

---

# RNF-017 - Compatibilidade

Compatível com:

* Chrome
* Edge
* Firefox
* Safari

---

# RNF-018 - Idioma

Português (Brasil).

---

# RNF-019 - Fuso Horário

Utilizar o fuso horário da instituição.

---

# RNF-020 - Fonte Oficial

Complementa os requisitos funcionais e regras de negócio.

---

# RNF-021 - Observabilidade

O sistema deverá registrar informações suficientes para:

* diagnóstico;
* auditoria;
* desempenho;
* monitoramento.

---

Versão: 1.0.0

Status: CONGELADO
