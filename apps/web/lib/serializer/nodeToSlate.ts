import {
  ELEMENT_DAILY_ENTRY,
  ELEMENT_DATABASE_ENTRY,
  ELEMENT_LI,
  ELEMENT_LIC,
  ELEMENT_TITLE,
  ELEMENT_UL,
} from '@/lib/constants'
import { INode, Node } from '@/lib/model'
import { uniqueId } from '@/lib/unique-id'

interface NodeToSlateOptions {
  node: INode
  nodes: INode[]
  isOutliner: boolean
  isOutlinerSpace?: boolean
  isNewId?: boolean
}

/**
 * single node to slate
 */
export function nodeToSlate({
  node,
  nodes,
  isOutliner,
  isOutlinerSpace,
  isNewId,
}: NodeToSlateOptions) {
  const serializer = new NodeToSlateSerializer(
    new Node(node),
    nodes.map((n) => new Node(n)),
    isOutliner,
    isOutlinerSpace,
    isNewId,
  )
  return serializer.getEditorValue()
}

export class NodeToSlateSerializer {
  nodeMap = new Map<string, INode>()

  childrenNodes: Node[] = []

  constructor(
    private node: Node,
    public allNodes: Node[],
    private isOutliner: boolean,
    private isOutlinerSpace?: boolean,
    private isNewId?: boolean,
  ) {
    for (const item of allNodes) {
      this.nodeMap.set(item.id, item.raw)
    }

    this.childrenNodes = node.raw.children
      // TODO: why get an undefined node
      .filter((id) => !!this.nodeMap.get(id))
      .map((id) => {
        return new Node(this.nodeMap.get(id)!)
      })
  }

  getEditorValue(
    childrenNodes: Node[] = this.childrenNodes,
    isCreateTitle = true,
  ) {
    if (this.node.isDatabase) {
      return getDatabaseNodeEditorValue(this.node)
    }

    if (this.node.isDatabaseRoot) {
      return getDatabaseRootEditorValue(this.node, this.nodeMap)
    }

    if (this.node.isDailyRoot && !this?.isOutlinerSpace) {
      // if (this.node.isDailyRoot) {
      return getDailyRootEditorValue(this.node, this.nodeMap)
    }

    if (this.isOutliner) {
      return this.getOutlinerContent(childrenNodes, isCreateTitle)
    }

    return this.getBlockContent(isCreateTitle)
  }

  getBlockContent(isCreateTitle = true) {
    const value: any[] = []

    if (isCreateTitle) {
      value.push({
        id: this.node.id,
        type: ELEMENT_TITLE,
        props: this.node.props,
        nodeType: this.node.type,
        children: this.node.element,
      })
    }

    // console.log('========this.node:', this.node)

    // console.log('=======isCreateTitle:', isCreateTitle, 'value:', value)

    for (const id of this.node.children) {
      const node = new Node(this.nodeMap.get(id)!)
      if (!node) continue
      if (node.isCommon || node.isListItem) {
        const element = Array.isArray(node.element)
          ? node.element[0]
          : node.element

        value.push({
          ...element,
          id: node.id,
        })
        continue
      }

      if (node.isList) {
        const childrenNodes = node.raw.children
          .map((id) => {
            const node = this.nodeMap.get(id)!
            // TODO: why get an undefined node
            if (!node) return undefined
            return new Node(node)
          })
          .filter((n) => !!n) as Node[]

        const ul = this.nodeToListElement(childrenNodes)

        value.push({
          ...ul,
          id: node.id,
        })
      }
    }

    return value
  }

  private nodeToListElement(childrenNodes: Node[]) {
    const childrenToList = (
      children: string[],
      parentId: string | null = null,
    ) => {
      const listItems = children
        // TODO: why get an undefined node, need to check it
        .filter((id) => !!this.nodeMap.get(id))
        .map((id) => {
          const node = this.nodeMap.get(id)!

          const liChildren = [
            {
              id: this.isNewId ? uniqueId() : node.id,
              type: ELEMENT_LIC,
              nodeType: node.type,
              parentId,
              collapsed: node.collapsed,
              // children: node.element,
              // TODO:
              children: Array.isArray(node.element)
                ? node.element
                : [node.element],
            },
          ]

          if (node.children) {
            const ul = childrenToList(node.children, node.id)
            if (ul) liChildren.push(ul as any)
          }

          return {
            type: ELEMENT_LI,
            children: liChildren,
          }
        })

      if (!listItems.length) return null
      return {
        type: ELEMENT_UL,
        children: listItems,
      }
    }

    const sortedChildrenNodes = !this.node.isDailyRoot
      ? childrenNodes
      : childrenNodes.sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
        )

