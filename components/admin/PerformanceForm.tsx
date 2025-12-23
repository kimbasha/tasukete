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
    description: string
    start_time: string
    remaining_tickets: number
    area: string
    poster_image_url?: string
  }
}

export function PerformanceForm({ theaters, initialData }: PerformanceFormProps) {
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
      start_time: initialData?.start_time ? new Date(initialData.start_time).toISOString().slice(0, 16) : '',
      remaining_tickets: initialData?.remaining_tickets || 0,
      area: initialData?.area || '東京',
      poster_image_url: initialData?.poster_image_url || '',
    },
  })

  async function onSubmit(values: PerformanceFormValues) {
    try {
      setIsLoading(true)
      setError(null)

      const formData = new FormData()
      formData.append('theater_id', values.theater_id)
      formData.append('title', values.title)
      formData.append('description', values.description)
      formData.append('start_time', new Date(values.start_time).toISOString())
      formData.append('remaining_tickets', values.remaining_tickets.toString())
      formData.append('area', values.area)

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
    } catch (err) {
      setError('保存中にエラーが発生しました')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="theater_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>劇団</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
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
              <FormLabel>公演説明</FormLabel>
              <FormControl>
                <Textarea placeholder="公演の説明を入力" rows={5} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="start_time"
          render={({ field }) => (
            <FormItem>
              <FormLabel>開演時刻</FormLabel>
              <FormControl>
                <Input type="datetime-local" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="remaining_tickets"
          render={({ field }) => (
            <FormItem>
              <FormLabel>残券数</FormLabel>
              <FormControl>
                <Input type="number" min={0} {...field} />
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
                  <SelectItem value="東京">東京</SelectItem>
                  <SelectItem value="大阪">大阪</SelectItem>
                  <SelectItem value="名古屋">名古屋</SelectItem>
                  <SelectItem value="その他">その他</SelectItem>
                </SelectContent>
              </Select>
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
