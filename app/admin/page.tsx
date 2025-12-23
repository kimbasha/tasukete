import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">ダッシュボード</h2>
        <p className="text-muted-foreground">
          タスケテ管理画面へようこそ
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>劇団管理</CardTitle>
            <CardDescription>
              劇団の登録・編集・削除を行います
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              左のメニューから「劇団管理」を選択してください
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>公演管理</CardTitle>
            <CardDescription>
              公演情報の登録・編集・削除を行います
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              左のメニューから「公演管理」を選択してください
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>準備中</CardTitle>
            <CardDescription>
              今後の機能追加をお楽しみに
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              統計情報などを追加予定です
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
