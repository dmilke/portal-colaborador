'use client'

import { useActionState } from 'react'
import { useFormStatus } from 'react-dom'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircle, Loader2 } from 'lucide-react'
import type { Colaborador } from '../types'
import type { ColaboradorActionState } from '../actions/colaborador-actions'

interface ColaboradorFormProps {
  action: (prevState: ColaboradorActionState, formData: FormData) => Promise<ColaboradorActionState>
  colaborador?: Colaborador
  departamentos: { id: string; nome: string }[]
  cargos: { id: string; nome: string }[]
  unidades: { id: string; nome: string; sigla: string | null }[]
}

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" disabled={pending}>
      {pending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
      Salvar
    </Button>
  )
}

export function ColaboradorForm({ action, colaborador, departamentos, cargos, unidades }: ColaboradorFormProps) {
  const [state, formAction] = useActionState<ColaboradorActionState, FormData>(action, null)
  const isEditing = !!colaborador

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isEditing ? 'Editar Colaborador' : 'Novo Colaborador'}</CardTitle>
        <CardDescription>
          {isEditing
            ? 'Altere os dados do colaborador'
            : 'Preencha os dados para cadastrar um novo colaborador'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-6">
          {colaborador && <input type="hidden" name="id" value={colaborador.id} />}

          {state?.message && !state.errors && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{state.message}</AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nome">
                Nome <span className="text-red-500">*</span>
              </Label>
              <Input
                id="nome"
                name="nome"
                defaultValue={colaborador?.nome ?? ''}
                placeholder="Nome completo"
              />
              {state?.errors?.nome && (
                <p className="text-sm text-red-500">{state.errors.nome[0]}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email corporativo</Label>
              <Input
                id="email"
                name="email"
                type="email"
                defaultValue={colaborador?.email ?? ''}
                placeholder="email@exemplo.com"
              />
              {state?.errors?.email && (
                <p className="text-sm text-red-500">{state.errors.email[0]}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="matricula">Matrícula</Label>
              <Input
                id="matricula"
                name="matricula"
                defaultValue={colaborador?.matricula ?? ''}
                placeholder="Número da matrícula"
              />
              {state?.errors?.matricula && (
                <p className="text-sm text-red-500">{state.errors.matricula[0]}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="cpf">CPF</Label>
              <Input
                id="cpf"
                name="cpf"
                defaultValue={colaborador?.cpf ?? ''}
                placeholder="000.000.000-00"
              />
              {state?.errors?.cpf && (
                <p className="text-sm text-red-500">{state.errors.cpf[0]}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="telefone">Telefone</Label>
              <Input
                id="telefone"
                name="telefone"
                defaultValue={colaborador?.telefone ?? ''}
                placeholder="(11) 99999-9999"
              />
              {state?.errors?.telefone && (
                <p className="text-sm text-red-500">{state.errors.telefone[0]}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="dataNascimento">Data de nascimento</Label>
              <Input
                id="dataNascimento"
                name="dataNascimento"
                type="date"
                defaultValue={colaborador?.dataNascimento ?? ''}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dataAdmissao">Data de admissão</Label>
              <Input
                id="dataAdmissao"
                name="dataAdmissao"
                type="date"
                defaultValue={colaborador?.dataAdmissao ?? ''}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="genero">Gênero</Label>
              <select
                id="genero"
                name="genero"
                defaultValue={colaborador?.genero ?? ''}
                className="flex h-9 w-full rounded-lg border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
              >
                <option value="">Selecione...</option>
                <option value="masculino">Masculino</option>
                <option value="feminino">Feminino</option>
                <option value="outro">Outro</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="estadoCivil">Estado civil</Label>
              <select
                id="estadoCivil"
                name="estadoCivil"
                defaultValue={colaborador?.estadoCivil ?? ''}
                className="flex h-9 w-full rounded-lg border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
              >
                <option value="">Selecione...</option>
                <option value="solteiro">Solteiro</option>
                <option value="casado">Casado</option>
                <option value="divorciado">Divorciado</option>
                <option value="viuvo">Viúvo</option>
                <option value="uniao_estavel">União estável</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="departamentoId">Departamento</Label>
              <select
                id="departamentoId"
                name="departamentoId"
                defaultValue={colaborador?.departamentoId ?? ''}
                className="flex h-9 w-full rounded-lg border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
              >
                <option value="">Selecione...</option>
                {departamentos.map((d) => (
                  <option key={d.id} value={d.id}>{d.nome}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="cargoId">Cargo</Label>
              <select
                id="cargoId"
                name="cargoId"
                defaultValue={colaborador?.cargoId ?? ''}
                className="flex h-9 w-full rounded-lg border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
              >
                <option value="">Selecione...</option>
                {cargos.map((c) => (
                  <option key={c.id} value={c.id}>{c.nome}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="unidadeId">Unidade</Label>
              <select
                id="unidadeId"
                name="unidadeId"
                defaultValue={colaborador?.unidadeId ?? ''}
                className="flex h-9 w-full rounded-lg border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
              >
                <option value="">Selecione...</option>
                {unidades.map((u) => (
                  <option key={u.id} value={u.id}>{u.sigla ? `${u.nome} (${u.sigla})` : u.nome}</option>
                ))}
              </select>
            </div>
          </div>

          {!isEditing && (
            <div className="border-t pt-6 space-y-4">
              <h3 className="text-sm font-medium">Criar usuário de acesso</h3>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="inviteUser" name="inviteUser" value="true" />
                <Label htmlFor="inviteUser">Criar conta de acesso para este colaborador</Label>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="inviteEmail">Email de acesso</Label>
                  <Input id="inviteEmail" name="inviteEmail" placeholder="usuario@exemplo.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Senha</Label>
                  <Input id="password" name="password" type="password" placeholder="Senha temporária" />
                </div>
              </div>
            </div>
          )}

          <div className="flex items-center gap-3">
            <SubmitButton />
            <Button variant="outline" type="button" onClick={() => window.history.back()}>
              Cancelar
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
