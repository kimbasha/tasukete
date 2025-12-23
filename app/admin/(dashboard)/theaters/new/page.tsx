import { TheaterForm } from '@/components/admin/TheaterForm'

export default function NewTheaterPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">劇団を追加</h2>
        <p className="text-muted-foreground">新しい劇団を登録します</p>
      </div>
      <div className="max-w-2xl">
        <TheaterForm />
      </div>
    </div>
  )
}
