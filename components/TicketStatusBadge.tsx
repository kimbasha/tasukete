import { Badge } from '@/components/ui/badge'

interface TicketStatusBadgeProps {
  availableTickets: number
}

export function TicketStatusBadge({ availableTickets }: TicketStatusBadgeProps) {
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
