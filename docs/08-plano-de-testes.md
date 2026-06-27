# 08 - Plano de Testes

**Projeto:** Portal do Colaborador

**Versão:** 1.0.0

**Status:** CONGELADO

---

# Objetivo

Garantir que todas as funcionalidades sejam validadas antes da produção.

---

# CT-001 - Login

Validar:

* Login válido
* Login inválido
* Senha incorreta
* Usuário inexistente

---

# CT-002 - Cadastro

Validar:

* Cadastro
* Alteração
* Histórico de lotação

---

# CT-003 - Solicitação

Validar:

* Tipo de folga
* Data
* Turno
* Equipe
* Timestamp
* Registro

---

# CT-004 - Concorrência

Simular duas solicitações simultâneas para a mesma vaga.

Resultado esperado:

A primeira gravação deverá ser aceita.

A segunda deverá ser recusada.

---

# CT-005 - Cancelamento

Validar:

* Mudança de status
* Liberação da vaga
* Auditoria
* Notificação

---

# CT-006 - Aprovação

Validar:

* Status
* Auditoria
* Notificação

---

# CT-007 - Reprovação

Validar:

* Justificativa obrigatória
* Liberação da vaga
* Auditoria
* Notificação

---

# CT-008 - Datas Bloqueadas

Validar:

* Datas administrativas
* Feriados
* Fechamento mensal

---

# CT-009 - Antecedência

Validar:

* Até um ano
* Acima de um ano

---

# CT-010 - Auditoria

Validar registros de:

* Login
* Cadastro
* Solicitação
* Aprovação
* Reprovação
* Cancelamento
* Alteração de equipe

---

# CT-011 - Notificações

Validar:

* Criação
* Leitura
* Histórico

---

# CT-012 - Segurança

Validar:

* RLS
* Perfis
* Permissões
* Acessos indevidos

---

# CT-013 - Responsividade

Validar:

* Desktop
* Tablet
* Smartphone

---

# Critério de Aprovação

O MVP será considerado aprovado quando:

* Todos os testes críticos forem aprovados.
* Não existirem erros críticos.
* Todas as regras de negócio forem respeitadas.

---

Versão: 1.0.0

Status: CONGELADO
