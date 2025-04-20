import {
  Account,
  Area,
  Author,
  Channel,
  Creation,
  CreationTag,
  Domain,
  Mold,
  ProviderType,
  Site,
  Subscription,
  Tag,
  User,
} from '@prisma/client'
import { Address } from 'viem'
import { TierInterval } from '../constants'

export type App = {
  id: string
  creator: string
  uri: string
  feeReceiver: string
  feePercent: string
  timestamp: string
}

export type SpaceType = SpaceOnChain & SpaceOnEvent & SpaceInfo

export type SpaceOnChain = {
  address: Address
  x: string
  y: string
  k: string
  uri: string
  name: string
  stakingRevenuePercent: string
  symbol: string
  totalSupply: string
}

export type SpaceOnEvent = {
  id: string
  spaceId: string
  address: Address
  founder: Address
  symbol: string
  name: string
  preBuyEthAmount: string
  ethVolume: string
  tokenVolume: string
  tradeCreatorFee: string
  uri: string
  memberCount: number
  members: Array<{
    id: string
    account: Address
  }>
}

export type SpaceInfo = {
  name: string
  description: string
  about: string
  logo: string
  subdomain: string
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

export type Trade = {
  id: string
  account: string
  type: 'SELL' | 'BUY'
  tokenAmount: string
  ethAmount: string
  creatorFee: string
  protocolFee: string
  timestamp: number
  space: {
    id: string
    address: string
  }
}

export type Holder = {
  id: string
  account: string
  balance: bigint
  space: {
    id: string
    address: string
  }
}

export type SubscriptionRecord = {
  id: string
  planId: number
  type: 'SUBSCRIBE' | 'UNSUBSCRIBE'
  account: Address
  duration: bigint
  amount: bigint
  timestamp: bigint
  space: {
    id: string
    address: string
  }
}

export type MintRecord = {
  id: string
  creationId: string
  minter: Address
  curator: Address
  amount: string
  price: string
}

export type TipRecord = {
  id: string
  tipper: Address
  receiver: Address
  amount: string
  uri: string
  tipperRewardPercent: string
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

export type Socials = {
  farcaster: string
  x: string
  mastodon: string
  github: string
  facebook: string
  youtube: string
  linkedin: string
  threads: string
  instagram: string
  discord: string
  medium: string
  slack: string
  telegram: string
  bilibili: string
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

export type SiteInSession = Site & {
  domains: Domain[]
  areas: Area[]
}

export type AccountWithUser = Account & {
  user: User & {
    sites: SiteInSession[]
  }
}

export type AuthorWithUser = Author & {
  user: User
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

export type MySite = Site & {
  channels: Channel[]
  domains: Domain[]
  areas: Area[]
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
  moldId: string | null
}

export type SiteCreation = CreationInList & {
  creationTags: Array<CreationTag & { tag: Tag }>
  mold: Mold | null
  user: {
    displayName: string | null
    image: string | null
  }
}

export type CreationById = Creation & {
  mold: Mold | null
  creationTags: Array<CreationTag & { tag: Tag }>
  authors: Array<
    Author & {
      user: {
        name: string | null
        image: string | null
        displayName: string | null
        ensName: string | null
      }
    }
  >
}

export type AreaById = Area & {
  creations: Creation[]
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
  moldId?: string

  [key: string]: any
}

export enum PanelType {
  HOME = 'HOME',
  CREATION = 'CREATION',
  WIDGET = 'WIDGET',
}

export type Panel = {
  id: string
  type: PanelType
  isLoading?: boolean
  size?: number
  creation?: SiteCreation
  widget?: Widget
  [key: string]: any
}
