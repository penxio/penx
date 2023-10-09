import { useCallback } from 'react'
import { Box } from '@fower/react'
import { insertNode, TElement } from '@udecode/plate-common'
import { Editor, Element, Node, Transforms } from 'slate'
import { useSlateStatic } from 'slate-react'
import { selectEditor } from '@penx/editor-transforms'
import { useExtensionStore } from '@penx/hooks'
import { isBlockSelector } from '../isBlockSelector'
import { useKeyDownList } from '../useKeyDownList'
import { BlockSelectorItem } from './BlockSelectorItem'

interface Props {
  close: any
  element: any
  containerRef: any
}

export const BlockSelectorContent = ({ close, element }: Props) => {
  const editor = useSlateStatic()
  const { extensionStore } = useExtensionStore()

  const filteredTypes = Object.keys(extensionStore.elementMaps).filter(
    (item) => {
      const { type, slashCommand } = extensionStore.elementMaps[item]
      if (!slashCommand) return false
      const q = Node.string(element).replace(/^\//, '').toLowerCase()
      if (!q) return true
      return (
        slashCommand.name.toLowerCase().includes(q) ||
        type.toLowerCase().includes(q)
      )
    },
  )

  /**
   * TODO: need refactoring
   */
  const selectType = useCallback(
    (elementType: any) => {
      const elementInfo = extensionStore.elementMaps[elementType]
      console.log('elementInfo:', elementInfo)

      if (!elementInfo) return // TODO
      close()

      const block = Editor.above(editor, {
        match: (n) => Editor.isBlock(editor, n as Element),
      })

      const at = block ? block[1] : []

      if (elementInfo.isInline) {
        return
      }

      if (elementInfo.shouldNested) {
        /**
         * remove block first, then insert
         * don't use setNodes，@see  https://github.com/ianstormtaylor/slate/issues/4020
         */
        Transforms.removeNodes(editor, { at })
        Transforms.insertNodes(
          editor,
          {
            ...elementInfo.slashCommand?.defaultNode,
          } as any,
          { at },
        )
        Transforms.select(editor, Editor.start(editor, at))
        return
      }

      // image,divider...
      if (elementInfo.isVoid) {
        Transforms.removeNodes(editor, {
          match: (n) => Element.isElement(n) && Editor.isBlock(editor, n),
        })

        Transforms.insertNodes(editor, {
          type: elementType,
          children: [{ text: '' }],
        } as TElement)

        if (elementInfo?.slashCommand?.afterInvokeCommand) {
          elementInfo.slashCommand.afterInvokeCommand(editor)
        }
      } else {
        // p,h1,h2,h3,h4...
        Transforms.setNodes(
          editor,
          {
            type: elementType,
            ...elementInfo.slashCommand?.defaultNode,
          } as TElement,
          {
            // mode: 'lowest',
            match: (n) =>
              Element.isElement(n) &&
              Editor.isBlock(editor, n) &&
              !isBlockSelector(n),
          },
        )

        Transforms.removeNodes(editor, {
          match: (n: any) => n.id === element.id,
        })

        selectEditor(editor, { focus: true, at })
      }
    },
    [editor, close, element, extensionStore],
  )

  const listItemIdPrefix = 'type-list-item-'

  const { cursor } = useKeyDownList({
    onEnter: (cursor) => {
      selectType(filteredTypes[cursor])
    },
    listLength: filteredTypes.length,
    listItemIdPrefix,
  })

  return (
    <Box column gapY-1>
      {filteredTypes.map((type, i) => {
        const { slashCommand } = extensionStore.elementMaps[type]
        return (
          <BlockSelectorItem
            key={type}
            id={listItemIdPrefix + i}
            name={slashCommand?.name || ''}
            isActive={i === cursor}
            icon={slashCommand?.icon}
            onClick={() => selectType(type)}
          />
        )
      })}
    </Box>
  )
}
