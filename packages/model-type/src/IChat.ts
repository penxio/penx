export interface IChat {
  id: string
  title: string
  userId: string
  visibility: 'public' | 'private'
  spaceId: string
  createdAt: Date
}
