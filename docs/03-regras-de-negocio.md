# 03 - Regras de Negócio

**Projeto:** Portal do Colaborador

**Versão:** 1.0.0

**Status:** CONGELADO

---

# Objetivo

Definir todas as regras de negócio que governam o funcionamento do Portal do Colaborador.

---

# RN-001 - Equipes

Cada colaborador deverá pertencer obrigatoriamente a uma única equipe ativa.

Equipes do MVP:

* Cuidado
* Higienização

Mudanças de equipe deverão gerar histórico de lotação.

---

# RN-002 - Turnos

Equipe Cuidado:

* Dia
* Noite

Equipe Higienização:

* Dia

Não será permitido cadastrar turno noturno para Higienização.

---

# RN-003 - Agenda

Cada equipe possuirá agenda independente.

Um colaborador visualizará apenas a agenda de sua equipe.

---

# RN-004 - Privacidade

O colaborador nunca visualizará:

* nome de outro colaborador;
* motivo de solicitações de terceiros;
* histórico de terceiros;
* status detalhado de terceiros.

---

# RN-005 - Limite de Solicitações

Cada combinação:

Equipe + Data + Turno

possuirá apenas uma vaga disponível.

---

# RN-006 - Ordem de Prioridade

A prioridade será determinada exclusivamente pelo timestamp da gravação da solicitação no banco de dados.

---

# RN-007 - Bloqueio da Vaga

A vaga será bloqueada exclusivamente após a gravação bem-sucedida da solicitação.

A abertura da tela ou seleção da data não reserva vaga.

---

# RN-008 - Cancelamento

Ao cancelar uma solicitação:

* alterar status;
* liberar imediatamente a vaga;
* registrar auditoria;
* criar notificação.

---

# RN-009 - Reprovação

Ao reprovar:

* justificativa obrigatória;
* liberar vaga;
* registrar auditoria;
* criar notificação.

---

# RN-010 - Aprovação

Ao aprovar:

* alterar status;
* manter vaga bloqueada;
* registrar auditoria;
* criar notificação.

---

# RN-011 - Status

Estados oficiais:

* Pendente
* Aprovada
* Reprovada
* Cancelada
* Expirada

---

# RN-012 - Fechamento Mensal

A solicitação poderá ser realizada até o dia **25** de cada mês para o mês subsequente.

A partir do dia **26**, o mês subsequente permanecerá bloqueado.

Exemplo:

Até 25/06 → solicitar julho.

Em 26/06 → julho bloqueado.

Agosto permanece disponível.

Somente administradores poderão criar exceções.

---

# RN-013 - Antecedência

O colaborador poderá solicitar folgas com antecedência máxima de um ano.

---

# RN-014 - Datas Bloqueadas

Datas cadastradas como bloqueadas não aceitarão solicitações.

---

# RN-015 - Auditoria

Serão auditadas:

* login;
* cadastro;
* alteração;
* solicitação;
* aprovação;
* reprovação;
* cancelamento;
* alteração de equipe;
* alteração de configurações.

---

# RN-016 - Histórico

Nenhum histórico poderá ser excluído.

---

# RN-017 - Recuperação de Senha

Somente administradores poderão redefinir senhas.

No primeiro acesso após redefinição o colaborador deverá cadastrar nova senha.

---

# RN-018 - Cadastro Administrativo

Os campos administrativos fazem parte da evolução futura.

---

# RN-019 - Exceções

Somente administradores poderão criar exceções às regras do sistema.

Toda exceção deverá ser auditada.

---

# RN-020 - Fonte Oficial

As regras deste documento prevalecem sobre qualquer implementação.

---

# RN-021 - Idempotência

Uma colaboradora não poderá possuir duas solicitações ativas para a mesma:

* Data
* Turno
* Tipo de Folga

A validação deverá ocorrer tanto na aplicação quanto no banco de dados.

---

Versão: 1.0.0

Status: CONGELADO
