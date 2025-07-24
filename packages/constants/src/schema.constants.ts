import { z } from 'zod'
import { BillingCycle, PlanType } from '@penx/types'

export const updateSiteInputSchema = z.object({
  id: z.string(),
  logo: z.string().optional(),
  name: z.string().optional(),
  description: z.string().optional(),
  about: z.string().optional(),
  themeName: z.string().optional(),
  themeConfig: z.record(z.any()).optional(),
  config: z.record(z.any()).optional(),
  syncServer: z.record(z.any()).optional(),
  navLinks: z
    .array(
      z.object({
        title: z.string().optional(),
        pathname: z.string().optional(),
        type: z.string().optional(),
        location: z.string().optional(),
        visible: z.boolean().optional(),
      }),
    )
    .optional(),
  socials: z
    .object({
      farcaster: z.string().optional(),
      x: z.string().optional(),
      mastodon: z.string().optional(),
      github: z.string().optional(),
      facebook: z.string().optional(),
      youtube: z.string().optional(),
      linkedin: z.string().optional(),
      threads: z.string().optional(),
      instagram: z.string().optional(),
      discord: z.string().optional(),
      medium: z.string().optional(),
      slack: z.string().optional(),
      telegram: z.string().optional(),
      bilibili: z.string().optional(),
      email: z.string().optional(),
    })
    .optional(),
  analytics: z
    .object({
      gaMeasurementId: z.string().optional(),
      umamiHost: z.string().optional(),
      umamiWebspaceId: z.string().optional(),
    })
    .optional(),
  // catalogue: z.record(z.unknown()).optional(),
  catalogue: z.string().optional(),
})

export type UpdateSiteInput = z.infer<typeof updateSiteInputSchema>

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
  spaceId: z.string(),
  type: z.string(),
  title: z.string(),
  description: z.string().optional(),
  image: z.string().optional(),
  content: z.any(),
  data: z.any(),
  date: z.string().optional(),
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

export const createAssetInputSchema = z.object({
  spaceId: z.string(),
  url: z.string(),
  filename: z.string(),
  contentType: z.string(),
  size: z.number(),
  isPublic: z.boolean(),
})

export type CreateAssetInput = z.infer<typeof createAssetInputSchema>

export const updatePasswordInputSchema = z.object({
  password: z.string().min(6),
  confirmPassword: z.string().min(6),
})

export type UpdatePasswordInput = z.infer<typeof updatePasswordInputSchema>

export const updateProfileInputSchema = z.object({
  image: z.string(),
  name: z.string().optional(),
  displayName: z.string().optional(),
  bio: z.string().optional(),
})

export type UpdateProfileInput = z.infer<typeof updateProfileInputSchema>

export const checkoutInputSchema = z.object({
  planType: z.nativeEnum(PlanType),
  billingCycle: z.nativeEnum(BillingCycle),
  host: z.string(),
  pathname: z.string(),
})

export type CheckoutInput = z.infer<typeof checkoutInputSchema>

export const updatePublicKeyInputSchema = z.object({
  publicKey: z.string(),
  address: z.string(),
  mnemonic: z.string(),
})

export type UpdatePublicKeyInput = z.infer<typeof updatePublicKeyInputSchema>
