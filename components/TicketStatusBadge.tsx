import { Badge } from '@/components/ui/badge'

interface TicketStatusBadgeProps {
  availableTickets: number | null
  hasDayTickets?: boolean
}

export function TicketStatusBadge({ availableTickets, hasDayTickets }: TicketStatusBadgeProps) {
  // 当日券販売ありフラグが立っている場合
  if (hasDayTickets) {
    return (
      <Badge variant="default" className="bg-blue-600 hover:bg-blue-700 text-sm">
        当日券あり
      </Badge>
    )
  }

  // 残券数が明示されている場合
  if (availableTickets !== null && availableTickets !== undefined) {
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

  // デフォルト: 情報なし
  return (
    <Badge variant="secondary" className="text-sm">
      要確認
    </Badge>
  )
}
