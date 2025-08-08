import { useEffect, useMemo, useState } from 'react'
import { Box, FowerHTMLProps } from '@fower/react'
import { t } from '@lingui/core/macro'
import { Trans } from '@lingui/react/macro'
import {
  BracesIcon,
  DoorOpenIcon,
  EditIcon,
  EyeOffIcon,
  KeyboardIcon,
  MoveDownIcon,
  MoveUp,
  ShareIcon,
  Star,
  StarIcon,
  StarOffIcon,
  Trash2Icon,
  TrashIcon,
} from 'lucide-react'
import { toast } from 'sonner'
import { appEmitter } from '@penx/emitter'
import { useArea } from '@penx/hooks/useArea'
import { useStructs } from '@penx/hooks/useStructs'
import { isBuiltinStruct } from '@penx/libs/isBuiltinStruct'
import { store } from '@penx/store'
import { useCurrentCommand } from '~/hooks/useCurrentCommand'
import { useCurrentStruct } from '~/hooks/useCurrentStruct'
import { useHandleSelect } from '~/hooks/useHandleSelect'
import { useItems } from '~/hooks/useItems'
import { navigation, useQueryNavigations } from '~/hooks/useNavigation'
import { useSelectStruct } from '~/hooks/useSelectStruct'
import { useValue } from '~/hooks/useValue'
import { ICommandItem } from '~/lib/types'
import { ActionCommandItem } from './ActionCommandItem'

