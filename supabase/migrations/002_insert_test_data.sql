-- テストデータ投入

-- 1. 劇団データを挿入
INSERT INTO public.theaters (id, name, description, website) VALUES
  ('11111111-1111-1111-1111-111111111111', '劇団タスケテ', '当日券に特化した新進気鋭の劇団。観客とのコミュニケーションを大切にしています。', 'https://example.com/theater1'),
  ('22222222-2222-2222-2222-222222222222', '夢空間カンパニー', '小劇場演劇を中心に活動する実験的な劇団。即興劇が得意です。', 'https://example.com/theater2'),
  ('33333333-3333-3333-3333-333333333333', 'ステージワークス', '音楽劇を得意とする劇団。ミュージカルからストレートプレイまで幅広く上演。', 'https://example.com/theater3')
ON CONFLICT (id) DO NOTHING;

-- 2. 公演データを挿入（今日の日付で）
INSERT INTO public.performances (
  theater_id,
  title,
  description,
  venue,
  area,
  performance_date,
  start_time,
  poster_image_url,
  available_tickets,
  ticket_price,
  reservation_url,
  status
) VALUES
  (
    '11111111-1111-1111-1111-111111111111',
    'HELP ME!! 〜助けて〜',
    '現代社会で孤立する若者たちの心の叫びを描いた衝撃作。SNSと現実の狭間で揺れ動く登場人物たちの物語。',
    'タスケテ小劇場',
    '渋谷',
    CURRENT_DATE,
    '19:00',
    'https://placehold.co/400x600/4f46e5/ffffff?text=HELP+ME',
    15,
    2500,
    'https://example.com/reserve/1',
    'today'
  ),
  (
    '22222222-2222-2222-2222-222222222222',
    '夢の中へ',
    '夢と現実が交錯する不思議な世界。観客参加型の体験型演劇。一度見たら忘れられない衝撃の展開が待っています。',
    '夢空間シアター',
    '下北沢',
    CURRENT_DATE,
    '18:30',
    'https://placehold.co/400x600/06b6d4/ffffff?text=Dream',
    8,
    3000,
    'https://example.com/reserve/2',
    'today'
  ),
  (
    '33333333-3333-3333-3333-333333333333',
    'ミュージカル「未来へ」',
    '希望と挑戦をテーマにした感動のミュージカル。美しい音楽と圧巻のダンスシーンが魅力。',
    'ステージワークス劇場',
    '新宿',
    CURRENT_DATE,
    '14:00',
    'https://placehold.co/400x600/f59e0b/ffffff?text=Future',
    20,
    3500,
    'https://example.com/reserve/3',
    'today'
  ),
  (
    '11111111-1111-1111-1111-111111111111',
    'HELP ME!! 〜助けて〜（夜公演）',
    '昼公演とは異なる演出で楽しめる夜公演。より深く、よりダークな世界観をお楽しみください。',
    'タスケテ小劇場',
    '渋谷',
    CURRENT_DATE,
    '21:00',
    'https://placehold.co/400x600/4f46e5/ffffff?text=HELP+ME+Night',
    5,
    2800,
    'https://example.com/reserve/4',
    'today'
  ),
  (
    '22222222-2222-2222-2222-222222222222',
    '即興劇ナイト',
    'その場で生まれる奇跡の物語。観客のリクエストをもとに俳優たちが即興で演じます。毎回違う展開が楽しめます。',
    '夢空間シアター',
    '下北沢',
    CURRENT_DATE + INTERVAL '1 day',
    '20:00',
    'https://placehold.co/400x600/06b6d4/ffffff?text=Improv',
    12,
    2000,
    'https://example.com/reserve/5',
    'upcoming'
  );
