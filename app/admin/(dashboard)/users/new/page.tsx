import { createClient } from '@/lib/supabase/server'
import { UserForm } from '@/components/admin/UserForm'
import { requireSuperAdmin } from '@/lib/auth/admin'

export default async function NewUserPage() {
  await requireSuperAdmin()
  const supabase = await createClient()

  const { data: theaters } = await supabase
    .from('troupes')
    .select('id, name')
    .order('name')

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">アカウントを追加</h2>
        <p className="text-muted-foreground">新しい劇団管理者アカウントを作成します</p>
      </div>
      <div className="max-w-2xl">
        <UserForm theaters={theaters || []} />
      </div>
    </div>
  )
}
