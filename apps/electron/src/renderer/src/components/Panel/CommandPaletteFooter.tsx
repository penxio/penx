import { useState } from 'react'
import { Box } from '@fower/react'
import { ProfileButton } from '@penx/components/ProfileButton'
import { appEmitter } from '@penx/emitter'
import { useAreas } from '@penx/hooks/useAreas'
import { useCurrentCommand } from '~/hooks/useCurrentCommand'
import { openCommand } from '~/lib/openCommand'
import { AreasPopover } from '../AreasPopover'
import { ListItemIcon } from './ListItemIcon'
import { ActionPopover } from './SearchBar/ActionPopover'

interface Props {}

const footerHeight = 40

export const CommandPaletteFooter = ({}: Props) => {
  const { currentCommand } = useCurrentCommand()
  return (
    <Box
      className="border-foreground/10 bg-foreground/5 border-t"
      h={footerHeight}
      toCenterY
      px3
      toBetween
    >
      {currentCommand && currentCommand.data.extensionIcon ? (
        <ListItemIcon icon={currentCommand.data.extensionIcon} />
      ) : (
        <div className="inline-flex">
          {/* <AreasPopover /> */}
          <ProfileButton
            size="xs"
            className="text-sm"
            onOpenSettings={() => {
              openCommand({ name: 'settings' })
            }}
          />
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
