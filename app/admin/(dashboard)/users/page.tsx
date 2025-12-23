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
import { requireSuperAdmin } from '@/lib/auth/admin'
import { DeleteUserButton } from '@/components/admin/DeleteUserButton'

export default async function UsersPage() {
  await requireSuperAdmin()
  const supabase = await createClient()

  // theater_adminsとtheatersをJOINして取得
  const { data: theaterAdmins } = await supabase
    .from('theater_admins')
    .select('*, theaters(name)')
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">ユーザー管理</h2>
          <p className="text-muted-foreground">劇団管理者アカウントの作成・削除</p>
        </div>
        <Button asChild>
          <Link href="/admin/users/new">アカウントを追加</Link>
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>メールアドレス</TableHead>
              <TableHead>劇団</TableHead>
              <TableHead>作成日</TableHead>
              <TableHead className="text-right">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {theaterAdmins && theaterAdmins.length > 0 ? (
              theaterAdmins.map((admin) => (
                <TableRow key={admin.id}>
                  <TableCell className="font-medium">{admin.email}</TableCell>
                  <TableCell>{admin.theaters?.name || '未設定'}</TableCell>
                  <TableCell>
                    {new Date(admin.created_at).toLocaleDateString('ja-JP')}
                  </TableCell>
                  <TableCell className="text-right">
                    <DeleteUserButton
                      id={admin.id}
                      email={admin.email}
                    />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="text-center">
                  劇団管理者アカウントがまだ登録されていません
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
