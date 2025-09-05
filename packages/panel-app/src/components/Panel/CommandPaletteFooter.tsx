import { useState } from 'react'
import { Box } from '@fower/react'
import { ProfileButton } from '@penx/components/ProfileButton'
import { isProd } from '@penx/constants'
import { appEmitter } from '@penx/emitter'
import { useAreas } from '@penx/hooks/useAreas'
import { localDB } from '@penx/local-db'
import { Button } from '@penx/uikit/ui/button'
import { useCurrentCommand } from '../../hooks/useCurrentCommand'
import { openCommand } from '../../lib/openCommand'
import { AreasPopover } from '../AreasPopover'
import { ListItemIcon } from './ListItemIcon'
import { ActionPopover } from './SearchBar/ActionPopover'

interface Props {}

const footerHeight = 44

export const CommandPaletteFooter = ({}: Props) => {
  const { currentCommand } = useCurrentCommand()
  return (
    <Box
      className="border-foreground/6 bg-foreground/2 border-t"
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
            // variant="outline-solid"
            size="xs"
            className="text-sm"
            onOpenSettings={() => {
              openCommand({ name: 'settings' })
            }}
          />
        </div>
      )}
      {!isProd && (
        <Button
          onClick={async () => {
            const nodes = await localDB.node.findMany({})
            await localDB.node.deleteNodeByIds(nodes.map((n) => n.id))
          }}
        >
          Clear DB (dev only)
        </Button>
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
