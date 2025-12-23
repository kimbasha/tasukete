'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { createTheaterAdmin } from '@/app/admin/(dashboard)/users/actions'

const userSchema = z.object({
  email: z.string().email('有効なメールアドレスを入力してください'),
  password: z.string().min(6, 'パスワードは6文字以上で入力してください'),
  theater_id: z.string().min(1, '劇団を選択してください'),
})

type UserFormValues = z.infer<typeof userSchema>

interface Theater {
  id: string
  name: string
}

interface UserFormProps {
  theaters: Theater[]
}

export function UserForm({ theaters }: UserFormProps) {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      email: '',
      password: '',
      theater_id: '',
    },
  })

  // パスワード自動生成
  function generatePassword() {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%'
    let password = ''
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    form.setValue('password', password)
  }

  async function onSubmit(values: UserFormValues) {
    try {
      setIsLoading(true)
      setError(null)

      const formData = new FormData()
      formData.append('email', values.email)
      formData.append('password', values.password)
      formData.append('theater_id', values.theater_id)

      const result = await createTheaterAdmin(formData)

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
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>メールアドレス</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="theater@example.com"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                劇団管理者がログインに使用するメールアドレス
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>パスワード</FormLabel>
              <div className="flex gap-2">
                <FormControl>
                  <Input
                    type="text"
                    placeholder="6文字以上"
                    {...field}
                  />
                </FormControl>
                <Button
                  type="button"
                  variant="outline"
                  onClick={generatePassword}
                >
                  自動生成
                </Button>
              </div>
              <FormDescription>
                劇団管理者に共有してください
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

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
              <FormDescription>
                このアカウントが管理する劇団
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {error && <div className="text-sm text-destructive">{error}</div>}

        <div className="flex gap-4">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? '作成中...' : '作成'}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push('/admin/users')}
          >
            キャンセル
          </Button>
        </div>
      </form>
    </Form>
  )
}
