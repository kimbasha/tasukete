import * as z from 'zod'

export const performanceSchema = z.object({
  theater_id: z.string().uuid('劇団を選択してください'),
  title: z.string().min(1, '公演タイトルを入力してください'),
  description: z.string().min(1, '公演説明を入力してください'),
  start_time: z.string().min(1, '開演時刻を入力してください'),
  remaining_tickets: z.coerce.number().int().min(0, '残券数は0以上で入力してください'),
  area: z.enum(['東京', '大阪', '名古屋', 'その他'], {
    required_error: 'エリアを選択してください',
  }),
  poster_image_url: z.string().url('正しいURLを入力してください').optional().or(z.literal('')),
})

export type PerformanceFormValues = z.infer<typeof performanceSchema>
