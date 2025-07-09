import { IAccessory } from '../types'
import { DataListBuilder, DataListJSON } from './DataListBuilder'

type URL = string
type Asset = string
type Icon = string

export type ImageLike = URL | Asset | Icon | number

export type OpenInBrowser = {
  type: 'OpenInBrowser'
  title?: string
  url: string
}

export type CopyToClipboard = {
  type: 'CopyToClipboard'
  title?: string
  content: string
}

export type ListItemAction = OpenInBrowser | CopyToClipboard

export interface ListHeading {
  type: 'list-heading'
  title: string
}

export interface ObjectIcon {
  value: ImageLike | undefined | null
  tooltip?: string
  color?: string
  bg?: string
}

export interface IListItem {
  id?: string

  type?: 'list-item' | 'list-heading'

  title:
    | string
    | {
        value: string
        tooltip?: string | null
      }

  subtitle?:
    | string
    | {
        value?: string | null
        tooltip?: string | null
      }

  icon?: ImageLike | ObjectIcon

  actions?: ListItemAction[]

  detail?: DataListBuilder

  extra?: IAccessory[]

  data?: any
}

export type ListItemJSON = Omit<IListItem, 'detail'> & {
  detail: DataListJSON
}

export interface ListJSON {
  type: 'list'
  isLoading: boolean
  isShowingDetail: boolean
  filtering: boolean
  titleLayout: 'column' | 'row'
  items: ListItemJSON[]
}

export function isListJSON(json: any): json is ListJSON {
  return json.type === 'list'
}

export function isObjectIcon(icon: any): icon is ObjectIcon {
  return typeof icon === 'object' && icon?.value !== undefined
}

export class ListBuilder {
  isShowingDetail = false
  isLoading = false

  filtering = true

  titleLayout: 'column' | 'row' = 'row'

  constructor(public items: IListItem[] = []) {}

  setItems = (items: IListItem[]) => {
    this.items = items
    return this
  }

  addItem = (item: IListItem) => {
    this.items.push(item)
    return this
  }

  setLoading = (loading: boolean) => {
    this.isLoading = loading
    return this
  }

  setShowingDetail = (showingDetail: boolean) => {
    this.isShowingDetail = showingDetail
    return this
  }

  setTitleLayout(layout: 'column' | 'row') {
    this.titleLayout = layout
    return this
  }

  setFiltering(filtering: boolean) {
    this.filtering = filtering
    return this
  }

  toJSON(): ListJSON {
    return {
      type: 'list',
      isLoading: this.isLoading,
      isShowingDetail: this.isShowingDetail,
      filtering: this.filtering,
      titleLayout: this.titleLayout,
      items: this.items.map((item) => {
        if (!item.detail) return item as any as ListItemJSON
        return {
          ...item,
          // TODO: handle array detail
          detail: item.detail.toJSON(),
        }
      }),
    }
  }
}
