'use client'

import { useState, useMemo } from 'react'
import { Performance, Theater } from '@/types/database'
import { PerformanceCard } from '@/components/PerformanceCard'
import { FilterBar } from '@/components/FilterBar'

interface PerformanceListProps {
  performances: (Performance & { theater?: Theater })[]
}

export function PerformanceList({ performances }: PerformanceListProps) {
  const [selectedDate, setSelectedDate] = useState<'today' | 'tomorrow' | 'weekend'>('today')
  const [selectedArea, setSelectedArea] = useState<string>('all')

  // 利用可能なエリアを抽出
  const availableAreas = useMemo(() => {
    const areas = performances.map((p) => p.area)
    return Array.from(new Set(areas)).sort()
  }, [performances])

  // フィルタリングされた公演
  const filteredPerformances = useMemo(() => {
    return performances.filter((performance) => {
      const performanceDate = new Date(performance.performance_date)
      const today = new Date()
      today.setHours(0, 0, 0, 0)

      const tomorrow = new Date(today)
      tomorrow.setDate(tomorrow.getDate() + 1)

      const weekendStart = new Date(today)
      const daysUntilSaturday = (6 - today.getDay() + 7) % 7
      weekendStart.setDate(today.getDate() + (daysUntilSaturday === 0 ? 7 : daysUntilSaturday))

      const weekendEnd = new Date(weekendStart)
      weekendEnd.setDate(weekendStart.getDate() + 1)
      weekendEnd.setHours(23, 59, 59, 999)

      // 日付フィルター
      let dateMatch = false
      if (selectedDate === 'today') {
        dateMatch = performanceDate.toDateString() === today.toDateString()
      } else if (selectedDate === 'tomorrow') {
        dateMatch = performanceDate.toDateString() === tomorrow.toDateString()
      } else if (selectedDate === 'weekend') {
        dateMatch = performanceDate >= weekendStart && performanceDate <= weekendEnd
      }

      // エリアフィルター
      const areaMatch = selectedArea === 'all' || performance.area === selectedArea

      return dateMatch && areaMatch
    })
  }, [performances, selectedDate, selectedArea])

  return (
    <div className="space-y-8">
      <FilterBar
        selectedDate={selectedDate}
        selectedArea={selectedArea}
        onDateChange={setSelectedDate}
        onAreaChange={setSelectedArea}
        availableAreas={availableAreas}
      />

      <div>
        <h2 className="text-2xl font-bold mb-4">
          {selectedDate === 'today' && '今日の公演'}
          {selectedDate === 'tomorrow' && '明日の公演'}
          {selectedDate === 'weekend' && '週末の公演'}
          {selectedArea !== 'all' && ` - ${selectedArea}`}
        </h2>

        {filteredPerformances.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              該当する公演が見つかりませんでした
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPerformances.map((performance) => (
              <PerformanceCard key={performance.id} performance={performance} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
