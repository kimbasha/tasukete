-- 劇団専用アカウント機能の追加
-- admin_usersテーブルにtheater_idカラムを追加し、RLSポリシーを更新

-- 1. admin_usersテーブルにtheater_idカラムを追加
ALTER TABLE public.admin_users
ADD COLUMN IF NOT EXISTS theater_id UUID REFERENCES public.theaters(id) ON DELETE CASCADE;

-- 2. theater_adminはtheater_idが必須という制約を追加
ALTER TABLE public.admin_users
ADD CONSTRAINT theater_id_required_for_theater_admin
CHECK (role != 'theater_admin' OR theater_id IS NOT NULL);

-- 3. インデックス追加（パフォーマンス向上）
CREATE INDEX IF NOT EXISTS idx_admin_users_theater_id ON public.admin_users(theater_id);

-- 4. theaters テーブルのRLSポリシーを更新

-- 既存のINSERTポリシーを削除して再作成（super_adminのみ）
DROP POLICY IF EXISTS "theaters_insert_policy" ON public.theaters;
CREATE POLICY "theaters_insert_policy" ON public.theaters
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.admin_users
      WHERE id = auth.uid() AND role = 'super_admin'
    )
  );

-- 既存のUPDATEポリシーを削除して再作成（super_admin または自劇団のtheater_admin）
DROP POLICY IF EXISTS "theaters_update_policy" ON public.theaters;
CREATE POLICY "theaters_update_policy" ON public.theaters
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.admin_users
      WHERE id = auth.uid()
      AND (
        role = 'super_admin'
        OR (role = 'theater_admin' AND theater_id = theaters.id)
      )
    )
  );

-- 既存のDELETEポリシーを削除して再作成（super_adminのみ）
DROP POLICY IF EXISTS "theaters_delete_policy" ON public.theaters;
CREATE POLICY "theaters_delete_policy" ON public.theaters
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.admin_users
      WHERE id = auth.uid() AND role = 'super_admin'
    )
  );

-- 5. performances テーブルのRLSポリシーを更新

-- 既存のINSERTポリシーを削除して再作成
-- INSERTの場合、WITH CHECKは挿入される行（NEW）に対して評価される
-- theater_idは挿入される行のtheater_idを参照
DROP POLICY IF EXISTS "performances_insert_policy" ON public.performances;
CREATE POLICY "performances_insert_policy" ON public.performances
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.admin_users
      WHERE id = auth.uid()
      AND (
        role = 'super_admin'
        OR (role = 'theater_admin' AND theater_id = performances.theater_id)
      )
    )
  );

-- 既存のUPDATEポリシーを削除して再作成
DROP POLICY IF EXISTS "performances_update_policy" ON public.performances;
CREATE POLICY "performances_update_policy" ON public.performances
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.admin_users a
      WHERE a.id = auth.uid()
      AND (
        a.role = 'super_admin'
        OR (a.role = 'theater_admin' AND a.theater_id = performances.theater_id)
      )
    )
  );

-- 既存のDELETEポリシーを削除して再作成
DROP POLICY IF EXISTS "performances_delete_policy" ON public.performances;
CREATE POLICY "performances_delete_policy" ON public.performances
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.admin_users a
      WHERE a.id = auth.uid()
      AND (
        a.role = 'super_admin'
        OR (a.role = 'theater_admin' AND a.theater_id = performances.theater_id)
      )
    )
  );

-- マイグレーション完了
-- 既存のsuper_adminアカウントは引き続き全権限を持つ（theater_id = NULL, role = 'super_admin'）
-- 新しいtheater_adminアカウントは手動で作成する必要がある
