import {
  ELEMENT_FILE,
  ELEMENT_FILE_CONTAINER,
  ELEMENT_IMG,
  ELEMENT_TODO,
  FILE_DATABASE_NAME,
  TODO_DATABASE_NAME,
} from '@penx/constants'
import { format } from 'date-fns'
import { calculateSHA256FromString } from '../encryption'
import { INode, NodeType } from './INode'

type Element = {
  id: string
  type: string
  name?: string
  props?: any
  children: Array<{ text: string }>
}

export type WithFlattenedProps<T> = T & {
  parentId: string | null // parent node id
  depth: number
  index: number
}

export class Node {
  parentId: string

  props: Record<string, any> = {}

  constructor(public raw: INode) {
    this.parentId = this.raw?.parentId || ''

    this.props = {
      ...this.raw?.props,
      date: raw?.date,
    } as any
  }

  get id(): string {
    return this.raw?.id || ''
  }

  get userId(): string {
    return this.raw.userId
  }

  get type(): string {
    return this.raw?.type || ''
  }

  get hasChildren() {
    return !!this.children.length
  }

  get date() {
    return this.raw.date || ''
  }

  get element(): Element[] {
    if (!this.raw?.element) return null as any

    // TODO: make element writable, why not override it directly?
    this.raw.element = JSON.parse(JSON.stringify(this.raw.element))

    // override the title
    if (
      this.isDaily ||
      this.isDailyRoot ||
      this.isInbox ||
      this.isTrash ||
      this.isDatabase
    ) {
      try {
        this.raw.element[0].children[0].text = this.title
      } catch (error) {
        // console.log(' error:', error, 'raw:', this.raw)
      }
    }

    // return this.raw.element
    // TODO:
    const element = Array.isArray(this.raw.element)
      ? this.raw.element
      : [this.raw.element]

    return element
  }

  get title(): string {
    if (this.isDaily) {
      const formattedDate = format(
        new Date(this.raw.date || Date.now()),
        'LLL do',
      )
      return (this.isToday ? 'Today, ' : '') + formattedDate
    }

    if (this.isInbox) return 'Inbox'
    if (this.isTrash) return 'Trash'
    if (this.isDatabaseRoot) return 'Databases'
    if (this.isDailyRoot) return 'Journals'
    if (this.isDatabase) {
      if (this.isTodoDatabase) return 'PenX todos'
      if (this.isFileDatabase) return 'PenX files'
      return this.props.name || ''
    }

    if (!this.element?.[0]) return ''

    return this.element[0]?.children?.[0]?.text || this.props.name || ''
  }

  get isCommon() {
    return this.type === NodeType.COMMON
  }

  get isObject() {
    return this.type === NodeType.OBJECT
  }

  get isList() {
    return this.type === NodeType.LIST
  }

  get isListItem() {
    return this.type === NodeType.LIST_ITEM
  }

  get isTrash() {
    return this.type === NodeType.TRASH
  }

  get isInbox() {
    return this.type === NodeType.INBOX
  }

  get isFavorite() {
    return this.type === NodeType.FAVORITE
  }

  get isDaily() {
    return this.type === NodeType.DAILY
  }

  get isTodayNode() {
    return (
      this.type === NodeType.DAILY &&
      this.date === format(new Date(), 'yyyy-MM-dd')
    )
  }

  get isRootNode() {
    return this.type === NodeType.ROOT
  }

  get isDatabaseRoot() {
    return this.type === NodeType.DATABASE_ROOT
  }

  get isDailyRoot() {
    return this.type === NodeType.DAILY_ROOT
  }

  get isDatabase() {
    return this.type === NodeType.DATABASE
  }

  get isView() {
    return this.type === NodeType.VIEW
  }

  get isRow() {
    return this.type === NodeType.ROW
  }

  get isColumn() {
    return this.type === NodeType.COLUMN
  }

  get isCell() {
    return this.type === NodeType.CELL
  }

  get isOption() {
    return this.type === NodeType.OPTION
  }

  get isTodoElement() {
    return this.element?.[0].type === ELEMENT_TODO
  }

  get isFileElement() {
    return this.element?.[0].type === ELEMENT_FILE_CONTAINER
  }

  get isTodoDatabase() {
    return this.isDatabase && this.raw.props?.name === TODO_DATABASE_NAME
  }

  get isFileDatabase() {
    return this.isDatabase && this.raw.props?.name === FILE_DATABASE_NAME
  }

  get canRef() {
    return this.isCommon || this.isDaily
  }

  get collapsed() {
    return this.raw.collapsed
  }

  get folded() {
    return this.raw.folded
  }

  get tagName(): string {
    return this.raw.props.name || ''
  }

  get tagColor(): string {
    return this.raw.props.color || ''
  }

  get gateType(): any {
    return this.raw.props.gateType || ''
  }

  get collectible(): boolean {
    return this.raw.props.collectible || false
  }

  get children() {
    return this.raw.children
  }

  get favorites(): string[] {
    return (this.raw as any)?.favorites || []
  }

  get isToday() {
    const today = format(new Date(), 'yyyy-MM-dd')
    return today === this.date
  }

  get isSpecialDatabase() {
    if (this.tagName === '__FILE__' || this.tagName === '__TODO__') return true
    if (this.tagName.startsWith('$template__')) return true
    return false
  }

  get fileHash() {
    const element = this.element as any
    try {
      const fileElement = element[0].children[0]
      return fileElement?.fileHash || ''
    } catch (error) {
      return ''
    }
  }

  get googleDriveFileId() {
    const element = this.element as any
    try {
      const fileElement = element[0].children[0]
      return fileElement?.googleDriveFileId || ''
    } catch (error) {
      return ''
    }
  }
  get createdAt() {
    return this.raw.createdAt
  }

  get updatedAt() {
    return this.raw.updatedAt
  }

  get createdAtFormatted() {
    return format(this.raw.createdAt, 'yyyy-MM-dd HH:mm')
  }

  get updatedAtFormatted() {
    return format(this.raw.updatedAt, 'yyyy-MM-dd HH:mm')
  }

  get snapshotId() {
    if (this.isInbox) return NodeType.INBOX
    if (this.isRootNode) return NodeType.ROOT
    if (this.isTrash) return NodeType.TRASH
    return this.id
  }

  toHash(): string {
    const json = [
      this.id,
      this.userId,
      this.parentId,
      this.type,
      this.element,
      this.props,
      this.collapsed,
      this.folded,
      this.children,
    ]

    return calculateSHA256FromString(JSON.stringify(json))
  }

  setProps(props: Record<string, any>) {
    this.props = props
  }
}
