import { createClient } from '@/lib/supabase/server'
import { PerformanceList } from '@/components/PerformanceList'

export default async function Home() {
  const supabase = await createClient()

  // 公演データを取得（今日以降の公演）
  const { data: performances, error } = await supabase
    .from('performances')
    .select(`
      *,
      theater:theaters(*)
    `)
    .gte('performance_date', new Date().toISOString().split('T')[0])
    .order('performance_date', { ascending: true })
    .order('start_time', { ascending: true })

  if (error) {
    console.error('Error fetching performances:', error)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500">データの取得に失敗しました</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-center md:text-4xl">
            タスケテ <span className="text-lg md:text-xl">〜HELP ME!!〜</span>
          </h1>
          <p className="text-center text-muted-foreground mt-2">
            当日券特化型予約サービス
          </p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <PerformanceList performances={performances || []} />
      </main>

      <footer className="border-t mt-12">
        <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
          © 2025 タスケテ 〜HELP ME!!〜
        </div>
      </footer>
    </div>
  )
}
