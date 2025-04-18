export interface IBlock {
  id: string
  siteId: string
  pageId: string
  parentId: string
  type: string
  collapsed: boolean
  trashed: boolean
  content: any
  children: any[]
  props: any
  createdAt: Date
  updatedAt: Date
}
