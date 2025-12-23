import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { PerformanceForm } from '@/components/admin/PerformanceForm'

interface EditPerformancePageProps {
  params: Promise<{ id: string }>
}

export default async function EditPerformancePage({ params }: EditPerformancePageProps) {
  const { id } = await params
  const supabase = await createClient()

  const [{ data: performance }, { data: theaters }] = await Promise.all([
    supabase.from('performances').select('*').eq('id', id).single(),
    supabase.from('theaters').select('id, name').order('name'),
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
        <PerformanceForm theaters={theaters || []} initialData={performance} />
      </div>
    </div>
  )
}
