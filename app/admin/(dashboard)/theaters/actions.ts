'use server'

import { createClient } from '@/lib/supabase/server'
import { theaterSchema } from '@/lib/validations/theater'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { requireAdmin, requireSuperAdmin, canManageTheater } from '@/lib/auth/admin'
import * as z from 'zod'

/**
 * 劇団を作成
 * super_adminのみ実行可能
 */
export async function createTheater(formData: FormData) {
  try {
    await requireSuperAdmin()

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
      return { error: 'バリデーションエラー', details: error.issues }
    }
    return { error: '予期しないエラーが発生しました' }
  }

  redirect('/admin/theaters')
}

/**
 * 劇団を更新
 * super_admin または 該当劇団のtheater_adminのみ実行可能
 */
export async function updateTheater(id: string, formData: FormData) {
  try {
    const adminUser = await requireAdmin()

    // 権限チェック
    if (!canManageTheater(adminUser, id)) {
      return { error: 'この劇団を編集する権限がありません' }
    }

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
      return { error: 'バリデーションエラー', details: error.issues }
    }
    return { error: '予期しないエラーが発生しました' }
  }

  redirect('/admin/theaters')
}

/**
 * 劇団を削除
 * super_adminのみ実行可能
 */
export async function deleteTheater(id: string) {
  try {
    await requireSuperAdmin()

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
