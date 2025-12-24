import { Badge } from '@/components/ui/badge'

interface TicketStatusBadgeProps {
  availableTickets: number | null
}

export function TicketStatusBadge({ availableTickets }: TicketStatusBadgeProps) {
  if (availableTickets === null || availableTickets === undefined) {
    return (
      <Badge variant="default" className="bg-blue-600 hover:bg-blue-700 text-sm">
        当日券あり
      </Badge>
    )
  }

  if (availableTickets === 0) {
    return (
      <Badge variant="destructive" className="text-sm">
        完売
      </Badge>
    )
  }

  if (availableTickets <= 5) {
    return (
      <Badge variant="default" className="bg-orange-500 hover:bg-orange-600 text-sm">
        残り{availableTickets}枚
      </Badge>
    )
  }

  return (
    <Badge variant="default" className="bg-green-600 hover:bg-green-700 text-sm">
      残り{availableTickets}枚
    </Badge>
  )
}
