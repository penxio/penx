import _ from 'lodash'
import { createEditor, Editor, Path, Transforms } from 'slate'
import { ELEMENT_LI, ELEMENT_LIC } from '@penx/constants'
import { INode, NodeType } from '@penx/model'
import { uniqueId } from '@penx/unique-id'
import { getNodeByPath } from '@penx/utils/getNodeByPath'
import {
  ListContentElement,
  ListItemElement,
  TitleElement,
  UnorderedListElement,
} from './list-types'

function isListItemElement(node: any): node is ListItemElement {
  return node?.type === ELEMENT_LI
}

function isListContentElement(node: any): node is ListContentElement {
  return node?.type === ELEMENT_LIC
}

// TODO: should handle tags
export function slateToNodes(
  value: any,
  node?: INode,
  allNodes: INode[] = [],
): INode[] {
  function getNode(id: string) {
    return allNodes.find((n) => n.id === id)
  }

  const nodes: INode[] = []
  const [title, ul] = value as [TitleElement, UnorderedListElement]

  const editor = createEditor()

  if (!ul && title && node) {
    nodes.push({ ...node, element: title.children })
    return nodes
  }

  Transforms.insertNodes(editor, ul)

  const childrenForCurrentNode = ul.children.map((listItem) => {
    return listItem.children[0].id
  })

  if (node) {
    // root node for this node
    nodes.push({
      ...node,
      element: title.children,
      children: childrenForCurrentNode,
    })
  }

  const listContents = Editor.nodes(editor, {
    at: [],
    match: isListContentElement,
  })

  for (const [item, path] of listContents) {
    // listItem
    const parent = getNodeByPath(
      editor,
      Path.parent(path),
    ) as any as ListItemElement

    // get node children
    let children: string[] = []

    if (parent.children.length > 1) {
      const listItems = parent.children[1].children as any as ListItemElement[]

      children = listItems.map((item) => item.children[0].id)
    }

    // node parentId
    const grandparent = getNodeByPath(editor, path.slice(0, -3))!

    let newParentId = node?.id

    if (isListItemElement(grandparent)) {
      newParentId = grandparent.children[0].id
    }

    const key = [...path.slice(1)].reduce(
      (acc, cur) => [...acc, 'children', cur],
      [] as any[],
    )

    const element = _.get(ul, [...key, 'children'])
    const foundNode = getNode(item.id)

    if (foundNode) {
      nodes.push({
        ...foundNode,
        parentId: newParentId,
        element,
        collapsed: !!item.collapsed,
        children,
      })
    } else {
      nodes.push({
        id: item?.id || uniqueId(),
        userId: window.__USER_ID__,
        parentId: newParentId,
        type: NodeType.COMMON,
        element,
        props: {},
        date: '',
        collapsed: !!item.collapsed,
        folded: true,
        children,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
    }
  }

  return nodes
}
