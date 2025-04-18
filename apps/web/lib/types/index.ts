export * from './types'
export * from './session.types'
export * from './database-types'

export interface FilterItem {
  label: string
  value: string | number
  selected?: boolean
}

export interface ICommandItem {
  keywords: string[]
  data: {
    type: 'Database' | 'Command' | 'Application'
    alias: string
    database: any
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
