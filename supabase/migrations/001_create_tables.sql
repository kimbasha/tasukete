-- タスケテ（HELP ME!!）データベーステーブル作成

-- 1. theaters（劇団）テーブル
CREATE TABLE IF NOT EXISTS public.theaters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  website TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. performances（公演）テーブル
CREATE TABLE IF NOT EXISTS public.performances (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  theater_id UUID NOT NULL REFERENCES public.theaters(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  venue TEXT NOT NULL,
  area TEXT NOT NULL,
  performance_date DATE NOT NULL,
  start_time TIME NOT NULL,
  poster_image_url TEXT,
  available_tickets INTEGER NOT NULL DEFAULT 0,
  ticket_price INTEGER NOT NULL,
  reservation_url TEXT,
  status TEXT NOT NULL DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'today', 'ended')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. admin_users（管理者）テーブル
CREATE TABLE IF NOT EXISTS public.admin_users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  role TEXT NOT NULL DEFAULT 'super_admin',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- インデックス作成
CREATE INDEX IF NOT EXISTS idx_performances_date ON public.performances(performance_date);
CREATE INDEX IF NOT EXISTS idx_performances_area ON public.performances(area);
CREATE INDEX IF NOT EXISTS idx_performances_theater_id ON public.performances(theater_id);
CREATE INDEX IF NOT EXISTS idx_performances_status ON public.performances(status);

-- updated_at自動更新トリガー関数
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- theatersテーブル用トリガー
CREATE TRIGGER update_theaters_updated_at BEFORE UPDATE ON public.theaters
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- performancesテーブル用トリガー
CREATE TRIGGER update_performances_updated_at BEFORE UPDATE ON public.performances
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) 有効化
ALTER TABLE public.theaters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.performances ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- RLSポリシー: 誰でも劇団を読み取り可能
CREATE POLICY "theaters_select_policy" ON public.theaters
  FOR SELECT USING (true);

-- RLSポリシー: 誰でも公演を読み取り可能
CREATE POLICY "performances_select_policy" ON public.performances
  FOR SELECT USING (true);

-- RLSポリシー: 管理者のみadmin_usersテーブルにアクセス可能
CREATE POLICY "admin_users_all_policy" ON public.admin_users
  FOR ALL USING (auth.uid() = id);

-- 書き込みポリシーは後で管理画面実装時に追加
