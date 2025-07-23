export interface IDocument {
  id: string
  title: string
  content: string
  kind: 'text' | 'code' | 'image' | 'sheet'
  userId: string
  spaceId: string
  createdAt: Date
}
