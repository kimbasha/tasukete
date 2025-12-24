'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { theaterSchema, type TheaterFormValues } from '@/lib/validations/theater'
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
import { createTheater, updateTheater } from '@/app/admin/(dashboard)/theaters/actions'

interface TheaterFormProps {
  initialData?: {
    id: string
    name: string
    description?: string | null
    website?: string | null
  }
}

export function TheaterForm({ initialData }: TheaterFormProps) {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<TheaterFormValues>({
    resolver: zodResolver(theaterSchema),
    defaultValues: {
      name: initialData?.name || '',
      description: initialData?.description || '',
      website: initialData?.website || '',
    },
  })

  async function onSubmit(values: TheaterFormValues) {
    try {
      setIsLoading(true)
      setError(null)

      const formData = new FormData()
      formData.append('name', values.name)
      if (values.description) formData.append('description', values.description)
      if (values.website) formData.append('website', values.website)

      const result = initialData
        ? await updateTheater(initialData.id, formData)
        : await createTheater(formData)

      if (result?.error) {
        setError(result.error)
        return
      }

      // 成功時はリダイレクト
      router.push('/admin/theaters')
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
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>劇団名</FormLabel>
              <FormControl>
                <Input placeholder="劇団名を入力" {...field} />
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
              <FormLabel>説明（任意）</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="劇団の紹介文や活動内容を入力"
                  rows={5}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="website"
          render={({ field }) => (
            <FormItem>
              <FormLabel>ウェブサイト（任意）</FormLabel>
              <FormControl>
                <Input
                  type="url"
                  placeholder="https://example.com"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {error && <div className="text-sm text-destructive">{error}</div>}
        <div className="flex gap-4">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? '保存中...' : initialData ? '更新' : '作成'}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push('/admin/theaters')}
          >
            キャンセル
          </Button>
        </div>
      </form>
    </Form>
  )
}
