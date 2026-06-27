# 05 - Modelo de Dados

**Projeto:** Portal do Colaborador

**Versão:** 1.0.0

**Status:** CONGELADO

---

# Objetivo

Definir a estrutura lógica do banco de dados.

---

# Tabelas

## TB_PERFIS

* id
* nome
* descricao
* ativo

---

## TB_COLABORADORES

* id
* auth_user_id
* perfil_id
* nome
* data_nascimento
* created_at
* updated_at

---

## TB_EQUIPES

* id
* nome

Dados iniciais:

* Cuidado
* Higienização

---

## TB_HISTORICO_LOTACAO

* id
* colaborador_id
* equipe_id
* inicio
* fim

---

## TB_TURNOS

* id
* equipe_id
* nome

Dados:

Cuidado

* Dia
* Noite

Higienização

* Dia

---

## TB_TIPOS_FOLGA

* id
* nome
* ativo

---

## TB_DATAS_BLOQUEADAS

* id
* data
* motivo
* ativa

---

## TB_SOLICITACOES

* id
* colaborador_id
* equipe_id
* turno_id
* tipo_folga_id
* data_folga
* status
* justificativa
* solicitado_em
* aprovado_em
* aprovado_por
* created_at
* updated_at

---

## TB_NOTIFICACOES

* id
* colaborador_id
* solicitacao_id
* titulo
* mensagem
* tipo
* lida
* read_at
* created_at

---

## TB_AUDITORIA

* id
* usuario_id
* acao
* entidade
* entidade_id
* descricao
* created_at

---

## TB_CONFIGURACOES

* id
* fechamento_dia
* antecedencia_meses

---

# Relacionamentos

COLABORADORES

↓

PERFIS

↓

HISTÓRICO_LOTAÇÃO

↓

EQUIPES

↓

TURNOS

↓

SOLICITAÇÕES

↓

NOTIFICAÇÕES

↓

AUDITORIA

---

# Índices

Criar índices para:

* colaborador_id
* equipe_id
* turno_id
* data_folga
* status

---

# Integridade

Obrigatório utilizar:

* Foreign Keys
* Constraints
* Transactions
* Índices únicos
* UUID

---

Versão: 1.0.0

Status: CONGELADO
