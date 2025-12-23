'use server'

import { createClient } from '@/lib/supabase/server'
import { theaterSchema } from '@/lib/validations/theater'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { requireAdmin } from '@/lib/auth/admin'
import * as z from 'zod'

/**
 * 劇団を作成
 */
export async function createTheater(formData: FormData) {
  try {
    await requireAdmin()

    const validated = theaterSchema.parse({
      name: formData.get('name'),
    })

    const supabase = await createClient()
    const { error } = await supabase.from('theaters').insert(validated)

    if (error) {
      return { error: error.message }
    }

    revalidatePath('/admin/theaters')
    revalidatePath('/')
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: 'バリデーションエラー', details: error.errors }
    }
    return { error: '予期しないエラーが発生しました' }
  }

  redirect('/admin/theaters')
}

/**
 * 劇団を更新
 */
export async function updateTheater(id: string, formData: FormData) {
  try {
    await requireAdmin()

    const validated = theaterSchema.parse({
      name: formData.get('name'),
    })

    const supabase = await createClient()
    const { error } = await supabase
      .from('theaters')
      .update(validated)
      .eq('id', id)

    if (error) {
      return { error: error.message }
    }

    revalidatePath('/admin/theaters')
    revalidatePath('/')
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: 'バリデーションエラー', details: error.errors }
    }
    return { error: '予期しないエラーが発生しました' }
  }

  redirect('/admin/theaters')
}

/**
 * 劇団を削除
 */
export async function deleteTheater(id: string) {
  try {
    await requireAdmin()

    const supabase = await createClient()
    const { error } = await supabase.from('theaters').delete().eq('id', id)

    if (error) {
      return { error: error.message }
    }

    revalidatePath('/admin/theaters')
    revalidatePath('/')

    return { success: true }
  } catch (error) {
    return { error: '予期しないエラーが発生しました' }
  }
}
