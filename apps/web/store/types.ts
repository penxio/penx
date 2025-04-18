export type RouteName =
  | 'TRASH'
  | 'NODE'
  | 'TODOS'
  | 'CREATE_SPACE'
  | 'WEB3_PROFILE'
  | 'TASK_BOARD'
  | 'RESTORE_BACKUP'
  | 'DATABASES'

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
