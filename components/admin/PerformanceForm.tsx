'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { performanceSchema, type PerformanceFormValues } from '@/lib/validations/performance'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ImageUpload } from './ImageUpload'
import { createPerformance, updatePerformance } from '@/app/admin/(dashboard)/performances/actions'

interface Theater {
  id: string
  name: string
}

interface PerformanceFormProps {
  theaters: Theater[]
  initialData?: {
    id: string
    theater_id: string
    title: string
    description?: string
    venue: string
    area: string
    performance_date: string
    start_time: string
    door_open_time?: string
    available_tickets: number
    ticket_price: number
    reservation_url?: string
    poster_image_url?: string
  }
  isTheaterFixed?: boolean
}

export function PerformanceForm({ theaters, initialData, isTheaterFixed = false }: PerformanceFormProps) {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [imageFile, setImageFile] = useState<File | null>(null)

  const form = useForm<PerformanceFormValues>({
    resolver: zodResolver(performanceSchema),
    defaultValues: {
      theater_id: initialData?.theater_id || '',
      title: initialData?.title || '',
      description: initialData?.description || '',
      venue: initialData?.venue || '',
      area: (initialData?.area as '下北沢' | '新宿' | '渋谷' | '池袋' | 'その他' | undefined) || '下北沢',
      performance_date: initialData?.performance_date || '',
      start_time: initialData?.start_time || '',
      door_open_time: initialData?.door_open_time || '',
      available_tickets: initialData?.available_tickets || undefined,
      ticket_price: initialData?.ticket_price || 0,
      reservation_url: initialData?.reservation_url || '',
      poster_image_url: initialData?.poster_image_url || '',
    },
  })

  const onSubmit = async (values: PerformanceFormValues) => {
    try {
      setIsLoading(true)
      setError(null)

      const formData = new FormData()
      formData.append('theater_id', values.theater_id)
      formData.append('title', values.title)
      if (values.description) formData.append('description', values.description)
      formData.append('venue', values.venue)
      formData.append('area', values.area)
      formData.append('performance_date', values.performance_date)
      formData.append('start_time', values.start_time)
      if (values.door_open_time) formData.append('door_open_time', values.door_open_time)
      if (values.available_tickets !== undefined) {
        formData.append('available_tickets', values.available_tickets.toString())
      }
      formData.append('ticket_price', values.ticket_price.toString())
      if (values.reservation_url) formData.append('reservation_url', values.reservation_url)

      if (imageFile) {
        formData.append('poster_image', imageFile)
      }

      const result = initialData
        ? await updatePerformance(initialData.id, formData)
        : await createPerformance(formData)

      if (result?.error) {
        setError(result.error)
        return
      }

      // リダイレクトはServer Actionで行われる
    } catch {
      setError('保存中にエラーが発生しました')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {isTheaterFixed ? (
          <div className="space-y-2">
            <FormLabel>劇団</FormLabel>
            <div className="rounded-md border border-input bg-muted px-3 py-2">
              {theaters[0]?.name || '劇団名'}
            </div>
            <input type="hidden" {...form.register('theater_id')} />
          </div>
        ) : (
          <FormField
            control={form.control}
            name="theater_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>劇団</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="劇団を選択" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {theaters.map((theater) => (
                      <SelectItem key={theater.id} value={theater.id}>
                        {theater.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>公演タイトル</FormLabel>
              <FormControl>
                <Input placeholder="公演タイトルを入力" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>公演説明（任意）</FormLabel>
              <FormControl>
                <Textarea placeholder="公演の説明を入力" rows={5} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="venue"
          render={({ field }) => (
            <FormItem>
              <FormLabel>会場</FormLabel>
              <FormControl>
                <Input placeholder="例: 下北沢駅前劇場" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="area"
          render={({ field }) => (
            <FormItem>
              <FormLabel>エリア</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="下北沢">下北沢</SelectItem>
                  <SelectItem value="新宿">新宿</SelectItem>
                  <SelectItem value="渋谷">渋谷</SelectItem>
                  <SelectItem value="池袋">池袋</SelectItem>
                  <SelectItem value="その他">その他</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="performance_date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>公演日</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="start_time"
            render={({ field }) => (
              <FormItem>
                <FormLabel>開演時刻</FormLabel>
                <FormControl>
                  <Input type="time" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="door_open_time"
            render={({ field }) => (
              <FormItem>
                <FormLabel>開場時刻（任意）</FormLabel>
                <FormControl>
                  <Input type="time" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="available_tickets"
            render={({ field }) => (
              <FormItem>
                <FormLabel>残券数（任意）</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={0}
                    placeholder="不明な場合は空欄"
                    {...field}
                    value={field.value ?? ''}
                    onChange={(e) => {
                      const value = e.target.value
                      field.onChange(value === '' ? undefined : Number(value))
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="ticket_price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>チケット価格</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={0}
                    placeholder="円"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="reservation_url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>予約URL（任意）</FormLabel>
              <FormControl>
                <Input type="url" placeholder="https://example.com/reserve" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div>
          <FormLabel>ポスター画像</FormLabel>
          <ImageUpload
            value={form.watch('poster_image_url')}
            onChange={setImageFile}
            onRemove={() => form.setValue('poster_image_url', '')}
          />
        </div>

        {error && <div className="text-sm text-destructive">{error}</div>}

        <div className="flex gap-4">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? '保存中...' : initialData ? '更新' : '作成'}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push('/admin/performances')}
          >
            キャンセル
          </Button>
        </div>
      </form>
    </Form>
  )
}
