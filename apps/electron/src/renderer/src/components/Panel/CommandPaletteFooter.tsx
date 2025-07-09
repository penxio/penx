import { useState } from 'react'
import { Box } from '@fower/react'
import { appEmitter } from '@penx/emitter'
import { useCurrentCommand } from '~/hooks/useCurrentCommand'
import { ListItemIcon } from './ListItemIcon'
import { ActionPopover } from './SearchBar/ActionPopover'
import { useAreas } from '@penx/hooks/useAreas'
import { AreasPopover } from './AreasPopover'

interface Props {
  footerHeight: number
}

export const CommandPaletteFooter = ({ footerHeight }: Props) => {
  const { currentCommand } = useCurrentCommand()
  return (
    <Box
      className="border-t border-foreground/10 bg-foreground/5"
      h={footerHeight}
      toCenterY
      px3
      toBetween
    >
      {currentCommand && currentCommand.data.extensionIcon ? (
        <ListItemIcon icon={currentCommand.data.extensionIcon} />
      ) : (
        <div className="inline-flex">
          <AreasPopover />
        </div>
      )}
      {/* <Box
        className="drag flex-1 h-full"
        onClick={() => {
          appEmitter.emit('FOCUS_SEARCH_BAR_INPUT')
        }}
      ></Box> */}

      <ActionPopover />
    </Box>
  )
}
