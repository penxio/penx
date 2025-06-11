import { z } from 'zod'
import { BillingCycle, PlanType } from '@penx/types'

export const updateCreationInputSchema = z.object({
  id: z.string(),
  title: z.string().optional(),
  image: z.string().optional(),
  content: z.string().optional(),
  podcast: z.any(),
  type: z.any().optional(),
  structId: z.any().optional(),
  cells: z.any(),
  checked: z.boolean().optional(),
  description: z.string().optional(),
  i18n: z.record(z.any()).optional(),
})

export type UpdateCreationInput = z.infer<typeof updateCreationInputSchema>

export const addCreationInputSchema = z.object({
  id: z.string().optional(),
  slug: z.string().optional(),
  siteId: z.string(),
  type: z.string(),
  title: z.string(),
  description: z.string().optional(),
  image: z.string().optional(),
  content: z.string(),
  data: z.any(),
  status: z.any().optional(),
  userId: z.string().optional(),
  structId: z.string().uuid(),
  areaId: z.string(),
  tagIds: z.array(z.string()).optional(),
  isPublishDirectly: z.boolean().optional(),
})

export type AddCreationInput = z.infer<typeof addCreationInputSchema>

export const updateAreaInputSchema = z.object({
  id: z.string(),
  type: z.string().optional(),
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
  logo: z.string().optional(),
  name: z.string().min(1, {
    message: 'Name must be at least 1 characters.',
  }),
  slug: z.string().optional(),
  description: z.string().optional(),
  about: z.string().optional(),
  chargeMode: z.string().optional(),
  // price: z.string().optional(),
})

export type CreateAreaInput = z.infer<typeof createAreaInputSchema>

export const publishStructInputSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1, { message: 'Type name is required' }),
  pluralName: z.string().min(1, { message: 'Type name is required' }),
  type: z.string(),
  locale: z.string(),
  emoji: z.string().optional(),
  color: z.string().optional(),
  about: z.string().optional(),
  columns: z.any(),
})

export type PublishStructInput = z.infer<typeof publishStructInputSchema>

export const syncAppleSubscriptionInputSchema = z.object({
  planType: z.nativeEnum(PlanType),
  billingCycle: z.nativeEnum(BillingCycle),
  customerId: z.string(),
  subscriptionStatus: z.string(),
  currentPeriodEnd: z.string(),
  raw: z.any(),
})

export type SyncAppleSubscriptionInput = z.infer<
  typeof syncAppleSubscriptionInputSchema
>
