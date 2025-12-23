-- theater_adminsのSELECTポリシーを修正
-- super_adminは全てのtheater_adminを閲覧可能に
-- theater_adminは自分のレコードのみ閲覧可能

DROP POLICY IF EXISTS "theater_admins_select_policy" ON public.theater_admins;

CREATE POLICY "theater_admins_select_policy" ON public.theater_admins
  FOR SELECT USING (
    -- super_adminは全て閲覧可能
    EXISTS (SELECT 1 FROM public.super_admins WHERE id = auth.uid())
    -- theater_adminは自分のレコードのみ
    OR id = auth.uid()
  );
