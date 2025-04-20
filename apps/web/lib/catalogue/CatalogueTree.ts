import { CatalogueNodeType, ICatalogueNode } from '@penx/model'
import { CatalogueNode } from './CatalogueNode'
import { CreateCatalogueNodeOptions, WithFlattenProps } from './types'
import { flattenTree } from './utils'

export class CatalogueTree {
  nodes: CatalogueNode[] = []

  constructor(nodes: CatalogueNode[] = []) {
    this.nodes = nodes
  }

  get firstNodeId(): string {
    return this.nodes[0]?.id
  }

  static fromJSON(json: any = []): CatalogueTree {
    json = typeof json === 'object' ? json : JSON.parse(json)

    function convert(nodes: ICatalogueNode[] = []): CatalogueNode[] {
      return nodes.map((node) => {
        if (!node.children?.length) return new CatalogueNode(node)
        const catalogue = new CatalogueNode(node)
        catalogue.children = convert(node.children)
        return catalogue
      })
    }

    const tree = new CatalogueTree(convert(json))

    return tree
  }

  toJSON = () => {
    function convert(nodes: CatalogueNode[]): ICatalogueNode[] {
      return nodes.map<ICatalogueNode>((node) => {
        if (!node.children?.length) {
          return node.toJSON() as ICatalogueNode
        }
        return {
          ...node.toJSON(),
          children: convert(node.children),
        } as ICatalogueNode
      })
    }
    return convert(this.nodes)
  }

  setNodes(nodes: CatalogueNode[] = []) {
    this.nodes = nodes
  }

  addNode = (opt: CreateCatalogueNodeOptions, parentId?: string) => {
    const newNode = new CatalogueNode(opt)
    if (!parentId) this.nodes.push(newNode)

    function traverse(nodes: CatalogueNode[]) {
      for (const node of nodes) {
        if (node.id === parentId) {
          if (!node.children) node.children = []
          node.children.push(newNode)
        } else {
          if (node.children?.length) traverse(node.children)
        }
      }
    }

    traverse(this.nodes)

    return newNode
  }

  findNode = (id: string): CatalogueNode | undefined => {
    let node: CatalogueNode | undefined
    const findNodeById = (nodes: CatalogueNode[]) => {
      for (let i = 0; i < nodes.length; i++) {
        const item = nodes[i]

        if (item.id === id) {
          node = item
          break
        }
        if (item.children?.length) findNodeById(item.children)
      }
    }
    findNodeById(this.nodes)
    return node
  }

  getNodeByFullPathname(pathname: string): CatalogueNode {
    console.log('pathname', pathname)

    return {} as any
  }

  flatten = (
    type?: CatalogueNodeType,
    nodes: CatalogueNode[] = this.nodes,
  ): WithFlattenProps<CatalogueNode>[] => {
    return flattenTree(nodes, type, null, 0)
  }

  getSiblings = (id: string) => {
    const nodes = this.flatten(CatalogueNodeType.POST)
    const index = nodes.findIndex((node) => node.id === id)
    return {
      prev: nodes[index - 1],
      cur: nodes[index],
      next: nodes[index + 1],
    }
  }

  deleteNode = (idOrNode: string | CatalogueNode) => {
    let deletedNode: CatalogueNode | undefined = undefined
    const deleteNodeById = (nodes: CatalogueNode[]) => {
      for (let i = 0; i < nodes.length; i++) {
        const item = nodes[i]

        if (item.id === idOrNode || item === idOrNode) {
          const deletedNodes = nodes.splice(i, 1)
          deletedNode = deletedNodes[0]
          break
        }
        if (item.children?.length) deleteNodeById(item.children)
      }
    }
    deleteNodeById(this.nodes)
    return deletedNode
  }

  switchFolded = (id: string) => {
    const node: CatalogueNode | undefined = this.findNode(id)
    if (node) {
      node.folded = !node.folded
    }
  }

  updateEmoji = (id: string, unified: string) => {
    const node: CatalogueNode | undefined = this.findNode(id)
    if (node) {
      node.emoji = unified
    }
  }

  updateTitle = (id: string, title: string) => {
    const node: CatalogueNode | undefined = this.findNode(id)
    if (node) {
      node.title = title
    }
  }
}
