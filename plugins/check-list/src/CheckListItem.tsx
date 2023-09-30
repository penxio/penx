import { Box } from '@fower/react'
import { Element, Transforms } from 'slate'
import { ReactEditor, useSlateStatic } from 'slate-react'
import { Checkbox } from 'uikit'
import { ElementProps } from '@penx/plugin-typings'
import { CheckListItemElement } from '../custom-types'

export const CheckListItem = ({
  attributes,
  element,
  children,
  nodeProps,
}: ElementProps<CheckListItemElement>) => {
  const { id, checked } = element
  const editor = useSlateStatic()
  return (
    <Box data-key={id} toCenterY flex-1 leadingNormal textBase {...attributes}>
      <Checkbox
        contentEditable={false}
        colorScheme="black"
        mr2
        checked={checked || false}
        onChange={(event) => {
          const path = ReactEditor.findPath(editor, element)
          const newProperties: Partial<Element> = {
            checked: event.target.checked,
          }
          Transforms.setNodes(editor, newProperties, { at: path })
        }}
      />
      <Box
        relative
        flex-1
        py1
        lineThrough={checked}
        opacity-60={checked}
        {...nodeProps}
      >
        {children}
      </Box>
    </Box>
  )
}