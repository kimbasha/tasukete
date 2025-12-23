-- theater_adminsテーブルのINSERT/UPDATE/DELETEポリシーを追加
-- super_adminのみがtheater_adminsレコードを作成・更新・削除できる

-- INSERTポリシー: super_adminsのみ
CREATE POLICY "theater_admins_insert_policy" ON public.theater_admins
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.super_admins WHERE id = auth.uid())
  );

-- UPDATEポリシー: super_adminsのみ
CREATE POLICY "theater_admins_update_policy" ON public.theater_admins
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.super_admins WHERE id = auth.uid())
  );

-- DELETEポリシー: super_adminsのみ
CREATE POLICY "theater_admins_delete_policy" ON public.theater_admins
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM public.super_admins WHERE id = auth.uid())
  );
