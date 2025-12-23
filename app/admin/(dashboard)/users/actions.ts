'use server'

import { createAdminClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { requireSuperAdmin } from '@/lib/auth/admin'

/**
 * 劇団管理者アカウントを作成
 * Supabase Admin APIを使用してauth.usersとtheater_adminsの両方に追加
 */
export async function createTheaterAdmin(formData: FormData) {
  try {
    await requireSuperAdmin()

    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const theaterId = formData.get('theater_id') as string

    if (!email || !password || !theaterId) {
      return { error: '全ての項目を入力してください' }
    }

    const supabase = await createAdminClient()

    // Supabase Admin APIを使ってユーザーを作成
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // メール確認をスキップ
    })

    if (authError || !authData.user) {
      return { error: authError?.message || 'ユーザーの作成に失敗しました' }
    }

    // theater_adminsテーブルに追加
    const { error: dbError } = await supabase
      .from('theater_admins')
      .insert({
        id: authData.user.id,
        email: email,
        theater_id: theaterId,
      })

    if (dbError) {
      // エラーの場合、作成したauthユーザーを削除
      await supabase.auth.admin.deleteUser(authData.user.id)
      return { error: dbError.message }
    }

    revalidatePath('/admin/users')
  } catch (error) {
    return { error: '予期しないエラーが発生しました' }
  }

  redirect('/admin/users')
}

/**
 * 劇団管理者アカウントを削除
 */
export async function deleteTheaterAdmin(id: string) {
  try {
    await requireSuperAdmin()

    const supabase = await createAdminClient()

    // theater_adminsから削除（CASCADEでauth.usersからも削除される）
    const { error: dbError } = await supabase
      .from('theater_admins')
      .delete()
      .eq('id', id)

    if (dbError) {
      return { error: dbError.message }
    }

    // Supabase Authからもユーザーを削除
    const { error: authError } = await supabase.auth.admin.deleteUser(id)

    if (authError) {
      return { error: authError.message }
    }

    revalidatePath('/admin/users')

    return { success: true }
  } catch (error) {
    return { error: '予期しないエラーが発生しました' }
  }
}
