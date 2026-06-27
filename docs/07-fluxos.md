# 07 - Fluxos

**Projeto:** Portal do Colaborador

**Versão:** 1.0.0

**Status:** CONGELADO

---

# Objetivo

Documentar os fluxos operacionais do Portal do Colaborador.

---

# FL-001 - Login

```
Início

↓

Informar usuário

↓

Informar senha

↓

Credenciais válidas?

├── Não
│
│ Mostrar erro
│
└── Sim

↓

Entrar no Portal
```

---

# FL-002 - Solicitar Folga

```
Selecionar tipo

↓

Selecionar data

↓

Selecionar turno

↓

Disponível?

├── Não

│ Informar indisponibilidade

└── Sim

↓

Confirmar

↓

Gravar no banco

↓

Gravação realizada?

├── Não

│ Informar erro

└── Sim

↓

Bloquear vaga

↓

Registrar auditoria

↓

Criar notificação

↓

Fim
```

---

# FL-003 - Aprovação

```
Administrador

↓

Abrir solicitações

↓

Selecionar pedido

↓

Aprovar

↓

Atualizar status

↓

Auditoria

↓

Notificação

↓

Fim
```

---

# FL-004 - Reprovação

```
Administrador

↓

Selecionar pedido

↓

Informar justificativa

↓

Atualizar status

↓

Liberar vaga

↓

Auditoria

↓

Notificação

↓

Fim
```

---

# FL-005 - Cancelamento

```
Colaborador

↓

Cancelar

↓

Confirmar

↓

Atualizar status

↓

Liberar vaga

↓

Auditoria

↓

Notificação

↓

Fim
```

---

# FL-006 - Alteração de Equipe

```
Administrador

↓

Editar colaborador

↓

Alterar equipe

↓

Registrar histórico

↓

Auditoria

↓

Fim
```

---

# FL-007 - Recuperação de Senha

```
Administrador

↓

Selecionar colaborador

↓

Redefinir senha

↓

Auditoria

↓

Primeiro Login

↓

Troca obrigatória da senha

↓

Fim
```

---

# FL-008 - Consulta de Histórico

```
Login

↓

Histórico

↓

Solicitações

↓

Notificações

↓

Fim
```

---

Versão: 1.0.0

Status: CONGELADO
