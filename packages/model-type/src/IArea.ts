import { Widget } from '@penx/types'

export interface IArea {
  id: string
  slug: string
  name: string
  description: string
  about: string
  logo?: string
  cover?: string
  widgets: Widget[]
  chargeMode: string
  type: string
  props?: any
  favorites: string[]
  isGenesis: boolean
  deletedAt?: Date
  createdAt: Date
  updatedAt: Date
  userId: string
  siteId: string
  productId?: string
}
