import * as z from 'zod'

export const theaterSchema = z.object({
  name: z.string().min(1, '劇団名を入力してください'),
  description: z.string().optional(),
  website: z.string().url('正しいURLを入力してください').optional().or(z.literal('')),
})

export type TheaterFormValues = z.infer<typeof theaterSchema>
