import * as z from 'zod'

export const theaterSchema = z.object({
  name: z.string().min(1, '劇団名を入力してください'),
})

export type TheaterFormValues = z.infer<typeof theaterSchema>
