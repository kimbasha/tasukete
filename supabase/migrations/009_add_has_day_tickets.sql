-- 当日券販売フラグを追加
ALTER TABLE public.performances
ADD COLUMN IF NOT EXISTS has_day_tickets BOOLEAN DEFAULT false NOT NULL;

-- コメント追加
COMMENT ON COLUMN public.performances.has_day_tickets IS '当日券販売の有無';
