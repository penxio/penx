export interface IChat {
  id: string
  title: string
  userId: string
  visibility: 'public' | 'private'
  siteId: string
  createdAt: Date
}
