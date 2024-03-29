import { Atom, WritableAtom } from 'jotai'
import {
  RegisterBlockOptions,
  RegisterComponentOptions,
  SettingsSchema,
} from '@penx/extension-typings'

type pluginId = string

export type ExtensionStore = Record<
  pluginId,
  {
    components: Array<RegisterComponentOptions>
    block: RegisterBlockOptions
    settingsSchema: SettingsSchema
  }
>

export type RouteName =
  | 'TRASH'
  | 'NODE'
  | 'TODOS'
  | 'ACCOUNT_SETTINGS'
  | 'SPACE_SETTINGS'
  | 'CREATE_SPACE'
  | 'SYNC_SERVER'
  | 'WEB3_PROFILE'
  | 'TASK_BOARD'
  | 'VERSION_CONTROL'

export type IRouterStore = {
  name: RouteName
  params: Record<string, any>
}

export type SettingsRouterStore = {
  name: RouteName
  params: Record<string, any>
}

export type Command = {
  id: string
  name: string
  pluginId?: string
  handler: () => void
}
