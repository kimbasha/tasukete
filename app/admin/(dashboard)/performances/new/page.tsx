import { createClient } from '@/lib/supabase/server'
import { PerformanceForm } from '@/components/admin/PerformanceForm'
import { requireAdmin, isTheaterAdmin } from '@/lib/auth/admin'

export default async function NewPerformancePage() {
  const adminUser = await requireAdmin()
  const supabase = await createClient()

  // theater_adminは自分の劇団のみ選択可能
  let theatersQuery = supabase.from('theaters').select('id, name')

  if (isTheaterAdmin(adminUser)) {
    theatersQuery = theatersQuery.eq('id', adminUser.theater_id!)
  }

  const { data: theaters } = await theatersQuery.order('name')

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">公演を追加</h2>
        <p className="text-muted-foreground">新しい公演を登録します</p>
      </div>
      <div className="max-w-2xl">
        <PerformanceForm
          theaters={theaters || []}
          isTheaterFixed={isTheaterAdmin(adminUser)}
        />
      </div>
    </div>
  )
}
