import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

/**
 * 管理者の権限ロール
 */
export type AdminRole = 'super_admin' | 'theater_admin'

/**
 * 管理者ユーザー情報
 */
export interface AdminUser {
  id: string
  email: string
  role: AdminRole
  theater_id: string | null
  created_at: string
}

/**
 * 現在ログインしている管理者ユーザーを取得
 */
export async function getAdminUser(): Promise<AdminUser | null> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return null
  }

  // super_adminsテーブルをチェック
  const { data: superAdmin } = await supabase
    .from('super_admins')
    .select('*')
    .eq('id', user.id)
    .single()

  if (superAdmin) {
    return {
      id: superAdmin.id,
      email: superAdmin.email,
      role: 'super_admin',
      theater_id: null,
      created_at: superAdmin.created_at,
    }
  }

  // theater_adminsテーブルをチェック
  const { data: theaterAdmin } = await supabase
    .from('theater_admins')
    .select('*')
    .eq('id', user.id)
    .single()

  if (theaterAdmin) {
    return {
      id: theaterAdmin.id,
      email: theaterAdmin.email,
      role: 'theater_admin',
      theater_id: theaterAdmin.theater_id,
      created_at: theaterAdmin.created_at,
    }
  }

  return null
}

/**
 * 管理者でない場合はログインページにリダイレクト
 */
export async function requireAdmin(): Promise<AdminUser> {
  const adminUser = await getAdminUser()

  if (!adminUser) {
    redirect('/admin/login')
  }

  return adminUser
}

/**
 * super_admin でない場合はダッシュボードにリダイレクト
 */
export async function requireSuperAdmin(): Promise<AdminUser> {
  const adminUser = await requireAdmin()

  if (adminUser.role !== 'super_admin') {
    redirect('/admin')
  }

  return adminUser
}

/**
 * 現在のユーザーが管理者かチェック
 */
export async function isAdmin(): Promise<boolean> {
  const adminUser = await getAdminUser()
  return adminUser !== null
}

/**
 * super_admin かどうかをチェック
 */
export function isSuperAdmin(adminUser: AdminUser): boolean {
  return adminUser.role === 'super_admin'
}

/**
 * theater_admin かどうかをチェック
 */
export function isTheaterAdmin(adminUser: AdminUser): boolean {
  return adminUser.role === 'theater_admin'
}

/**
 * 指定した劇団を管理する権限があるかチェック
 */
export function canManageTheater(adminUser: AdminUser, theaterId: string): boolean {
  return isSuperAdmin(adminUser) || adminUser.theater_id === theaterId
}
