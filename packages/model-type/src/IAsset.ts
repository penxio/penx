export interface IAsset {
  id: string
  url: string
  filename: string
  title: string
  description: string
  contentType: string
  isPublic: boolean
  isTrashed: boolean
  size: number
  userId: string
  spaceId: string
  sharingConfig: any
  props: any
  createdAt: Date
  uploadedAt: Date
  updatedAt: Date
  assetLabels: any
}
