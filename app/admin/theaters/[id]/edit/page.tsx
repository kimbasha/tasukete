import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { TheaterForm } from '@/components/admin/TheaterForm'

interface EditTheaterPageProps {
  params: Promise<{ id: string }>
}

export default async function EditTheaterPage({ params }: EditTheaterPageProps) {
  const { id } = await params
  const supabase = await createClient()

  const { data: theater } = await supabase
    .from('theaters')
    .select('*')
    .eq('id', id)
    .single()

  if (!theater) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">劇団を編集</h2>
        <p className="text-muted-foreground">劇団情報を更新します</p>
      </div>
      <div className="max-w-2xl">
        <TheaterForm initialData={theater} />
      </div>
    </div>
  )
}
