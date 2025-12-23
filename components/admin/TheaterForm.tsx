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
import { createTheater, updateTheater } from '@/app/admin/theaters/actions'

interface TheaterFormProps {
  initialData?: {
    id: string
    name: string
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
    },
  })

  async function onSubmit(values: TheaterFormValues) {
    try {
      setIsLoading(true)
      setError(null)

      const formData = new FormData()
      formData.append('name', values.name)

      const result = initialData
        ? await updateTheater(initialData.id, formData)
        : await createTheater(formData)

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
