import { AreaType, ChargeMode, CreationStatus } from '@prisma/client'
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

export const updateAreaInputSchema = z.object({
  id: z.string(),
  type: z.nativeEnum(AreaType).optional(),
  logo: z.string().min(1, { message: 'Please upload your avatar' }).optional(),
  name: z
    .string()
    .min(1, {
      message: 'Name must be at least 1 characters.',
    })
    .optional(),
  slug: z.string().min(1, { message: 'Slug is required' }).optional(),
  description: z.string().optional(),
  about: z.string().optional(),
  chargeMode: z.any().optional(),
  catalogue: z.any().optional(),
  widgets: z.any().optional(),
  favorites: z.any().optional(),
})

export type UpdateAreaInput = z.infer<typeof updateAreaInputSchema>

export const createAreaInputSchema = z.object({
  id: z.string().uuid(),
  logo: z.string().min(1, { message: 'Please upload your avatar' }),
  name: z.string().min(1, {
    message: 'Name must be at least 1 characters.',
  }),
  slug: z.string().min(1, { message: 'Slug is required' }),
  description: z.string(),
  about: z.string().optional(),
  chargeMode: z.nativeEnum(ChargeMode).optional(),
})

export type CreateAreaInput = z.infer<typeof createAreaInputSchema>
