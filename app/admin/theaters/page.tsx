import Link from 'next/link'
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
import { DeleteTheaterButton } from '@/components/admin/DeleteTheaterButton'

export default async function TheatersPage() {
  const supabase = await createClient()
  const { data: theaters } = await supabase
    .from('theaters')
    .select('*')
    .order('name')

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">劇団管理</h2>
          <p className="text-muted-foreground">劇団の登録・編集・削除</p>
        </div>
        <Button asChild>
          <Link href="/admin/theaters/new">劇団を追加</Link>
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>劇団名</TableHead>
              <TableHead>作成日</TableHead>
              <TableHead className="text-right">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {theaters && theaters.length > 0 ? (
              theaters.map((theater) => (
                <TableRow key={theater.id}>
                  <TableCell className="font-medium">{theater.name}</TableCell>
                  <TableCell>
                    {new Date(theater.created_at).toLocaleDateString('ja-JP')}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button asChild variant="outline" size="sm">
                        <Link href={`/admin/theaters/${theater.id}/edit`}>
                          編集
                        </Link>
                      </Button>
                      <DeleteTheaterButton
                        id={theater.id}
                        name={theater.name}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} className="text-center">
                  劇団がまだ登録されていません
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