    const content = {
      type: ELEMENT_UL,
      children: sortedChildrenNodes.map((node) => {
        // override the title
        if (node.isDaily || node.isInbox) {
          node.element[0].children[0].text = node.title
        }

        const listChildren = [
          {
            id: this.isNewId ? uniqueId() : node.id,
            type: ELEMENT_LIC,
            parentId: null,
            nodeType: node.type,
            props: node.props,
            date: node.date,
            collapsed: node.collapsed,
            children: node.element,
          },
        ]

        const ul = childrenToList(node.children, node.id) as any
        if (ul) listChildren.push(ul)

        return {
          type: ELEMENT_LI,
          children: listChildren,
        }
      }),
    }
    return content
  }

  getOutlinerContent(
    childrenNodes: Node[] = this.childrenNodes,
    isCreateTitle = true,
  ) {
    const value: any[] = []

    if (isCreateTitle) {
      value.push({
        id: this.isNewId ? uniqueId() : this.node.id,
        type: ELEMENT_TITLE,
        props: this.node.props,
        date: this.node.date,
        nodeType: this.node.type,
        children: this.node.element,
      })
    }

    const content = this.nodeToListElement(childrenNodes)

    if (childrenNodes.length) {
      value.push(content)
    }

    return value
  }
}

function getDatabaseNodeEditorValue(node: Node) {
  const value = [
    {
      id: node.id,
      type: ELEMENT_TITLE,
      props: node.props,
      nodeType: node.type,
      children: [
        {
          type: 'p',
          children: [
            {
              text: node.title,
            },
          ],
        },
      ],
    },
    {
      type: ELEMENT_UL,
      children: [
        {
          type: ELEMENT_LI,
          children: [
            {
              id: node.id,
              type: ELEMENT_LIC,
              nodeType: node.type,
              props: node.props,
              collapsed: node.collapsed,
              children: [
                {
                  type: 'database', // TODO: don't hardcode
                  databaseId: node.id,
                  children: [{ text: '' }],
                },
              ],
            },
          ],
        },
      ],
    },
  ]

  return value
}

function getDatabaseRootEditorValue(node: Node, nodeMap: Map<string, INode>) {
  const children = node.children
    // TODO: why get an undefined node
    .filter((id) => {
      const node = nodeMap.get(id)
      if (!node) return false
      const { name = '' } = node.props
      return !name.startsWith('$template__')
    })
    .map((id) => {
      const databaseNode = nodeMap.get(id)!
      const node = new Node(databaseNode)
      return {
        type: ELEMENT_LI,
        children: [
          {
            id: databaseNode.id,
            type: ELEMENT_LIC,
            nodeType: databaseNode.type,
            props: databaseNode.props,
            collapsed: databaseNode.collapsed,
            children: [
              {
                type: ELEMENT_DATABASE_ENTRY,
                databaseId: databaseNode.id,
                props: databaseNode.props,
                name: node.title,
                children: [{ text: databaseNode.props.name }],
              },
            ],
          },
        ],
      }
    })

  const value: any[] = [
    {
      id: node.id,
      type: ELEMENT_TITLE,
      props: node.props,
      nodeType: node.type,
      children: [
        {
          type: 'p',
          children: [{ text: 'Databases' }],
        },
      ],
    },
  ]

  if (node.children.length) {
    value.push({
      type: ELEMENT_UL,
      children,
    })
  }

  return value
}

function getDailyRootEditorValue(node: Node, nodeMap: Map<string, INode>) {
  const children = node.children
    // TODO: why get an undefined node
    .filter((id) => nodeMap.get(id))
    .map((id) => nodeMap.get(id)!)
    .sort((a, b) => {
      return new Date(a.date!).getTime() - new Date(b.date!).getTime()
    })
    .map((node) => {
      return {
        type: ELEMENT_LI,
        children: [
          {
            id: node.id,
            type: ELEMENT_LIC,
            nodeType: node.type,
            date: node.date,
            props: node.props,
            collapsed: node.collapsed,
            children: [
              {
                type: ELEMENT_DAILY_ENTRY,
                date: node.date,
                props: node.props,
                children: [{ text: '' }],
              },
            ],
          },
        ],
      }
    })

  const value: any[] = [
    {
      id: node.id,
      type: ELEMENT_TITLE,
      props: node.props,
      nodeType: node.type,
      children: [
        {
          type: 'p',
          children: [{ text: 'Journals' }],
        },
      ],
    },
  ]

  if (node.children.length) {
    value.push({
      type: ELEMENT_UL,
      children,
    })
  }

  return value
}
