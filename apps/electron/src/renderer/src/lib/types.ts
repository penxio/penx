import { Struct } from '@penx/domain'
import { IListItem } from '@penx/extension-api'

export interface FilterItem {
  label: string
  value: string | number
  selected?: boolean
}

export interface ICommandItem extends IListItem {
  keywords: string[]
  data: {
    type: 'Struct' | 'Command' | 'Application'
    alias: string
    struct: Struct
    assets: Record<string, string>
    filters: Record<string, FilterItem[]>
    runtime: 'worker' | 'iframe'
    commandName: string
    extensionSlug: string
    extensionIcon: string
    isDeveloping: boolean
    applicationPath: string
    isApplication: boolean
    appIconPath?: string
  }
}
