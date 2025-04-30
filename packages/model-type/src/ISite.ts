export enum AIProviderType {
  PERPLEXITY = 'PERPLEXITY',
  DEEPSEEK = 'DEEPSEEK',
  OPENAI = 'OPENAI',
  ANTHROPIC = 'ANTHROPIC',
  GOOGLE_AI = 'GOOGLE_AI',
  XAI = 'XAI',
}

export type AIProvider = {
  type: AIProviderType
  enabled: boolean
  apiKey?: string
  [key: string]: any
}

export interface ISite {
  id: string
  name: string
  description: string
  about: string
  spaceId: string
  logo: string
  font: string
  image: string
  podcastCover: string
  email: string
  stripeType: string
  sassSubscriptionId: string
  sassSubscriptionStatus: string
  sassBillingCycle: string
  sassPlanType: string
  sassCustomerId: string
  sassProductId: string
  sassCurrentPeriodEnd: Date
  sassBelieverPeriodEnd: Date
  stripeOAuthToken: any
  authSecret: string
  socials: any
  analytics: any
  config: any
  navLinks: any
  catalogue: any
  newsletterConfig: any
  notificationConfig: any
  aiProviders: AIProvider[]
  repo: string
  installationId: number
  balance: any
  themeName: string
  themeConfig: any
  memberCount: number
  creationCount: number
  createdAt: Date
  updatedAt: Date
  userId: string
}
