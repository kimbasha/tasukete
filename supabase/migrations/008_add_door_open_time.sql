-- 開場時刻フィールドを追加
ALTER TABLE public.performances
ADD COLUMN IF NOT EXISTS door_open_time TIME;

-- コメント追加
COMMENT ON COLUMN public.performances.door_open_time IS '開場時刻（任意）';
