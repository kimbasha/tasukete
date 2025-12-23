import { createClient } from '@/lib/supabase/server'
import { PerformanceForm } from '@/components/admin/PerformanceForm'

export default async function NewPerformancePage() {
  const supabase = await createClient()
  const { data: theaters } = await supabase.from('theaters').select('id, name').order('name')

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">公演を追加</h2>
        <p className="text-muted-foreground">新しい公演を登録します</p>
      </div>
      <div className="max-w-2xl">
        <PerformanceForm theaters={theaters || []} />
      </div>
    </div>
  )
}
