-- theaters テーブルの書き込みポリシー
-- INSERT: 管理者のみ
CREATE POLICY "theaters_insert_policy" ON public.theaters
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.admin_users WHERE id = auth.uid())
  );

-- UPDATE: 管理者のみ
CREATE POLICY "theaters_update_policy" ON public.theaters
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.admin_users WHERE id = auth.uid())
  );

-- DELETE: 管理者のみ
CREATE POLICY "theaters_delete_policy" ON public.theaters
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM public.admin_users WHERE id = auth.uid())
  );

-- performances テーブルの書き込みポリシー
-- INSERT: 管理者のみ
CREATE POLICY "performances_insert_policy" ON public.performances
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.admin_users WHERE id = auth.uid())
  );

-- UPDATE: 管理者のみ
CREATE POLICY "performances_update_policy" ON public.performances
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.admin_users WHERE id = auth.uid())
  );

-- DELETE: 管理者のみ
CREATE POLICY "performances_delete_policy" ON public.performances
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM public.admin_users WHERE id = auth.uid())
  );
