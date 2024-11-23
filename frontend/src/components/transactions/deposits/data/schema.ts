import { z } from "zod"

export const transactionSchema = z.object({
  id: z.string(),
  donor: z.object({
    id: z.string(),
    address: z.string()
  }),
  amount: z.string(),
  timestamp: z.string(),
  cumulativeAmount: z.string(),
  transactionHash: z.string()
})

export type Transaction = z.infer<typeof transactionSchema>