import { Address } from 'viem'

export enum TierInterval {
  MONTHLY = 'MONTHLY',
  YEARLY = 'YEARLY',
}

export enum BillingCycle {
  MONTHLY = 'MONTHLY',
  YEARLY = 'YEARLY',
}

export enum SubdomainType {
  Custom = 'Custom',
  EnsName = 'EnsName',
  Address = 'Address',
  UserId = 'UserId',
}

export enum PlanType {
  FREE = 'FREE',
  PRO = 'PRO',
  BASIC = 'BASIC',
}

export type App = {
  id: string
  creator: string
  uri: string
  feeReceiver: string
  feePercent: string
  timestamp: string
}

export type Plan = {
  uri: string
  price: bigint
  isActive: boolean
}

export type Contributor = {
  account: Address
  shares: bigint
  rewards: bigint
  checkpoint: bigint
}

export type GoogleInfo = {
  access_token: string
  scope: string
  token_type: string
  expiry_date: number
  refresh_token: string

  id: string
  email: string
  picture: string
}

export type SubscriptionRaw = {
  planId: number
  account: string
  startTime: bigint
  duration: bigint
  amount: bigint
  uri: string
}

export type DomainVerificationStatusProps =
  | 'Valid configuration'
  | 'Invalid Configuration'
  | 'Pending Verification'
  | 'Domain Not Found'
  | 'Unknown Error'

// From https://vercel.com/docs/rest-api/endpoints#get-a-project-domain
export interface DomainResponse {
  name: string
  apexName: string
  projectId: string
  redirect?: string | null
  redirectStatusCode?: (307 | 301 | 302 | 308) | null
  gitBranch?: string | null
  updatedAt?: number
  createdAt?: number
  /** `true` if the domain is verified for use with the project. If `false` it will not be used as an alias on this project until the challenge in `verification` is completed. */
  verified: boolean
  /** A list of verification challenges, one of which must be completed to verify the domain for use on the project. After the challenge is complete `POST /projects/:idOrName/domains/:domain/verify` to verify the domain. Possible challenges: - If `verification.type = TXT` the `verification.domain` will be checked for a TXT record matching `verification.value`. */
  verification: {
    type: string
    domain: string
    value: string
    reason: string
  }[]
}

// From https://vercel.com/docs/rest-api/endpoints#get-a-domain-s-configuration
export interface DomainConfigResponse {
  /** How we see the domain's configuration. - `CNAME`: Domain has a CNAME pointing to Vercel. - `A`: Domain's A record is resolving to Vercel. - `http`: Domain is resolving to Vercel but may be behind a Proxy. - `null`: Domain is not resolving to Vercel. */
  configuredBy?: ('CNAME' | 'A' | 'http') | null
  /** Which challenge types the domain can use for issuing certs. */
  acceptedChallenges?: ('dns-01' | 'http-01')[]
  /** Whether or not the domain is configured AND we can automatically generate a TLS certificate. */
  misconfigured: boolean
}

// From https://vercel.com/docs/rest-api/endpoints#verify-project-domain
export interface DomainVerificationResponse {
  name: string
  apexName: string
  projectId: string
  redirect?: string | null
  redirectStatusCode?: (307 | 301 | 302 | 308) | null
  gitBranch?: string | null
  updatedAt?: number
  createdAt?: number
  /** `true` if the domain is verified for use with the project. If `false` it will not be used as an alias on this project until the challenge in `verification` is completed. */
  verified: boolean
  /** A list of verification challenges, one of which must be completed to verify the domain for use on the project. After the challenge is complete `POST /projects/:idOrName/domains/:domain/verify` to verify the domain. Possible challenges: - If `verification.type = TXT` the `verification.domain` will be checked for a TXT record matching `verification.value`. */
  verification?: {
    type: string
    domain: string
    value: string
    reason: string
  }[]
}

export type Period = '1m' | '5m' | '15m' | '1h' | '4h' | '1d'

export type Candle = {
  timestamp: number
  open: number
  close: number
  low: number
  high: number
}

export enum DeployStatus {
  DEPLOYING = 'DEPLOYING',
  SUCCESS = 'SUCCESS',
  DOMAIN_PENDING = 'DOMAIN_PENDING',
  FAIL = 'FAIL',
}

export type CreationInList = {
  id: string
  slug: string
  title: string
  content?: string
  description: string
  icon: string
  image: string | null
  props: any
  type: string
  status: any
  featured: boolean
  checked: boolean
  publishedAt: Date | null
  openedAt: Date
  createdAt: Date
  updatedAt: Date
  areaId: string | null
  structId: string | null
}

export type GithubInfo = {
  installationId: number
  repo: string
  token: string
  refreshToken: string
  tokenExpiresAt: string
  refreshTokenExpiresAt: string
}

export type Balance = {
  withdrawable: number
  withdrawing: number
  locked: number
}

export type StripeInfo = {
  productId: string
  priceId: string
  isRecurring: boolean
  interval?: TierInterval
  currency?: string
}

export type Widget = {
  id: string
  type: string
  collapsed?: boolean
  structId?: string

  [key: string]: any
}

export enum PanelType {
  JOURNAL = 'JOURNAL',
  STRUCT = 'STRUCT',
  ALL_STRUCTS = 'ALL_STRUCTS',
  WIDGET = 'WIDGET',
  CREATION = 'CREATION',
  MANAGE_TAGS = 'MANAGE_TAGS',
  LOCAL_BACKUP = 'LOCAL_BACKUP',
  AI_PROVIDERS = 'AI_PROVIDERS',
  AI_SETTING = 'AI_SETTING',
}

export type Panel = {
  id: string
  type: PanelType
  isLoading?: boolean
  size?: number
  creationId?: string
  structId?: string
  widget?: Widget
  date?: string
  // [key: string]: any
}

export interface ImportResult {
  success: number
  failed: Array<{
    email: string
    reason: string
  }>
  total: number
}
