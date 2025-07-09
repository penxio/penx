import { z } from 'zod'

export const ConfigSchema = z.object({
  aiApiKey: z.any().optional(),
  aiApiEndpoint: z.any().optional(),
  languageModel: z.any().optional(),
  embeddingModel: z.any().optional(),
  embeddingDimensions: z.number().optional(),
  embeddingApiEndpoint: z.string().optional(),
  embeddingApiKey: z.string().optional(),
  rerankModel: z.string().optional(),
  rerankTopK: z.number().optional(),
  rerankScore: z.number().optional(),
  rerankUseEembbingEndpoint: z.boolean().optional()
})

export type GlobalConfig = z.infer<typeof ConfigSchema>
