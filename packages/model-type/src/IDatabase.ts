export interface IDatabase {
  id: string
  userId: string
  spaceId: string
  parentId: string
  parentType: string
  activeViewId: string
  viewIds: any[]
  name: string
  color: string
  cover: string
  icon: string
  trashed: boolean
  props: any
  createdAt: Date
  updatedAt: Date
}
