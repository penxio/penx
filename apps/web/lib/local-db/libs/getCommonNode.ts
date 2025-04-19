import { ELEMENT_P } from '@penx/constants'
import { INode, NodeType } from '@/lib/model'
import { uniqueId } from '@penx/unique-id'

type Input = {
  userId: string
  parentId?: string
  type?: NodeType
  name?: string
  props?: INode['props']
  date?: string
  element?: any[]
}

export function getCommonNode(input: Input, text = ''): INode {
  const { name, ...rest } = input
  return {
    id: uniqueId(),
    type: NodeType.COMMON,
    element: [
      {
        type: ELEMENT_P,
        children: [{ text }],
      },
    ],

    props: rest.props || {},
    collapsed: false,
    folded: true,
    children: [],
    createdAt: new Date(),
    updatedAt: new Date(),
    ...rest,
  } as INode
}
