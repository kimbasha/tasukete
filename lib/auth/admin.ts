import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

/**
 * 現在ログインしている管理者ユーザーを取得
 */
export async function getAdminUser() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return null
  }

  // admin_usersテーブルで管理者かチェック
  const { data: adminUser } = await supabase
    .from('admin_users')
    .select('*')
    .eq('id', user.id)
    .single()

  if (!adminUser) {
    return null
  }

  return {
    ...user,
    role: adminUser.role,
  }
}

/**
 * 管理者でない場合はログインページにリダイレクト
 */
export async function requireAdmin() {
  const adminUser = await getAdminUser()

  if (!adminUser) {
    redirect('/admin/login')
  }

  return adminUser
}

/**
 * 現在のユーザーが管理者かチェック
 */
export async function isAdmin() {
  const adminUser = await getAdminUser()
  return adminUser !== null
}
