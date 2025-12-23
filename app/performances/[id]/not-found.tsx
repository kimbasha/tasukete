import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-6 px-4">
        <h1 className="text-4xl font-bold">公演が見つかりません</h1>
        <p className="text-muted-foreground">
          お探しの公演は存在しないか、削除された可能性があります。
        </p>
        <Button asChild>
          <Link href="/">
            <ArrowLeft className="w-4 h-4 mr-2" />
            トップページに戻る
          </Link>
        </Button>
      </div>
    </div>
  )
}
