import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { PerformanceForm } from '@/components/admin/PerformanceForm'
import { requireAdmin, isTheaterAdmin } from '@/lib/auth/admin'

interface EditPerformancePageProps {
  params: Promise<{ id: string }>
}

export default async function EditPerformancePage({ params }: EditPerformancePageProps) {
  const { id } = await params
  const adminUser = await requireAdmin()
  const supabase = await createClient()

  // theater_adminは自分の劇団のみ選択可能
  let theatersQuery = supabase.from('theaters').select('id, name')

  if (isTheaterAdmin(adminUser)) {
    theatersQuery = theatersQuery.eq('id', adminUser.theater_id!)
  }

  const [{ data: performance }, { data: theaters }] = await Promise.all([
    supabase.from('performances').select('*').eq('id', id).single(),
    theatersQuery.order('name'),
  ])

  if (!performance) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">公演を編集</h2>
        <p className="text-muted-foreground">公演情報を更新します</p>
      </div>
      <div className="max-w-2xl">
        <PerformanceForm
          theaters={theaters || []}
          initialData={performance}
          isTheaterFixed={isTheaterAdmin(adminUser)}
        />
      </div>
    </div>
  )
}
