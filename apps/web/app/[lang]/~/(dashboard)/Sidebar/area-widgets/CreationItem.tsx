import { useAreaContext } from '@/components/AreaContext'
import { Checkbox } from '@/components/ui/checkbox'
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from '@/components/ui/context-menu'
import { updateCreationById } from '@/hooks/useAreaCreations'
import { addToFavorites, removeFromFavorites } from '@/hooks/useAreaItem'
import { updateCreation } from '@/hooks/useCreation'
import { addPanel, updateMainPanel, usePanels } from '@/hooks/usePanels'
import { CreationType } from '@/lib/theme.types'
import { PanelType, SiteCreation } from '@/lib/types'
import { uniqueId } from '@/lib/unique-id'
import { Trans } from '@lingui/react/macro'
import { CreationStatus } from '@penx/db/client'
import { PanelLeft, StarIcon, StarOffIcon, TrashIcon } from 'lucide-react'
import { useIsAllContext } from './IsAllContext'

interface CreationItemProps {
  creation: SiteCreation
}

export function CreationItem({ creation }: CreationItemProps) {
  const { isCreationInPanels } = usePanels()
  const isAll = useIsAllContext()

  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <div
          key={creation.id}
          className="hover:bg-foreground/5 group flex h-7 cursor-pointer items-center gap-2 rounded py-1 pl-2 pr-1 transition-all"
          onClick={() => {
            updateMainPanel({
              id: uniqueId(),
              type: PanelType.CREATION,
              creation: creation,
            })
          }}
        >
          {creation.mold?.type === CreationType.TASK && (
            <Checkbox
              onClick={(e) => e.stopPropagation()}
              checked={creation.checked}
              onCheckedChange={(v) => {
                updateCreation({
                  id: creation.id,
                  checked: v as any,
                })
                updateCreationById(creation.areaId!, creation.id, {
                  checked: v as any,
                })
                //
              }}
            />
          )}
          <div className="line-clamp-1 flex-1 text-sm">
            {creation.title || 'Untitled'}
          </div>
          {isAll && creation.status === CreationStatus.PUBLISHED && (
            <div className="size-1 rounded-full bg-green-500 text-xs opacity-50"></div>
          )}
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem
          onClick={() => {
            addPanel({
              id: uniqueId(),
              type: PanelType.CREATION,
              creation: creation,
            })
          }}
        >
          <PanelLeft size={16} />
          <span>
            <Trans>Open in new panel</Trans>
          </span>
        </ContextMenuItem>
        <ToggleFavorite creation={creation} />

        <ContextMenuItem disabled>
          <TrashIcon size={16} />
          <span>
            <Trans>Delete</Trans>
          </span>
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  )
}

function ToggleFavorite({ creation: post }: CreationItemProps) {
  const field = useAreaContext()
  const isFavor = field.favorites?.includes(post.id)
  return (
    <ContextMenuItem
      onClick={async () => {
        if (isFavor) {
          await removeFromFavorites(field.id, post.id)
        } else {
          await addToFavorites(field.id, post.id)
        }
      }}
    >
      {isFavor && <StarOffIcon size={16} />}
      {!isFavor && <StarIcon size={16} />}

      <span>
        {isFavor ? (
          <Trans>Remove from favorites</Trans>
        ) : (
          <Trans>Add to favorites</Trans>
        )}
      </span>
    </ContextMenuItem>
  )
}
