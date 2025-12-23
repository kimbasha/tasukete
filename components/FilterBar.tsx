'use client'

import { Button } from '@/components/ui/button'

interface FilterBarProps {
  selectedDate: 'today' | 'tomorrow' | 'weekend'
  selectedArea: string
  onDateChange: (date: 'today' | 'tomorrow' | 'weekend') => void
  onAreaChange: (area: string) => void
  availableAreas: string[]
}

export function FilterBar({
  selectedDate,
  selectedArea,
  onDateChange,
  onAreaChange,
  availableAreas,
}: FilterBarProps) {
  return (
    <div className="space-y-4">
      {/* 日付フィルター */}
      <div>
        <h3 className="text-sm font-semibold mb-2">日付</h3>
        <div className="flex gap-2 flex-wrap">
          <Button
            variant={selectedDate === 'today' ? 'default' : 'outline'}
            size="sm"
            onClick={() => onDateChange('today')}
          >
            今日
          </Button>
          <Button
            variant={selectedDate === 'tomorrow' ? 'default' : 'outline'}
            size="sm"
            onClick={() => onDateChange('tomorrow')}
          >
            明日
          </Button>
          <Button
            variant={selectedDate === 'weekend' ? 'default' : 'outline'}
            size="sm"
            onClick={() => onDateChange('weekend')}
          >
            週末
          </Button>
        </div>
      </div>

      {/* エリアフィルター */}
      <div>
        <h3 className="text-sm font-semibold mb-2">エリア</h3>
        <div className="flex gap-2 flex-wrap">
          <Button
            variant={selectedArea === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => onAreaChange('all')}
          >
            すべて
          </Button>
          {availableAreas.map((area) => (
            <Button
              key={area}
              variant={selectedArea === area ? 'default' : 'outline'}
              size="sm"
              onClick={() => onAreaChange(area)}
            >
              {area}
            </Button>
          ))}
        </div>
      </div>
    </div>
  )
}
