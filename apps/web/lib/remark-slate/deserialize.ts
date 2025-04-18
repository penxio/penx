import {
  BlockQuoteNode,
  CodeBlockNode,
  defaultNodeTypes,
  DeserializedNode,
  HeadingNode,
  ImageNode,
  InputNodeTypes,
  ItalicNode,
  LinkNode,
  ListItemNode,
  ListNode,
  MdastNode,
  OptionType,
  ParagraphNode,
  TextNode,
  ThematicBreakNode,
} from './ast-types'

export default function deserialize<T extends InputNodeTypes>(
  node: MdastNode,
  opts?: OptionType<T>,
) {
  const types = {
    ...defaultNodeTypes,
    ...opts?.nodeTypes,
    heading: {
      ...defaultNodeTypes.heading,
      ...opts?.nodeTypes?.heading,
    },
  }

  const linkDestinationKey = opts?.linkDestinationKey ?? 'link'
  const imageSourceKey = opts?.imageSourceKey ?? 'link'
  const imageCaptionKey = opts?.imageCaptionKey ?? 'caption'

  let children: Array<DeserializedNode<T>> = [{ text: '' }]

  const nodeChildren = node.children
  if (nodeChildren && Array.isArray(nodeChildren) && nodeChildren.length > 0) {
    children = nodeChildren.flatMap((c: MdastNode) =>
      deserialize(
        {
          ...c,
          ordered: node.ordered || false,
        },
        opts,
      ),
    )
  }

  switch (node.type) {
    case 'heading':
      return {
        type: types.heading[node.depth || 1],
        children,
      } as HeadingNode<T>
    case 'list':
      return {
        type: node.ordered ? types.ol_list : types.ul_list,
        children,
      } as ListNode<T>
    case 'listItem':
      return { type: types.listItem, children } as ListItemNode<T>
    case 'paragraph':
      return { type: types.paragraph, children } as ParagraphNode<T>
    case 'link':
      return {
        type: types.link,
        [linkDestinationKey]: node.url,
        children,
      } as LinkNode<T>
    case 'image':
      return {
        type: types.image,
        children: [{ text: '' }],
        [imageSourceKey]: node.url,
        [imageCaptionKey]: node.alt,
      } as ImageNode<T>
    case 'blockquote':
      return { type: types.block_quote, children } as BlockQuoteNode<T>
    case 'code':
      return {
        type: types.code_block,
        language: node.lang,
        children: [{ text: node.value }],
      } as CodeBlockNode<T>

    case 'html':
      if (node.value?.includes('<br>')) {
        return {
          break: true,
          type: types.paragraph,
          children: [{ text: node.value?.replace(/<br>/g, '') || '' }],
        } as ParagraphNode<T>
      }
      return { type: 'paragraph', children: [{ text: node.value || '' }] }

    case 'emphasis':
      return {
        [types.emphasis_mark as string]: true,
        ...forceLeafNode(children as Array<TextNode>),
        ...persistLeafFormats(children as Array<MdastNode>),
      } as unknown as ItalicNode<T>
    case 'strong':
      return {
        [types.strong_mark as string]: true,
        ...forceLeafNode(children as Array<TextNode>),
        ...persistLeafFormats(children as Array<MdastNode>),
      }
    case 'delete':
      return {
        [types.delete_mark as string]: true,
        ...forceLeafNode(children as Array<TextNode>),
        ...persistLeafFormats(children as Array<MdastNode>),
      }
    case 'inlineCode':
      return {
        [types.inline_code_mark as string]: true,
        text: node.value,
        ...persistLeafFormats(children as Array<MdastNode>),
      }
    case 'thematicBreak':
      return {
        type: types.thematic_break,
        children: [{ text: '' }],
      } as ThematicBreakNode<T>

    case 'text':
    default:
      return { text: node.value || '' }
  }
}

const forceLeafNode = (children: Array<TextNode>) => ({
  text: children.map((k) => k?.text).join(''),
})

// This function is will take any unknown keys, and bring them up a level
// allowing leaf nodes to have many different formats at once
// for example, bold and italic on the same node
function persistLeafFormats(
  children: Array<MdastNode>,
): Omit<MdastNode, 'children' | 'type' | 'text'> {
  return children.reduce((acc, node) => {
    ;(Object.keys(node) as Array<keyof MdastNode>).forEach(function (key) {
      if (key === 'children' || key === 'type' || key === 'text') return

      acc[key] = node[key]
    })

    return acc
  }, {} as any)
}
