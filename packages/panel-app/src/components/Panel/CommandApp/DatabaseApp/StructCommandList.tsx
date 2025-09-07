import { useMemo } from 'react'
import { PlusIcon } from 'lucide-react'
import { Creation, Struct } from '@penx/domain'
import { appEmitter } from '@penx/emitter'
import { updateCreationProps } from '@penx/hooks/useCreation'
import { getCreationFields } from '@penx/libs/getCreationFields'
import { Button } from '@penx/uikit/ui/button'
import { Checkbox } from '@penx/uikit/ui/checkbox'
import { cn } from '@penx/utils'
import { useFilterPopover } from '../../../../hooks/useFilterPopover'
import { navigation } from '../../../../hooks/useNavigation'
import { creationToCommand } from '../../../../lib/creationToCommand'
import { getBookmarkIcon } from '../../../../lib/getBookmarkIcon'
import { getBookmarkUrl } from '../../../../lib/getBookmarkUrl'
import { hidePanelWindow } from '../../../../lib/hidePanelWindow'
import { CommandGroup } from '../../CommandComponents'
import { getLabel } from '../../FilterPopover'
import { ListItemUI } from '../../ListItemUI'
import { BookmarkIcon } from './BookmarkIcon'

interface Props {
  struct: Struct
  creations: Creation[]
}

export function StructCommandList({ creations, struct }: Props) {
  return (
    <CommandGroup
      className={cn(
        'm-0 flex-[2] overflow-auto px-2 pb-2 pt-0',
        !struct.isTask && 'mt-2',
      )}
      style={{
        overscrollBehavior: 'contain',
        scrollPaddingBlockStart: 8,
        scrollPaddingBlockEnd: 8,
        position: 'relative',
      }}
    >
      {creations.map((item, index) => {
        // console.log('========item:', item)

        return (
          <ListItemUI
            key={index}
            showType={false}
            onSelect={() => {
              if (struct.isBookmark) {
                const url = getBookmarkUrl(struct, item)
                window.electron.ipcRenderer.send('open-url', url)
                hidePanelWindow()
                return
              }

              if (struct.isAICommand) {
                navigation.push({ path: '/ai-command' })
                return
              }

              if (struct.isBrowserTab) {
                const fields = getCreationFields(struct, item)
                console.log('=======fields:', fields)
                appEmitter.emit('OPEN_BROWSER_TAB', fields)
                return
              }

              navigation.push({ path: '/edit-creation' })
            }}
            prefix={
              item.isTask ? (
                <Checkbox
                  onClick={(e) => e.stopPropagation()}
                  checked={item.checked}
                  onCheckedChange={(v) => {
                    updateCreationProps(item.id, {
                      checked: v as any,
                    })
                  }}
                />
              ) : null
            }
            index={index}
            icon={
              struct.isBookmark ? (
                <BookmarkIcon struct={struct} creation={item} />
              ) : undefined
            }
            value={item.id}
            item={creationToCommand(item)}
          />
        )
      })}
    </CommandGroup>
  )
}
