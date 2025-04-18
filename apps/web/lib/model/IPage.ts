import { IBlock } from './IBlock'

export interface IPage {
  id: string
  userId: string
  siteId: string
  parentId: string
  parentType: string
  title: string
  cover: string
  icon: string
  trashed: boolean
  isJournal: boolean
  children: any
  props: any
  date: string
  createdAt: Date
  updatedAt: Date
  blocks?: IBlock[]
}
