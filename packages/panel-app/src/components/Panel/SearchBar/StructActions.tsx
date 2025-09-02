import { useMemo } from 'react'
import { Box } from '@fower/react'
import { t } from '@lingui/core/macro'
import { Trans } from '@lingui/react/macro'
import {
  CopyIcon,
  EditIcon,
  GlobeIcon,
  ShareIcon,
  Trash2Icon,
} from 'lucide-react'
import { toast } from 'sonner'
import { Creation, Struct } from '@penx/domain'
import { appEmitter } from '@penx/emitter'
import { useCopyToClipboard } from '@penx/hooks/useCopyToClipboard'
import { useCreations } from '@penx/hooks/useCreations'
import { store } from '@penx/store'
import { useCurrentStruct } from '../../../hooks/useCurrentStruct'
import { navigation } from '../../../hooks/useNavigation'
import { useValue } from '../../../hooks/useValue'
import { getBookmarkUrl } from '../../../lib/getBookmarkUrl'
import { ActionCommandItem } from './ActionCommandItem'

interface StructActionsProps {
  close: () => void
}

export function StructActions({ close }: StructActionsProps) {
  const { value } = useValue()
  const { struct: raw } = useCurrentStruct()
  const { creations } = useCreations()
  const { copy } = useCopyToClipboard()
  const creation = creations.find((item) => {
    return item.id === value
  })

  const struct = new Struct(raw)

  const url = useMemo(() => {
    return getBookmarkUrl(struct, creation!)
  }, [struct, creation])

  return (
    <>
      {struct.isBookmark && (
        <ActionCommandItem
          shortcut=""
          onSelect={() => {
            window.electron.ipcRenderer.send('open-url', url)
            close()
          }}
        >
          <Box toCenterY gap2 inlineFlex>
            <div className="">
              <GlobeIcon size={16} />
            </div>
            <div>
              <Trans>Open in browser</Trans>
            </div>
          </Box>
        </ActionCommandItem>
      )}

      <ActionCommandItem
        shortcut=""
        onSelect={() => {
          navigation.push({ path: '/edit-creation' })
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
      <ActionCommandItem
        shortcut=""
        onSelect={() => {
          const creations = store.creations.get()
          const creation = creations.find((c) => c.id === value)!
          copy(creation.id)
          toast.info(t`Copy ID to clipboard`)
          close()
        }}
      >
        <Box toCenterY gap2 inlineFlex>
          <div className="">
            <CopyIcon size={16} />
          </div>
          <div>
            <Trans>Copy ID</Trans>
          </div>
        </Box>
      </ActionCommandItem>
      <ActionCommandItem
        shortcut=""
        onSelect={() => {
          toast.info('Coming soon~')
          close()
        }}
      >
        <Box toCenterY gap2 inlineFlex>
          <div>
            <ShareIcon size={16} />
          </div>
          <div>
            <Trans>Share</Trans>
          </div>
        </Box>
      </ActionCommandItem>
      <ActionCommandItem
        shortcut=""
        className="text-red-500"
        onSelect={() => {
          const creations = store.creations.get()
          const creation = creations.find((c) => c.id === value)!
          store.creations.deleteCreation(creation)
          close()
          setTimeout(() => {
            appEmitter.emit('DELETE_CREATION_SUCCESS', creation.id)
          }, 0)
        }}
      >
        <Box toCenterY gap2 inlineFlex>
          <div>
            <Trash2Icon size={16} />
          </div>
          <div>
            <Trans>Delete record</Trans>
          </div>
        </Box>
      </ActionCommandItem>
    </>
  )
}
