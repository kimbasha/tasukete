'use server'

import { createClient } from '@/lib/supabase/server'
import { performanceSchema } from '@/lib/validations/performance'
import { uploadPosterImage, deletePosterImage } from '@/lib/supabase/storage'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { requireAdmin, canManageTheater } from '@/lib/auth/admin'
import * as z from 'zod'

/**
 * 公演を作成
 * super_admin または 該当劇団のtheater_adminのみ実行可能
 */
export async function createPerformance(formData: FormData) {
  try {
    const adminUser = await requireAdmin()

    const theaterId = formData.get('theater_id') as string

    // 権限チェック
    if (!canManageTheater(adminUser, theaterId)) {
      return { error: 'この劇団の公演を作成する権限がありません' }
    }

    const imageFile = formData.get('poster_image') as File | null
    let posterImageUrl = ''

    // 画像をアップロード
    if (imageFile && imageFile.size > 0) {
      posterImageUrl = await uploadPosterImage(imageFile)
    }

    const validated = performanceSchema.parse({
      theater_id: theaterId,
      title: formData.get('title'),
      description: formData.get('description'),
      start_time: formData.get('start_time'),
      remaining_tickets: Number(formData.get('remaining_tickets')),
      area: formData.get('area'),
      poster_image_url: posterImageUrl,
    })

    const supabase = await createClient()
    const { error } = await supabase.from('performances').insert(validated)

    if (error) {
      // エラーの場合、アップロードした画像を削除
      if (posterImageUrl) {
        await deletePosterImage(posterImageUrl)
      }
      return { error: error.message }
    }

    revalidatePath('/admin/performances')
    revalidatePath('/')
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: 'バリデーションエラー', details: error.issues }
    }
    return { error: '予期しないエラーが発生しました' }
  }

  redirect('/admin/performances')
}

/**
 * 公演を更新
 * super_admin または 該当劇団のtheater_adminのみ実行可能
 */
export async function updatePerformance(id: string, formData: FormData) {
  try {
    const adminUser = await requireAdmin()

    const supabase = await createClient()

    // 既存の公演情報を取得（theater_idも取得）
    const { data: existing } = await supabase
      .from('performances')
      .select('poster_image_url, theater_id')
      .eq('id', id)
      .single()

    if (!existing) {
      return { error: '公演が見つかりません' }
    }

    // 権限チェック
    if (!canManageTheater(adminUser, existing.theater_id)) {
      return { error: 'この公演を編集する権限がありません' }
    }

    const imageFile = formData.get('poster_image') as File | null
    let posterImageUrl = existing?.poster_image_url || ''

    // 新しい画像がアップロードされた場合
    if (imageFile && imageFile.size > 0) {
      // 古い画像を削除
      if (existing?.poster_image_url) {
        await deletePosterImage(existing.poster_image_url)
      }
      // 新しい画像をアップロード
      posterImageUrl = await uploadPosterImage(imageFile)
    }

    const validated = performanceSchema.parse({
      theater_id: formData.get('theater_id'),
      title: formData.get('title'),
      description: formData.get('description'),
      start_time: formData.get('start_time'),
      remaining_tickets: Number(formData.get('remaining_tickets')),
      area: formData.get('area'),
      poster_image_url: posterImageUrl,
    })

    const { error } = await supabase
      .from('performances')
      .update(validated)
      .eq('id', id)

    if (error) {
      return { error: error.message }
    }

    revalidatePath('/admin/performances')
    revalidatePath('/')
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: 'バリデーションエラー', details: error.issues }
    }
    return { error: '予期しないエラーが発生しました' }
  }

  redirect('/admin/performances')
}

/**
 * 公演を削除
 * super_admin または 該当劇団のtheater_adminのみ実行可能
 */
export async function deletePerformance(id: string) {
  try {
    const adminUser = await requireAdmin()

    const supabase = await createClient()

    // 公演情報を取得（theater_idも取得）
    const { data: performance } = await supabase
      .from('performances')
      .select('poster_image_url, theater_id')
      .eq('id', id)
      .single()

    if (!performance) {
      return { error: '公演が見つかりません' }
    }

    // 権限チェック
    if (!canManageTheater(adminUser, performance.theater_id)) {
      return { error: 'この公演を削除する権限がありません' }
    }

    // 公演を削除
    const { error } = await supabase.from('performances').delete().eq('id', id)

    if (error) {
      return { error: error.message }
    }

    // 画像を削除
    if (performance?.poster_image_url) {
      await deletePosterImage(performance.poster_image_url)
    }

    revalidatePath('/admin/performances')
    revalidatePath('/')

    return { success: true }
  } catch (error) {
    return { error: '予期しないエラーが発生しました' }
  }
}
