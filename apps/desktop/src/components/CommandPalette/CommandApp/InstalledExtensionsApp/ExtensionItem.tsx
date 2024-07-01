import { Box } from '@fower/react'
import { Tag } from 'uikit'
import { IExtension } from '@penx/model-types'
import { StyledCommandItem } from '../../CommandComponents'
import { ListItemIcon } from '../../ListItemIcon'

interface ExtensionItemProps {
  extension: IExtension
}

export function ExtensionItem({ extension }: ExtensionItemProps) {
  const isBuiltin = extension.name.startsWith('penx/penx')
  const isDeveloping = extension.isDeveloping

  return (
    <StyledCommandItem
      key={extension.id}
      cursorPointer
      toCenterY
      toBetween
      px2
      py3
      gap2
      roundedLG
      black
      value={extension.id}
      // onSelect={() => onSelectExtension(item)}
      // onClick={() => onSelectExtension(item)}
    >
      <Box toCenterY gap2>
        <ListItemIcon icon={extension.icon} />
        <Box column>
          <Box textSM>{extension.title}</Box>
        </Box>
      </Box>
      <Box>
        {isDeveloping && (
          <Tag size="sm" variant="light" colorScheme="gray400" ml2>
            Developing
          </Tag>
        )}

        {isBuiltin && (
          <Tag size="sm" variant="light" colorScheme="brand500" ml2>
            Builtin
          </Tag>
        )}
      </Box>
    </StyledCommandItem>
  )
}
