# 02 - Requisitos Funcionais

**Projeto:** Portal do Colaborador

**Versão:** 1.0.0

**Status:** CONGELADO

---

# 1. Objetivo

Definir todas as funcionalidades obrigatórias do Portal do Colaborador na versão MVP.

---

# 2. Escopo

Este documento contempla todas as funcionalidades da primeira versão do sistema.

---

# UC-001 - Autenticar Colaborador

## Objetivo

Permitir acesso ao Portal.

### Atores

- Colaborador
- Administrador

### Requisitos

RF-001 Login utilizando usuário e senha.

RF-002 Validar credenciais.

RF-003 Identificar perfil.

RF-004 Direcionar usuário para seu painel.

---

# UC-002 - Cadastrar Colaborador

## Objetivo

Cadastrar um novo colaborador.

### Campos

- Nome
- Data de nascimento
- Equipe

### Requisitos

RF-005 Apenas Administrador poderá cadastrar.

RF-006 Todo colaborador pertencerá a apenas uma equipe por vez.

RF-007 Registrar data do cadastro.

RF-008 Criar automaticamente o primeiro histórico de lotação.

---

# UC-003 - Editar Colaborador

RF-009 Apenas Administrador poderá editar.

RF-010 Mudança de equipe criará novo histórico de lotação.

RF-011 Nenhum histórico poderá ser apagado.

---

# UC-004 - Solicitar Folga

Fluxo:

1. Selecionar tipo de folga.

2. Escolher data.

3. Escolher turno.

4. Confirmar.

### Requisitos

RF-012 Exibir somente agenda da equipe do colaborador.

RF-013 Permitir apenas datas disponíveis.

RF-014 Respeitar datas bloqueadas.

RF-015 Respeitar fechamento mensal.

RF-016 Respeitar limite de um ano de antecedência.

RF-017 Registrar timestamp da solicitação.

RF-018 Criar solicitação com status PENDENTE.

RF-019 A vaga será bloqueada exclusivamente após a gravação bem-sucedida da solicitação no banco de dados.

---

# UC-005 - Cancelar Solicitação

RF-020 O colaborador poderá cancelar solicitações permitidas pelas regras de negócio.

RF-021 O cancelamento liberará imediatamente a vaga.

RF-022 Registrar auditoria.

RF-023 Criar notificação.

---

# UC-006 - Visualizar Agenda

RF-024 Mostrar apenas agenda da própria equipe.

RF-025 Não mostrar nomes de terceiros.

RF-026 Mostrar estados:

- Disponível
- Indisponível
- Minha Solicitação Pendente
- Minha Folga Aprovada

---

# UC-007 - Consultar Histórico

RF-027 Mostrar apenas histórico do próprio colaborador.

RF-028 Administrador visualizará todos.

---

# UC-008 - Aprovar Solicitação

RF-029 Apenas Administrador.

RF-030 Alterar status para APROVADA.

RF-031 Registrar auditoria.

RF-032 Criar notificação.

---

# UC-009 - Reprovar Solicitação

RF-033 Apenas Administrador.

RF-034 Justificativa obrigatória.

RF-035 Alterar status para REPROVADA.

RF-036 Liberar vaga.

RF-037 Registrar auditoria.

RF-038 Criar notificação.

---

# UC-010 - Gerenciar Tipos de Folga

RF-039 Cadastrar.

RF-040 Editar.

RF-041 Inativar.

---

# UC-011 - Gerenciar Datas Bloqueadas

RF-042 Cadastrar.

RF-043 Editar.

RF-044 Remover.

RF-045 Criar exceções administrativas.

---

# UC-012 - Gerenciar Equipes

RF-046 Cadastrar.

RF-047 Editar.

RF-048 Consultar.

---

# UC-013 - Consultar Auditoria

RF-049 Filtrar por período.

RF-050 Filtrar por colaborador.

RF-051 Filtrar por ação.

RF-052 Exportar.

---

# UC-014 - Emitir Relatórios

RF-053 Relatório por período.

RF-054 Relatório por equipe.

RF-055 Relatório por colaborador.

RF-056 Relatório por tipo de folga.

---

# UC-015 - Configurações

RF-057 Definir dia de fechamento.

RF-058 Definir antecedência máxima.

RF-059 Definir quantidade máxima de solicitações simultâneas.

---

# UC-016 - Recuperação de Senha

RF-060 Apenas Administrador poderá redefinir senha.

RF-061 No primeiro acesso o colaborador deverá cadastrar nova senha.

---

# Cadastro Administrativo (Evolução Futura)

O sistema deverá prever ampliação para:

- Matrícula
- CPF
- E-mail
- WhatsApp
- Cargo
- Data de admissão
- Status
- Observações

Esses campos não fazem parte do MVP.

---

# Matriz Inicial de Rastreabilidade

| UC | RF |
|----|----|
| UC-001 | RF-001 a RF-004 |
| UC-002 | RF-005 a RF-008 |
| UC-003 | RF-009 a RF-011 |
| UC-004 | RF-012 a RF-019 |
| UC-005 | RF-020 a RF-023 |
| UC-006 | RF-024 a RF-026 |
| UC-007 | RF-027 a RF-028 |
| UC-008 | RF-029 a RF-032 |
| UC-009 | RF-033 a RF-038 |
| UC-010 | RF-039 a RF-041 |
| UC-011 | RF-042 a RF-045 |
| UC-012 | RF-046 a RF-048 |
| UC-013 | RF-049 a RF-052 |
| UC-014 | RF-053 a RF-056 |
| UC-015 | RF-057 a RF-059 |
| UC-016 | RF-060 a RF-061 |

---

Versão: 1.0.0

Status: CONGELADO