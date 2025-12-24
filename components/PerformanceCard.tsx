import Link from 'next/link'
import Image from 'next/image'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { TicketStatusBadge } from '@/components/TicketStatusBadge'
import { Performance, Troupe } from '@/types/database'
import { Clock, MapPin, Ticket } from 'lucide-react'

interface PerformanceCardProps {
  performance: Performance & {
    troupe?: Troupe
  }
}

export function PerformanceCard({ performance }: PerformanceCardProps) {
  const formattedTime = performance.start_time.slice(0, 5) // HH:MM形式に

  return (
    <Link href={`/performances/${performance.id}`}>
      <Card className="hover:shadow-lg transition-shadow cursor-pointer overflow-hidden h-full">
        <CardHeader className="p-0">
          <div className="relative w-full h-48">
            <Image
              src={performance.poster_image_url || '/placeholder.svg'}
              alt={performance.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        </CardHeader>
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="font-bold text-lg line-clamp-2">{performance.title}</h3>
            <TicketStatusBadge
              availableTickets={performance.available_tickets}
              hasDayTickets={performance.has_day_tickets}
            />
          </div>

          {performance.troupe && (
            <p className="text-sm text-muted-foreground mb-3">
              {performance.troupe.name}
            </p>
          )}

          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span>{formattedTime}開演</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="w-4 h-4" />
              <span>{performance.venue}（{performance.area}）</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Ticket className="w-4 h-4" />
              <span>¥{performance.ticket_price.toLocaleString()}</span>
            </div>
          </div>
        </CardContent>
        <CardFooter className="p-4 pt-0">
          <p className="text-sm text-muted-foreground line-clamp-2">
            {performance.description}
          </p>
        </CardFooter>
      </Card>
    </Link>
  )
}
