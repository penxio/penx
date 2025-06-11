import { JSX, PropsWithChildren } from 'react'
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
  STANDARD = 'STANDARD',
  PRO = 'PRO',
  TEAM = 'TEAM',
  BELIEVER = 'BELIEVER',
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

export enum StructType {
  NOTE = 'NOTE',
  TASK = 'TASK',
  PAGE = 'PAGE',
  ARTICLE = 'ARTICLE',
  IMAGE = 'IMAGE',
  VIDEO = 'VIDEO',
  AUDIO = 'AUDIO',
  VOICE = 'VOICE',
  BOOKMARK = 'BOOKMARK',
  FRIEND = 'FRIEND',
  PROJECT = 'PROJECT',
}

export enum GateType {
  FREE = 'FREE',
  PAID = 'PAID',
}

export enum CreationStatus {
  PUBLISHED = 'PUBLISHED',
  DRAFT = 'DRAFT',
  ARCHIVED = 'ARCHIVED',
}

export interface Socials {
  farcaster: string
  x: string
  mastodon: string
  github: string
  facebook: string
  youtube: string
  linkedin: string
  threads: string
  instagram: string
  medium: string
  [key: string]: string
}
export interface Analytics {
  gaMeasurementId: string
  umamiHost: string
  umamiWebsiteId: string
}

export enum NavLinkType {
  PAGE = 'PAGE',
  BUILTIN = 'BUILTIN',
  TAG = 'TAG',
  CUSTOM = 'CUSTOM',
}

export enum NavLinkLocation {
  HEADER = 'HEADER',
  FOOTER = 'FOOTER',
}

export type NavLink = {
  title: string
  pathname: string
  type: NavLinkType
  location: NavLinkLocation
  visible: boolean
}

export type Project = {
  id: string
  name: string
  introduction: string
  avatar: string
  url: string
  icon: string
  cover: string
  [key: string]: string
}

export type Friend = {
  id: string
  name: string
  introduction: string
  avatar: string
  url: string
  status: string
  [key: string]: string
}

export enum DesignMode {
  CLASSIC = 'CLASSIC',
  GRID = 'GRID',
}

export type Site = {
  id: string
  name: string
  description: string
  about: any
  logo: string | null
  font: string
  image: string | null
  socials: Socials
  analytics: Analytics
  catalogue: any
  config: {
    seo?: {
      title?: string
      description?: string
    }
    locales: string[]
    appearance: AppearanceConfig
    features: Record<string, any>
  }
  themeName: string
  themeConfig: Record<string, any>
  theme: {
    layout: LayoutItem[]
    common: {
      designMode: DesignMode
      creationListStyle: any
      bgColor: string
      containerWidth: number
      rowHeight: number
      margin: number
    }
    home: {
      showAbout: boolean
      showLatestCreations: boolean
      showProjects: boolean
      showFeatured: boolean
      showTags: boolean
    }
  }
  navLinks: NavLink[]
  subdomain: string | null
  customDomain: string | null
  memberCount: number
  creationCount: number
  message404: string | null
  seoTitle: string
  seoDescription: string
  products: any[]
  areas: any[]
  structs: any[]
  createdAt: Date
  updatedAt: Date
}

export type Creation = {
  id: string
  title: string
  description: string
  content: any
  slug: string
  cid: string
  i18n: any
  nodeId: string
  creationId: number
  type: StructType
  gateType: GateType
  readingTime: {
    text: string
    minutes: number
    time: number
    words: number
  }
  status: CreationStatus
  featured: boolean
  checked: boolean
  collectible: boolean
  isPopular: boolean
  props: Record<string, string>
  image: string | null
  podcast: {
    media: string
    duration: number
    [key: string]: any
  }
  commentCount: number
  publishedAt: Date
  archivedAt: Date
  createdAt: Date
  updatedAt: Date
  userId: string
  siteId: string
  creationTags: CreationTag[]
  struct: any
  authors: any[]
}

export type User = {
  id: string
  name: string
  displayName: string
  ensName: string
  email: string
  image: string | null
  cover: string
  bio: string
  about: string
  accounts: Array<{
    id: string
    providerType: string
    providerAccountId: string
    providerInfo: any
    refreshToken: string
    accessToken: string
  }>
}

export type CreationTag = {
  id: string
  tagId: string
  tag: Tag
}

export type Tag = {
  id: string
  name: string
  color: string
  creationCount: string
}

export interface HomeLayoutProps {
  path: string
}

interface PostLayoutProps {}

interface HomeProps {
  creations: Creation[]
}

interface AboutProps {}

interface PostProps {
  isGated: boolean
  creation: Creation
}

export type Theme = {
  HomeLayout?: ({ children }: PropsWithChildren<HomeLayoutProps>) => JSX.Element
  PostLayout?: ({ children }: PropsWithChildren<PostLayoutProps>) => JSX.Element
  Home?: ({ creations }: HomeProps) => JSX.Element
  Post?: ({ creation, isGated }: PostProps) => JSX.Element
  About?: ({}: AboutProps) => JSX.Element
}

export interface AppearanceConfig {
  color: string
  baseFont: string
  locale: string
}

export enum PostListStyle {
  SIMPLE = 'SIMPLE',
  CARD = 'CARD',
}

export type LayoutItem = {
  i: string
  x: number[]
  y: number[]
  w: number[]
  h: number[]
  type: string
  cardStyle?: string
  props?: Record<string, any>
}

type Option = {
  id?: string
  name: string
  color: string
}

export interface Features {
  journal: boolean
  gallery: boolean
  page: boolean
  database: boolean
}
