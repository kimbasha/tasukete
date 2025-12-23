import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { TicketStatusBadge } from '@/components/TicketStatusBadge'
import { ArrowLeft, Clock, MapPin, Ticket, ExternalLink, Calendar } from 'lucide-react'

interface Props {
  params: Promise<{ id: string }>
}

export default async function PerformancePage({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()

  const { data: performance, error } = await supabase
    .from('performances')
    .select(`
      *,
      theater:theaters(*)
    `)
    .eq('id', id)
    .single()

  if (error || !performance) {
    notFound()
  }

  const formattedTime = performance.start_time.slice(0, 5)
  const formattedDate = new Date(performance.performance_date).toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  })

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <Link href="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              トップページに戻る
            </Button>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* ポスター画像 */}
            <div className="relative aspect-[2/3] w-full max-w-md mx-auto">
              <Image
                src={performance.poster_image_url || '/placeholder.svg'}
                alt={performance.title}
                fill
                className="object-cover rounded-lg"
                priority
              />
            </div>

            {/* 公演情報 */}
            <div className="space-y-6">
              <div>
                <div className="flex items-start justify-between gap-4 mb-2">
                  <h1 className="text-3xl font-bold">{performance.title}</h1>
                  <TicketStatusBadge availableTickets={performance.available_tickets} />
                </div>
                {performance.theater && (
                  <p className="text-lg text-muted-foreground">
                    {performance.theater.name}
                  </p>
                )}
              </div>

              <Card>
                <CardContent className="pt-6 space-y-4">
                  <div className="flex items-start gap-3">
                    <Calendar className="w-5 h-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="font-semibold">公演日時</p>
                      <p className="text-muted-foreground">{formattedDate}</p>
                      <p className="text-muted-foreground">{formattedTime}開演</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="font-semibold">会場</p>
                      <p className="text-muted-foreground">{performance.venue}</p>
                      <p className="text-sm text-muted-foreground">({performance.area})</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Ticket className="w-5 h-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="font-semibold">当日券料金</p>
                      <p className="text-muted-foreground">
                        ¥{performance.ticket_price.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="font-semibold">在庫状況</p>
                      <p className="text-muted-foreground">
                        残り{performance.available_tickets}枚
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {performance.reservation_url && (
                <Button asChild size="lg" className="w-full">
                  <a
                    href={performance.reservation_url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    予約ページへ
                    <ExternalLink className="w-4 h-4 ml-2" />
                  </a>
                </Button>
              )}
            </div>
          </div>

          {/* 公演の詳細説明 */}
          {performance.description && (
            <div className="mt-12">
              <h2 className="text-2xl font-bold mb-4">公演について</h2>
              <Card>
                <CardContent className="pt-6">
                  <p className="text-muted-foreground whitespace-pre-wrap leading-relaxed">
                    {performance.description}
                  </p>
                </CardContent>
              </Card>
            </div>
          )}

          {/* 劇団情報 */}
          {performance.theater && (
            <div className="mt-8">
              <h2 className="text-2xl font-bold mb-4">劇団情報</h2>
              <Card>
                <CardContent className="pt-6">
                  <h3 className="text-xl font-semibold mb-2">
                    {performance.theater.name}
                  </h3>
                  {performance.theater.description && (
                    <p className="text-muted-foreground mb-4">
                      {performance.theater.description}
                    </p>
                  )}
                  {performance.theater.website && (
                    <Button asChild variant="outline" size="sm">
                      <a
                        href={performance.theater.website}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        公式サイト
                        <ExternalLink className="w-4 h-4 ml-2" />
                      </a>
                    </Button>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
