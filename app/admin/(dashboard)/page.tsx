import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/server'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { requireAdmin, isTheaterAdmin } from '@/lib/auth/admin'

export default async function AdminDashboard() {
  const adminUser = await requireAdmin()
  const supabase = await createClient()

  // theater_adminは自分の劇団のみにフィルタ
  let theatersQuery = supabase.from('theaters').select('*', { count: 'exact', head: true })
  let performancesQuery = supabase.from('performances').select('*', { count: 'exact', head: true })
  const today = new Date().toISOString().split('T')[0]

  let todayPerformancesQuery = supabase
    .from('performances')
    .select('*', { count: 'exact', head: true })
    .eq('performance_date', today)
  let recentPerformancesQuery = supabase
    .from('performances')
    .select('*, theaters(name)')
    .order('created_at', { ascending: false })
    .limit(5)
  let lowStockPerformancesQuery = supabase
    .from('performances')
    .select('*, theaters(name)')
    .lte('available_tickets', 10)
    .gte('performance_date', today)
    .order('available_tickets', { ascending: true })
    .limit(5)

  if (isTheaterAdmin(adminUser)) {
    theatersQuery = theatersQuery.eq('id', adminUser.theater_id!)
    performancesQuery = performancesQuery.eq('theater_id', adminUser.theater_id!)
    todayPerformancesQuery = todayPerformancesQuery.eq('theater_id', adminUser.theater_id!)
    recentPerformancesQuery = recentPerformancesQuery.eq('theater_id', adminUser.theater_id!)
    lowStockPerformancesQuery = lowStockPerformancesQuery.eq('theater_id', adminUser.theater_id!)
  }

  // 統計データを取得
  const [
    { count: totalTheaters },
    { count: totalPerformances },
    { count: todayPerformances },
    { data: recentPerformances },
    { data: lowStockPerformances },
  ] = await Promise.all([
    theatersQuery,
    performancesQuery,
    todayPerformancesQuery,
    recentPerformancesQuery,
    lowStockPerformancesQuery,
  ])

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">ダッシュボード</h2>
        <p className="text-muted-foreground">
          タスケテ管理画面の統計情報
        </p>
      </div>

      {/* 統計カード */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">登録劇団数</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTheaters || 0}団体</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">総公演数</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalPerformances || 0}公演</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">今日の公演</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todayPerformances || 0}公演</div>
          </CardContent>
        </Card>
      </div>

      {/* 最近登録された公演 */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>最近登録された公演</CardTitle>
              <CardDescription>直近5件の公演情報</CardDescription>
            </div>
            <Button asChild variant="outline" size="sm">
              <Link href="/admin/performances">すべて見る</Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {recentPerformances && recentPerformances.length > 0 ? (
            <div className="space-y-4">
              {recentPerformances.map((performance) => (
                <div
                  key={performance.id}
                  className="flex items-center gap-4 rounded-lg border p-3"
                >
                  {performance.poster_image_url ? (
                    <div className="relative h-16 w-12 flex-shrink-0 overflow-hidden rounded">
                      <Image
                        src={performance.poster_image_url}
                        alt={performance.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="h-16 w-12 flex-shrink-0 rounded bg-muted" />
                  )}
                  <div className="flex-1 space-y-1">
                    <p className="font-medium leading-none">{performance.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {performance.theaters?.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {`${performance.performance_date} ${performance.start_time}`}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">
                      {performance.available_tickets !== null ? `残${performance.available_tickets}枚` : '当日券あり'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-sm text-muted-foreground">
              公演が登録されていません
            </p>
          )}
        </CardContent>
      </Card>

      {/* 在庫警告 */}
      {lowStockPerformances && lowStockPerformances.length > 0 && (
        <Card className="border-destructive/50 bg-destructive/5">
          <CardHeader>
            <CardTitle className="text-destructive">在庫警告</CardTitle>
            <CardDescription>残券数が10枚以下の公演</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {lowStockPerformances.map((performance) => (
                <div
                  key={performance.id}
                  className="flex items-center justify-between rounded-lg border border-destructive/20 bg-background p-3"
                >
                  <div>
                    <p className="font-medium">{performance.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {performance.theaters?.name} •{' '}
                      {`${performance.performance_date} ${performance.start_time}`}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-destructive">
                      {performance.available_tickets !== null ? `残${performance.available_tickets}枚` : '当日券あり'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
