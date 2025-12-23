-- performance-posters バケットを作成（公開バケット）
INSERT INTO storage.buckets (id, name, public)
VALUES ('performance-posters', 'performance-posters', true)
ON CONFLICT (id) DO NOTHING;

-- SELECT: 誰でもアクセス可能（公開バケット）
CREATE POLICY "performance_posters_select_policy"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'performance-posters');

-- INSERT: 管理者のみ
CREATE POLICY "performance_posters_insert_policy"
ON storage.objects FOR INSERT
TO public
WITH CHECK (
  bucket_id = 'performance-posters' AND
  EXISTS (SELECT 1 FROM public.admin_users WHERE id = auth.uid())
);

-- UPDATE: 管理者のみ
CREATE POLICY "performance_posters_update_policy"
ON storage.objects FOR UPDATE
TO public
USING (
  bucket_id = 'performance-posters' AND
  EXISTS (SELECT 1 FROM public.admin_users WHERE id = auth.uid())
);

-- DELETE: 管理者のみ
CREATE POLICY "performance_posters_delete_policy"
ON storage.objects FOR DELETE
TO public
USING (
  bucket_id = 'performance-posters' AND
  EXISTS (SELECT 1 FROM public.admin_users WHERE id = auth.uid())
);
