export enum CatalogueNodeType {
  POST = 'POST',
  PAGE = 'PAGE',
  LINK = 'LINK',
  CATEGORY = 'CATEGORY',
}
export interface ICatalogueNode {
  id: string // nodeId

  folded: boolean

  type: CatalogueNodeType

  emoji?: string

  title?: string

  uri?: string // url or creationId

  children?: ICatalogueNode[]
}

export interface CatalogueNodeJSON {
  id: string // nodeId

  type: CatalogueNodeType

  folded?: boolean

  emoji?: string

  title?: string

  uri: string // url or creationId

  hasChildren?: boolean
}
