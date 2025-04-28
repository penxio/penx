import { Trans } from '@lingui/react'
import { CreationStatus } from '@penx/db/client'
import { PanelLeft, StarIcon, StarOffIcon, TrashIcon } from 'lucide-react'
import { useAreaContext } from '@penx/components/AreaContext'
import { addToFavorites, removeFromFavorites } from '@penx/hooks/useArea'
import { updateCreation } from '@penx/hooks/useCreation'
import { useCreationMold } from '@penx/hooks/useCreationMold'
import { updateCreationById } from '@penx/hooks/useCreations'
import { addPanel, updateMainPanel, usePanels } from '@penx/hooks/usePanels'
import { ICreation } from '@penx/model/ICreation'
import { CreationType, PanelType, SiteCreation } from '@penx/types'
import { Checkbox } from '@penx/uikit/checkbox'
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from '@penx/uikit/context-menu'
import { uniqueId } from '@penx/unique-id'
import { useIsAllContext } from './IsAllContext'

interface CreationItemProps {
  creation: ICreation
}

export function CreationItem({ creation }: CreationItemProps) {
  const { isCreationInPanels } = usePanels()
  const isAll = useIsAllContext()
  const mold = useCreationMold(creation)

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
              creationId: creation.id,
            })
          }}
        >
          {mold?.type === CreationType.TASK && (
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
              creationId: creation.id,
            })
          }}
        >
          <PanelLeft size={16} />
          <span>
            <Trans id="Open in new panel"></Trans>
          </span>
        </ContextMenuItem>
        <ToggleFavorite creation={creation} />

        <ContextMenuItem disabled>
          <TrashIcon size={16} />
          <span>
            <Trans id="Delete"></Trans>
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
          <Trans id="Remove from favorites"></Trans>
        ) : (
          <Trans id="Add to favorites"></Trans>
        )}
      </span>
    </ContextMenuItem>
  )
}