interface RootActionsProps {
  close: () => void
  command: ICommandItem
}
export function RootActions({ command, close }: RootActionsProps) {
  const { value } = useValue()
  const { structs } = useStructs()
  const { items } = useItems()
  const struct = structs.find((s) => s.id === value)

  const handleSelect = useHandleSelect()
  const selectStruct = useSelectStruct()
  const { push, reset } = navigation
  const { setStruct } = useCurrentStruct()
  const { setCurrentCommand } = useCurrentCommand()
  const currentItem = items.find((item) => item.id === value)!
  const { area } = useArea()

  const isFavor = area.favorCommands?.includes(currentItem?.id!)
  const isCreation = !!currentItem?.data?.creation
  const isStruct = !!struct

  return (
    <>
      {isCreation && (
        <ActionCommandItem
          shortcut=""
          onSelect={() => {
            push({ path: '/edit-creation' })
            close()
          }}
        >
          <Box toCenterY gap2 inlineFlex>
            <div className="">
              <EditIcon size={16} />
            </div>
            <div>
              <Trans>Edit content</Trans>
            </div>
          </Box>
        </ActionCommandItem>
      )}
      {!isCreation && (
        <ActionCommandItem
          shortcut="↵"
          onSelect={() => {
            if (command) {
              if (command.data.struct) {
                selectStruct(command)
              } else {
                handleSelect(command)
              }
            }

            close()
          }}
        >
          <Box toCenterY gap2 inlineFlex>
            <div className="">
              <DoorOpenIcon size={16} />
            </div>
            <div>
              <Trans>Open Command</Trans>
            </div>
          </Box>
        </ActionCommandItem>
      )}
      {!!struct && (
        <ActionCommandItem
          shortcut=""
          onSelect={() => {
            push({ path: '/edit-struct' })
            setCurrentCommand(currentItem!)
            setStruct(struct.raw)
            close()
          }}
        >
          <Box toCenterY gap2 inlineFlex>
            <div className="">
              <BracesIcon size={16} />
            </div>
            <div>
              <Trans>Edit Struct</Trans>
            </div>
          </Box>
        </ActionCommandItem>
      )}
      <ActionCommandItem
        shortcut=""
        onSelect={() => {
          push({ path: '/configure-shortcut' })
          setCurrentCommand(currentItem!)
          close()
        }}
      >
        <Box toCenterY gap2 inlineFlex>
          <div className="">
            <KeyboardIcon size={16} />
          </div>
          <div>
            <Trans>Configure Shortcut</Trans>
          </div>
        </Box>
      </ActionCommandItem>
      {isFavor && (
        <>
          <ActionCommandItem
            shortcut=""
            onSelect={async () => {
              const idx = area.favorCommands.indexOf(currentItem.id!)
              if (idx > 0) {
                await store.area.moveCommandFavorUp(currentItem.id!)
                toast.success(t`Moved up in Favorites`)
              }
              close()
            }}
            aria-disabled={area.favorCommands.indexOf(currentItem.id!) === 0}
          >
            <Box toCenterY gap2 inlineFlex>
              <div>
                <MoveUp size={16} />
              </div>
              <div>
                <Trans>Move Up in Favorites</Trans>
              </div>
            </Box>
          </ActionCommandItem>
          <ActionCommandItem
            shortcut=""
            onSelect={async () => {
              const idx = area.favorCommands.indexOf(currentItem.id!)
              if (idx > -1 && idx < area.favorCommands.length - 1) {
                await store.area.moveCommandFavorDown(currentItem.id!)
                toast.success(t`Moved down in Favorites`)
              }
              close()
            }}
            aria-disabled={
              area.favorCommands.indexOf(currentItem.id!) ===
              area.favorCommands.length - 1
            }
          >
            <Box toCenterY gap2 inlineFlex>
              <div>
                <MoveDownIcon size={16} />
              </div>
              <div>
                <Trans>Move Down in Favorites</Trans>
              </div>
            </Box>
          </ActionCommandItem>
        </>
      )}

      <ActionCommandItem
        shortcut=""
        onSelect={() => {
          if (isFavor) {
            store.area.removeCommandFromFavorites(currentItem.id!)
            toast.info(t`Removed from Favorites`)
          } else {
            store.area.addCommandToFavorites(currentItem.id!)
            toast.info(t`Added to Favorites`)
          }
          close()
        }}
      >
        <Box toCenterY gap2 inlineFlex>
          <div>
            {isFavor && <StarOffIcon size={16} />}
            {!isFavor && <StarIcon size={16} />}
          </div>
          <div>
            {isFavor ? (
              <Trans>Remove from Favorites</Trans>
            ) : (
              <Trans>Add to Favorites</Trans>
            )}
          </div>
        </Box>
      </ActionCommandItem>

      {isCreation && (
        <ActionCommandItem
          shortcut=""
          onSelect={async () => {
            if (!currentItem.data.creation) return
            try {
              await store.creations.deleteCreation(
                currentItem.data.creation.raw,
              )
              toast.success(t`Creation deleted successfully`)
              setTimeout(() => {
                appEmitter.emit('REFRESH_COMMANDS')
              }, 10)
            } catch (error) {
              toast.error(t`Failed to delete`)
            }
            close()
          }}
        >
          <Box toCenterY gap2 inlineFlex className="text-red-500">
            <div>
              <Trash2Icon />
            </div>
            <div>
              <Trans>Delete Creation</Trans>
            </div>
          </Box>
        </ActionCommandItem>
      )}

      {isStruct && !isBuiltinStruct(struct.type) && (
        <ActionCommandItem
          shortcut=""
          onSelect={async () => {
            if (!struct) return

            try {
              await store.structs.deleteStruct(struct.id)
              toast.success(t`Struct deleted successfully`)
              setTimeout(() => {
                appEmitter.emit('REFRESH_COMMANDS', struct.id)
                reset()
              }, 10)
            } catch (error) {
              console.log('========error:', error)

              toast.error(t`Failed to delete`)
            }
            close()
          }}
        >
          <Box toCenterY gap2 inlineFlex className="text-red-500">
            <div>
              <Trash2Icon />
            </div>
            <div>
              <Trans>Delete Struct</Trans>
            </div>
          </Box>
        </ActionCommandItem>
      )}
    </>
  )
}
