export interface FilterItem {
  label: string
  value: string | number
  selected?: boolean
}
export interface ICommand {
  name: string
  title: string
  subtitle: string
  description: string
  filters?: Record<string, FilterItem[]>
  icon?: string | Record<string, string>
  code: string
  mode?: 'preset-ui' | 'custom-ui' | 'no-view'
  source?: 'application' | 'extension' | 'system' | 'database'
  isBuiltIn?: boolean
  alias?: string
  hotkey?: string[]
  data?: Record<string, any>
}

export interface IExtension {
  id: string

  spaceId: string

  name: string

  title: string

  version: string

  commands: ICommand[]

  assets: Record<string, string>

  icon?: string | Record<string, string>

  description?: string

  author?: string

  location?: string

  isDeveloping: boolean

  createdAt: Date

  updatedAt: Date
}
