import { JSX, PropsWithChildren } from 'react'

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
