export * from './types'
export * from './session.types'
export * from './database-types'
export * from './ai/llm-provider-type'

export interface FilterItem {
  label: string
  value: string | number
  selected?: boolean
}

export interface ICommandItem  {
  keywords: string[]
  data: {
    type: 'Struct' | 'Command' | 'Application'
    alias: string
    struct: any
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
