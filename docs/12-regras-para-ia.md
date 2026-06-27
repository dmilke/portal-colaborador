# 12 - Regras para IA

**Projeto:** Portal do Colaborador

**Versão:** 1.0.0

**Status:** CONGELADO

---

# Objetivo

Estabelecer as regras obrigatórias para qualquer Inteligência Artificial utilizada no desenvolvimento do Portal do Colaborador.

Estas regras aplicam-se ao ChatGPT, Cursor, OpenCode, Claude, Gemini e quaisquer outras ferramentas de IA utilizadas no projeto.

---

# Princípios Gerais

A IA deverá sempre:

* ler o `PROJECT_CONTEXT.md` antes de gerar código;
* considerar a documentação como fonte oficial da verdade;
* respeitar integralmente os Requisitos Funcionais, Regras de Negócio e Requisitos Não Funcionais;
* preservar a arquitetura definida para o projeto.

---

# Regras Obrigatórias

## Documentação

* Nunca alterar documentos congelados.
* Nunca criar novos requisitos sem autorização.
* Atualizar documentação somente quando solicitado.

---

## Banco de Dados

* Utilizar exclusivamente migrações SQL.
* Nunca alterar tabelas manualmente.
* Nunca remover tabelas ou colunas sem autorização.
* Preservar integridade referencial.

---

## Segurança

* Respeitar todas as políticas RLS.
* Nunca sugerir remover autenticação.
* Nunca sugerir desativar RLS.

---

## Código

Todo código deverá ser:

* limpo;
* reutilizável;
* tipado;
* documentado;
* compatível com ESLint;
* compatível com Prettier.

---

## Arquitetura

A IA não poderá:

* alterar tecnologias definidas;
* substituir frameworks;
* alterar nomenclaturas oficiais;
* modificar a estrutura do projeto.

---

## Em Caso de Dúvida

A IA deverá perguntar antes de implementar.

Nunca assumir regras não documentadas.

---

# Restrições

A IA não poderá:

* inventar requisitos;
* remover funcionalidades;
* alterar regras de negócio;
* criar tabelas fora do Modelo de Dados;
* modificar perfis de acesso.

---

# Ordem de Prioridade

1. Constituição do Projeto
2. PROJECT_CONTEXT.md
3. Documentação Oficial
4. Arquitetura
5. Código

---

Versão: 1.0.0

Status: CONGELADO
