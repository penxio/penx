import { CreationStatus } from '@penx/db/client'
import { z } from 'zod'

export const updateCreationInputSchema = z.object({
  id: z.string(),
  title: z.string().optional(),
  image: z.string().optional(),
  content: z.string().optional(),
  podcast: z.any(),
  type: z.any().optional(),
  moldId: z.any().optional(),
  props: z.any(),
  checked: z.boolean().optional(),
  description: z.string().optional(),
  i18n: z.record(z.any()).optional(),
})

export type UpdateCreationInput = z.infer<typeof updateCreationInputSchema>

export const createCreationInputSchema = z.object({
  id: z.string().optional(),
  slug: z.string().optional(),
  siteId: z.string(),
  type: z.string(),
  title: z.string(),
  description: z.string().optional(),
  image: z.string().optional(),
  content: z.string(),
  status: z.nativeEnum(CreationStatus).optional(),
  userId: z.string().optional(),
  moldId: z.string().uuid(),
  areaId: z.string(),
  tagIds: z.array(z.string()).optional(),
  props: z.record(z.string(), z.any()).optional(),
  isPublishDirectly: z.boolean().optional(),
})

export type CreateCreationInput = z.infer<typeof createCreationInputSchema>
