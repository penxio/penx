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
