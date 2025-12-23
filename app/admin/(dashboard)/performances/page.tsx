import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { DeletePerformanceButton } from '@/components/admin/DeletePerformanceButton'
import { requireAdmin, isTheaterAdmin } from '@/lib/auth/admin'

export default async function PerformancesPage() {
  const adminUser = await requireAdmin()
  const supabase = await createClient()

  // theater_adminは自分の劇団の公演のみ表示
  let query = supabase.from('performances').select('*, theaters(name)')

  if (isTheaterAdmin(adminUser)) {
    query = query.eq('theater_id', adminUser.theater_id!)
  }

  const { data: performances } = await query.order('start_time', { ascending: false })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">公演管理</h2>
          <p className="text-muted-foreground">公演情報の登録・編集・削除</p>
        </div>
        <Button asChild>
          <Link href="/admin/performances/new">公演を追加</Link>
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ポスター</TableHead>
              <TableHead>公演名</TableHead>
              <TableHead>劇団</TableHead>
              <TableHead>開演時刻</TableHead>
              <TableHead>残券数</TableHead>
              <TableHead className="text-right">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {performances && performances.length > 0 ? (
              performances.map((performance) => (
                <TableRow key={performance.id}>
                  <TableCell>
                    {performance.poster_image_url ? (
                      <div className="relative h-16 w-12 overflow-hidden rounded">
                        <Image
                          src={performance.poster_image_url}
                          alt={performance.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="h-16 w-12 rounded bg-muted" />
                    )}
                  </TableCell>
                  <TableCell className="font-medium">{performance.title}</TableCell>
                  <TableCell>{performance.theaters?.name}</TableCell>
                  <TableCell>
                    {new Date(performance.start_time).toLocaleString('ja-JP')}
                  </TableCell>
                  <TableCell>{performance.remaining_tickets}枚</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button asChild variant="outline" size="sm">
                        <Link href={`/admin/performances/${performance.id}/edit`}>
                          編集
                        </Link>
                      </Button>
                      <DeletePerformanceButton
                        id={performance.id}
                        title={performance.title}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center">
                  公演がまだ登録されていません
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
