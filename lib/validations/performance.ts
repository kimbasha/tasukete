import * as z from 'zod'

export const performanceSchema = z.object({
  theater_id: z.string().uuid('劇団を選択してください'),
  title: z.string().min(1, '公演タイトルを入力してください'),
  description: z.string().optional(),
  venue: z.string().min(1, '会場を入力してください'),
  area: z.enum(['下北沢', '新宿', '渋谷', '池袋', 'その他'], 'エリアを選択してください'),
  performance_date: z.string().min(1, '公演日を入力してください'),
  start_time: z.string().min(1, '開演時刻を入力してください'),
  door_open_time: z.string().optional(),
  available_tickets: z.number().int().min(0, '残券数は0以上で入力してください').optional(),
  ticket_price: z.number().int().min(0, 'チケット価格は0以上で入力してください'),
  reservation_url: z.string().url('正しいURLを入力してください').optional().or(z.literal('')),
  poster_image_url: z.string().url('正しいURLを入力してください').optional().or(z.literal('')),
  has_day_tickets: z.boolean().optional(),
})

export type PerformanceFormValues = z.infer<typeof performanceSchema>
