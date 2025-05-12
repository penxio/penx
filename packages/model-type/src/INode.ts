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
  baseURL?: string
  [key: string]: any
}
export type Widget = {
  id: string
  type: string
  collapsed?: boolean
  moldId?: string
  creationType?: string

  [key: string]: any
}

export enum NodeType {
  SITE = 'SITE',
  AREA = 'AREA',
  MOLD = 'MOLD',
  TAG = 'TAG',
  CREATION_TAG = 'CREATION_TAG',
  INBOX = 'INBOX',
  TRASH = 'TRASH',
  FAVORITE = 'FAVORITE',
  DAILY = 'DAILY',
  CREATION = 'CREATION',
}

export interface INode {
  id: string

  type: NodeType

  props: {
    [key: string]: any
  }

  createdAt: Date
  updatedAt: Date

  areaId?: string
  userId: string
  siteId: string
}

export interface ISiteNode extends INode {
  type: NodeType.SITE
  props: {
    name: string
    description: string
    about: string
    logo: string
    font: string
    image: string
    podcastCover: string
    email: string
    stripeType?: string
    sassSubscriptionId?: string
    sassSubscriptionStatus?: string
    sassBillingCycle?: string
    sassPlanType?: string
    sassCustomerId?: string
    sassProductId?: string
    sassCurrentPeriodEnd?: Date
    sassBelieverPeriodEnd?: Date
    stripeOAuthToken?: any
    socials: any
    analytics: any
    config: any
    navLinks: any
    newsletterConfig: any
    notificationConfig: any
    aiProviders: AIProvider[]
    repo: string
    installationId: number
    balance: any
    themeName: string
    themeConfig: any
    memberCount: number
    isRemote: boolean
    creationCount: number
  }
}

export interface IAreaNode extends INode {
  type: NodeType.AREA
  props: {
    slug: string
    name: string
    description: string
    about: string
    logo?: string
    cover?: string
    widgets: Widget[]
    chargeMode: string
    // type: string
    favorites: string[]
    isGenesis: boolean
    deletedAt?: Date
    productId?: string
  }
}

export function isAreaNode(n: any): n is IAreaNode {
  return n.type === NodeType.AREA
}

export interface IMoldNode extends INode {
  type: NodeType.MOLD
  props: {
    name: string
    pluralName: string
    description: string
    type: string
    props: any[]
    content: string
  }
}

export function isMoldNode(n: any): n is IMoldNode {
  return n.type === NodeType.MOLD
}

export interface ITagNode extends INode {
  type: NodeType.TAG
  props: {
    name: string
    color: string
    creationCount: number
    hidden: boolean
  }
}

export function isTagNode(n: any): n is ITagNode {
  return n.type === NodeType.TAG
}

export interface ICreationTagNode extends INode {
  type: NodeType.CREATION_TAG
  props: {
    creationId: string
    tagId: string
  }
}

export function isCreationTagNode(n: any): n is ICreationTagNode {
  return n.type === NodeType.CREATION_TAG
}

export interface ICreationNode extends INode {
  type: NodeType.CREATION
  props: {
    slug: string
    title: string
    description: string
    icon: string
    image: string
    content: string
    podcast: any
    i18n: any
    props: any
    cid: string
    type: string
    gateType: string
    status: string
    commentStatus: string
    commentCount: number
    featured: boolean
    collectible: boolean
    delivered: boolean
    checked: boolean
    isPopular: boolean
    isJournal: boolean
    date?: string
    publishedAt?: Date
    archivedAt?: Date
    openedAt: Date
    areaId: string
    moldId: string
  }
}

export function isCreationNode(n: any): n is ICreationNode {
  return n.type === NodeType.CREATION
}

export interface IColumnNode extends INode {}
export interface IRowNode extends INode {}
export interface IViewNode extends INode {}

export interface IFilterNode extends INode {}

export interface IOptionNode extends INode {}
