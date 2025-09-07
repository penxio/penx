import { AISetting } from '@penx/model-type/IAISetting'
import { IColumn } from '@penx/model-type/IColumn'
import { IView } from '@penx/model-type/IView'

export type Widget = {
  id: string
  type: string
  collapsed?: boolean
  structId?: string

  [key: string]: any
}

export enum NodeType {
  SPACE = 'SPACE',
  AREA = 'AREA',
  STRUCT = 'STRUCT',
  TAG = 'TAG',
  CREATION_TAG = 'CREATION_TAG',
  INBOX = 'INBOX',
  TRASH = 'TRASH',
  FAVORITE = 'FAVORITE',
  JOURNAL = 'JOURNAL',
  CREATION = 'CREATION',
  SETTINGS = 'SETTINGS',
  SHORTCUT = 'SHORTCUT',
  CHAT = 'CHAT',
  MESSAGE = 'MESSAGE',
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
  spaceId: string
}

export interface ISpaceNode extends INode {
  type: NodeType.SPACE
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
    favorCommands: string[]
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
    emoji?: string
    color: string
    about: string
    activeViewId: string
    viewIds: string[]
    columns: IColumn[]
    views: IView[]
    showDetail?: boolean
    syncable?: boolean
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

export function isJournalNode(n: any): n is IJournalNode {
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

export type ImageCreationData = {
  url: string
  uploaded: boolean
  localUrl?: string
  fileId?: string
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
    podcast: any
    content: any
    data?: any // for any data
    cells: any
    i18n: any
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
    date: string
    publishedAt?: Date
    archivedAt?: Date
    openedAt: Date
    structId: string
  }
}

export function isCreationNode(n: any): n is ICreationNode {
  return n.type === NodeType.CREATION
}

export interface ISettingsNode extends INode {
  type: NodeType.SETTINGS
  props: {}
}

export function isSettingsNode(n: any): n is ISettingsNode {
  return n.type === NodeType.SETTINGS
}

export enum ShortcutType {
  TOGGLE_MAIN_WINDOW = 'TOGGLE_MAIN_WINDOW',
  TOGGLE_INPUT_WINDOW = 'TOGGLE_INPUT_WINDOW',
  TOGGLE_PANEL_WINDOW = 'TOGGLE_PANEL_WINDOW',
  COMMAND = 'COMMAND',
}

export type Shortcut = {
  type: ShortcutType
  commandId?: string
  keys: string[]
}

export interface IShortcutNode extends INode {
  type: NodeType.SHORTCUT
  areaId: string
  props: {
    shortcuts: Shortcut[]
  }
}

export function isShortcutNode(n: any): n is IShortcutNode {
  return n.type === NodeType.SHORTCUT
}

export interface IChatNode extends INode {
  type: NodeType.CREATION
  areaId: string
  props: {
    title: string
    visibility: 'public' | 'private'
    commandId?: string
  }
}

export function isChatNode(n: any): n is IChatNode {
  return n.type === NodeType.CHAT
}

export interface IMessageNode extends INode {
  type: NodeType.MESSAGE
  areaId: string
  props: {
    chatId: string
    role: 'system' | 'user' | 'assistant' | 'data'
    parts: any
    attachments?: any
  }
}

export function isMessageNode(n: any): n is IMessageNode {
  return n.type === NodeType.MESSAGE
}
