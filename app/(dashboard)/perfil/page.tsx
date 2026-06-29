import { redirect } from 'next/navigation'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ProfileHeader } from '@/src/features/perfil/components/profile-header'
import { ProfileDisplay } from '@/src/features/perfil/components/profile-display'
import { ProfileWorkInfo } from '@/src/features/perfil/components/profile-work-info'
import { ProfileEditForm } from '@/src/features/perfil/components/profile-edit-form'
import { PasswordChangeForm } from '@/src/features/perfil/components/password-change-form'
import { perfilService } from '@/src/features/perfil/services/perfil-service'

export default async function PerfilPage() {
  const perfil = await perfilService.getPerfil()

  if (!perfil) {
    redirect('/auth/login')
  }

  return (
    <div className="space-y-6">
      <ProfileHeader perfil={perfil} />

      <Tabs defaultValue="perfil">
        <TabsList>
          <TabsTrigger value="perfil">Perfil</TabsTrigger>
          <TabsTrigger value="editar">Editar</TabsTrigger>
          <TabsTrigger value="senha">Senha</TabsTrigger>
        </TabsList>

        <TabsContent value="perfil" className="space-y-4 pt-4">
          <ProfileDisplay perfil={perfil} />
          <ProfileWorkInfo perfil={perfil} />
        </TabsContent>

        <TabsContent value="editar" className="pt-4">
          <ProfileEditForm perfil={perfil} />
        </TabsContent>

        <TabsContent value="senha" className="pt-4">
          <PasswordChangeForm />
        </TabsContent>
      </Tabs>
    </div>
  )
}
