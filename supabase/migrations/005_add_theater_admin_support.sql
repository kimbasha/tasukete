-- 劇団専用アカウント機能の追加
-- admin_usersを廃止し、super_adminsとtheater_adminsに分離

-- 1. super_admins テーブルを作成（システム管理者）
CREATE TABLE IF NOT EXISTS public.super_admins (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- 2. theater_admins テーブルを作成（劇団管理者）
CREATE TABLE IF NOT EXISTS public.theater_admins (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  theater_id UUID NOT NULL REFERENCES public.theaters(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- 3. インデックス追加（パフォーマンス向上）
CREATE INDEX IF NOT EXISTS idx_theater_admins_theater_id ON public.theater_admins(theater_id);

-- 4. 既存のadmin_usersからデータを移行
-- super_adminロールのユーザーをsuper_adminsに移行
INSERT INTO public.super_admins (id, email, created_at)
SELECT id, email, created_at
FROM public.admin_users
WHERE role = 'super_admin'
ON CONFLICT (id) DO NOTHING;

-- theater_adminはまだ存在しないため、移行は不要
-- 将来的にtheater_adminを作成する場合は、theater_adminsテーブルに直接INSERTする

-- 5. RLSを有効化
ALTER TABLE public.super_admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.theater_admins ENABLE ROW LEVEL SECURITY;

-- 6. super_admins テーブルのRLSポリシー
-- super_adminは自分のレコードを参照可能
CREATE POLICY "super_admins_select_policy" ON public.super_admins
  FOR SELECT USING (id = auth.uid());

-- 7. theater_admins テーブルのRLSポリシー
-- theater_adminは自分のレコードを参照可能
CREATE POLICY "theater_admins_select_policy" ON public.theater_admins
  FOR SELECT USING (id = auth.uid());

-- 8. theaters テーブルのRLSポリシーを更新

-- SELECTポリシー: super_admins または theater_admins（自劇団のみ）
DROP POLICY IF EXISTS "theaters_select_policy" ON public.theaters;
CREATE POLICY "theaters_select_policy" ON public.theaters
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.super_admins WHERE id = auth.uid())
    OR EXISTS (
      SELECT 1 FROM public.theater_admins
      WHERE id = auth.uid() AND theater_id = theaters.id
    )
  );

-- INSERTポリシー: super_adminsのみ
DROP POLICY IF EXISTS "theaters_insert_policy" ON public.theaters;
CREATE POLICY "theaters_insert_policy" ON public.theaters
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.super_admins WHERE id = auth.uid())
  );

-- UPDATEポリシー: super_admins または 自劇団のtheater_admins
DROP POLICY IF EXISTS "theaters_update_policy" ON public.theaters;
CREATE POLICY "theaters_update_policy" ON public.theaters
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.super_admins WHERE id = auth.uid())
    OR EXISTS (
      SELECT 1 FROM public.theater_admins
      WHERE id = auth.uid() AND theater_id = theaters.id
    )
  );

-- DELETEポリシー: super_adminsのみ
DROP POLICY IF EXISTS "theaters_delete_policy" ON public.theaters;
CREATE POLICY "theaters_delete_policy" ON public.theaters
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM public.super_admins WHERE id = auth.uid())
  );

-- 9. performances テーブルのRLSポリシーを更新

-- SELECTポリシー: super_admins または 該当劇団のtheater_admins
DROP POLICY IF EXISTS "performances_select_policy" ON public.performances;
CREATE POLICY "performances_select_policy" ON public.performances
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.super_admins WHERE id = auth.uid())
    OR EXISTS (
      SELECT 1 FROM public.theater_admins
      WHERE id = auth.uid() AND theater_id = performances.theater_id
    )
  );

-- INSERTポリシー: super_admins または 該当劇団のtheater_admins
DROP POLICY IF EXISTS "performances_insert_policy" ON public.performances;
CREATE POLICY "performances_insert_policy" ON public.performances
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.super_admins WHERE id = auth.uid())
    OR EXISTS (
      SELECT 1 FROM public.theater_admins
      WHERE id = auth.uid() AND theater_id = performances.theater_id
    )
  );

-- UPDATEポリシー: super_admins または 該当劇団のtheater_admins
DROP POLICY IF EXISTS "performances_update_policy" ON public.performances;
CREATE POLICY "performances_update_policy" ON public.performances
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.super_admins WHERE id = auth.uid())
    OR EXISTS (
      SELECT 1 FROM public.theater_admins
      WHERE id = auth.uid() AND theater_id = performances.theater_id
    )
  );

-- DELETEポリシー: super_admins または 該当劇団のtheater_admins
DROP POLICY IF EXISTS "performances_delete_policy" ON public.performances;
CREATE POLICY "performances_delete_policy" ON public.performances
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM public.super_admins WHERE id = auth.uid())
    OR EXISTS (
      SELECT 1 FROM public.theater_admins
      WHERE id = auth.uid() AND theater_id = performances.theater_id
    )
  );

-- 10. admin_users テーブルは後方互換性のため残す
-- 将来的に削除する場合は、別のマイグレーションで実施
-- DROP TABLE IF EXISTS public.admin_users;

-- マイグレーション完了
-- 既存のsuper_adminアカウントはsuper_adminsテーブルに移行済み
-- 新しいtheater_adminアカウントは手動でtheater_adminsテーブルに作成する必要がある
