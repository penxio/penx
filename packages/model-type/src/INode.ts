import { AISetting } from './IAISetting'
import { IColumn } from './IColumn'
import { IView } from './IView'

export type Widget = {
  id: string
  type: string
  collapsed?: boolean
  structId?: string

  [key: string]: any
}

export enum NodeType {
  SITE = 'SITE',
  AREA = 'AREA',
  STRUCT = 'STRUCT',
  TAG = 'TAG',
  CREATION_TAG = 'CREATION_TAG',
  INBOX = 'INBOX',
  TRASH = 'TRASH',
  FAVORITE = 'FAVORITE',
  JOURNAL = 'JOURNAL',
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
    aiSetting: AISetting
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

export interface IStructNode extends INode {
  type: NodeType.STRUCT
  areaId: string
  props: {
    name: string
    pluralName: string
    description: string
    type: string
    color: string
    about: string
    activeViewId: string
    viewIds: string[]
    columns: IColumn[]
    views: IView[]
  }
}

export function isStructNode(n: any): n is IStructNode {
  return n.type === NodeType.STRUCT
}

export interface IJournalNode extends INode {
  type: NodeType.JOURNAL
  areaId: string
  props: {
    date: string
    children: string[]
  }
}

export function isDailyNode(n: any): n is IJournalNode {
  return n.type === NodeType.JOURNAL
}

export interface ITagNode extends INode {
  type: NodeType.TAG
  areaId: string
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
  areaId: string
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
  areaId: string
  props: {
    slug: string
    title: string
    description: string
    icon: string
    image: string
    content: string
    podcast: any
    i18n: any
    cells: Record<string, any>
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
    structId: string
  }
}

export function isCreationNode(n: any): n is ICreationNode {
  return n.type === NodeType.CREATION
}
