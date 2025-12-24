-- テーブル名をtheatersからtroupesに変更
-- 劇団の正確な英訳は "theater company" または "troupe"
-- theatersは劇場（建物）を意味するため不適切

-- 0. admin_usersにtheater_idカラムが存在しない場合は追加
-- （マイグレーション005で別のテーブル構造が作成されているため）
ALTER TABLE public.admin_users
ADD COLUMN IF NOT EXISTS theater_id UUID REFERENCES public.theaters(id) ON DELETE CASCADE;

CREATE INDEX IF NOT EXISTS idx_admin_users_theater_id ON public.admin_users(theater_id);

-- 1. RLSポリシーを削除（テーブル名変更後に再作成）
DROP POLICY IF EXISTS "theaters_select_policy" ON public.theaters;
DROP POLICY IF EXISTS "theaters_insert_policy" ON public.theaters;
DROP POLICY IF EXISTS "theaters_update_policy" ON public.theaters;
DROP POLICY IF EXISTS "theaters_delete_policy" ON public.theaters;

-- 2. トリガーを削除
DROP TRIGGER IF EXISTS update_theaters_updated_at ON public.theaters;

-- 3. テーブル名を変更
ALTER TABLE public.theaters RENAME TO troupes;

-- 4. シーケンスやインデックスは自動的にリネームされる

-- 5. トリガーを再作成
CREATE TRIGGER update_troupes_updated_at BEFORE UPDATE ON public.troupes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 6. RLSポリシーを再作成
CREATE POLICY "troupes_select_policy" ON public.troupes
  FOR SELECT USING (true);

CREATE POLICY "troupes_insert_policy" ON public.troupes
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.admin_users
      WHERE id = auth.uid() AND role = 'super_admin'
    )
  );

CREATE POLICY "troupes_update_policy" ON public.troupes
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.admin_users
      WHERE id = auth.uid()
      AND (
        role = 'super_admin'
        OR (role = 'theater_admin' AND admin_users.theater_id = troupes.id)
      )
    )
  );

CREATE POLICY "troupes_delete_policy" ON public.troupes
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.admin_users
      WHERE id = auth.uid() AND role = 'super_admin'
    )
  );

-- 7. 外部キー制約名を変更（performances.theater_id）
ALTER TABLE public.performances
  RENAME CONSTRAINT performances_theater_id_fkey TO performances_troupe_id_fkey;

-- 8. インデックス名を変更
ALTER INDEX IF EXISTS idx_performances_theater_id RENAME TO idx_performances_troupe_id;

-- 9. admin_usersのtheater_id制約を更新
ALTER TABLE public.admin_users
  DROP CONSTRAINT IF EXISTS theater_id_required_for_theater_admin;

ALTER TABLE public.admin_users
  ADD CONSTRAINT theater_id_required_for_theater_admin
  CHECK (role != 'theater_admin' OR theater_id IS NOT NULL);
