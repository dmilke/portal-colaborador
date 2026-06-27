# 00 - Glossário

**Projeto:** Portal do Colaborador

**Versão:** 1.0.0

**Status:** CONGELADO

---

# Objetivo

Este documento define os termos oficiais utilizados no Portal do Colaborador.

Seu objetivo é garantir que toda a equipe utilize a mesma terminologia durante a documentação, desenvolvimento, testes e manutenção do sistema.

---

# Termos do Negócio

## Administrador

Usuário responsável pela administração do sistema.

Permissões:

* cadastrar colaboradores;
* alterar colaboradores;
* aprovar solicitações;
* reprovar solicitações;
* cancelar solicitações administrativamente;
* gerenciar configurações;
* consultar auditoria;
* emitir relatórios.

---

## Colaborador

Usuário pertencente a uma equipe da instituição que poderá acessar o Portal para solicitar folgas e consultar seu histórico.

---

## Equipe

Grupo organizacional ao qual o colaborador pertence.

Equipes existentes no MVP:

* Cuidado
* Higienização

---

## Turno

Período de trabalho disponível para solicitação de folga.

Equipe Cuidado:

* Dia
* Noite

Equipe Higienização:

* Dia

---

## Tipo de Folga

Categoria da solicitação cadastrada pelo administrador.

Exemplos:

* Folga Bônus
* Banco de Horas
* Compensação

---

## Solicitação

Pedido realizado pelo colaborador para utilização de uma folga.

---

## Status da Solicitação

Estados possíveis:

* Pendente
* Aprovada
* Reprovada
* Cancelada
* Expirada

---

## Agenda

Calendário utilizado para visualizar disponibilidade de solicitações.

Cada equipe possui agenda independente.

---

## Data Bloqueada

Data definida pelo administrador para impedir novas solicitações.

---

## Fechamento Mensal

Regra que encerra as solicitações do mês subsequente no dia 25 de cada mês.

---

## Histórico

Registro permanente das solicitações realizadas pelo colaborador.

Nenhum histórico poderá ser excluído.

---

## Auditoria

Registro permanente das operações realizadas no sistema.

---

## Notificação

Mensagem interna apresentada ao colaborador através do sino de notificações.

---

## Lotação

Equipe onde o colaborador está vinculado em determinado período.

Toda alteração gera histórico.

---

## Perfil

Categoria de permissão do usuário.

Perfis do MVP:

* Administrador
* Colaborador

---

## RLS

Row Level Security.

Mecanismo do Supabase responsável pelo controle de acesso aos registros.

---

## Migração

Arquivo SQL versionado utilizado para criação e alteração do banco de dados.

---

## Seed

Arquivo responsável pela carga inicial de dados.

---

## MVP

Primeira versão funcional do Portal do Colaborador.

---

## Timestamp

Data e hora exatas da gravação de uma solicitação.

Será utilizado para determinar a prioridade em solicitações concorrentes.

---

## Idempotência

Garantia de que múltiplas tentativas da mesma operação produzirão apenas um único resultado válido.

---

## Portal do Colaborador

Nome oficial do sistema.

Todas as referências ao sistema deverão utilizar esta nomenclatura.

---

# Controle de Versão

Versão: 1.0.0

Status: CONGELADO
