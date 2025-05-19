import { Trans } from '@lingui/react'
import {
  BookmarkIcon,
  FileIcon,
  FileTextIcon,
  PanelLeft,
  StarIcon,
  StarOffIcon,
  TrashIcon,
} from 'lucide-react'
import { Node } from 'slate'
import { isMobileApp } from '@penx/constants'
import { CreationStatus } from '@penx/db/client'
import { Creation } from '@penx/domain'
import { appEmitter } from '@penx/emitter'
import { useArea } from '@penx/hooks/useArea'
import { updateCreation } from '@penx/hooks/useCreation'
import { creationIdAtom, useCreationId } from '@penx/hooks/useCreationId'
import { useCreationStruct } from '@penx/hooks/useCreationStruct'
import { usePanels } from '@penx/hooks/usePanels'
import { ICreationNode } from '@penx/model-type'
import { store } from '@penx/store'
import { CreationType, PanelType, SiteCreation } from '@penx/types'
import { Checkbox } from '@penx/uikit/checkbox'
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from '@penx/uikit/context-menu'
import { uniqueId } from '@penx/unique-id'
import { cn } from '@penx/utils'

interface CreationItemProps {
  creation: Creation
  className?: string
}

export function CreationItem({ creation, className }: CreationItemProps) {
  const struct = useCreationStruct(creation)

  const getTitleFromContent = () => {
    try {
      const json: any[] = JSON.parse(creation.content)
      const title = json.map((item) => Node.string(item)).join(', ')
      return title.slice(0, 30)
    } catch (error) {
      return ''
    }
  }

  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <div
          key={creation.id}
          className={cn(
            'hover:bg-foreground/5 group -mx-2 flex h-7 cursor-pointer items-center gap-2 rounded pl-2 pr-1 transition-all',
            className,
          )}
          onClick={() => {
            if (isMobileApp) {
              appEmitter.emit('ROUTE_TO_CREATION', creation)
              store.set(creationIdAtom, creation.id)
              return
            }

            store.panels.updateMainPanel({
              id: uniqueId(),
              type: PanelType.CREATION,
              creationId: creation.id,
            })
          }}
        >
          {[CreationType.PAGE, CreationType.NOTE].includes(
            struct?.type as CreationType,
          ) && <FileIcon size={16} className="text-foreground/60" />}

          {[CreationType.BOOKMARK].includes(struct?.type as CreationType) && (
            <BookmarkIcon size={16} className="text-foreground/60" />
          )}

          {struct?.type === CreationType.TASK && (
            <Checkbox
              onClick={(e) => e.stopPropagation()}
              checked={creation.checked}
              onCheckedChange={(v) => {
                updateCreation({
                  id: creation.id,
                  checked: v as any,
                })
              }}
            />
          )}
          <div
            className={cn(
              'text-foreground/80 line-clamp-1 flex-1 text-base font-medium',
              isMobileApp && 'text-base',
            )}
          >
            {creation.title || getTitleFromContent() || 'Untitled'}
          </div>
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem
          onClick={() => {
            store.panels.addPanel({
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

function ToggleFavorite({ creation }: CreationItemProps) {
  const { area } = useArea()
  const isFavor = area.favorites?.includes(creation.id)
  return (
    <ContextMenuItem
      onClick={async () => {
        if (isFavor) {
          await store.area.removeFromFavorites(creation.id)
        } else {
          await store.area.addToFavorites(creation.id)
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
