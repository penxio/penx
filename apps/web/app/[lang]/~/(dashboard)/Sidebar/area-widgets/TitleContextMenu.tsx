import { FC, PropsWithChildren } from 'react'
import { useAreaContext } from '@/components/AreaContext'
import {
  ContextMenuContent,
  ContextMenuItem,
} from '@penx/ui/components/context-menu'
import { MenuItem } from '@penx/ui/components/menu/MenuItem'
import { Menu } from '@penx/ui/components/menu/Menu'
import { removeWidget } from '@/hooks/useAreaItem'
import { WidgetType } from '@/lib/constants'
import { Widget } from '@/lib/types'
import { Trans } from '@lingui/react/macro'
import { PanelLeft, PencilIcon, Rows4Icon, TrashIcon } from 'lucide-react'

interface Props {
  widget: Widget
  onShowAll: () => void
  onOpenInPanel: () => void
}

export const TitleContextMenu: FC<PropsWithChildren<Props>> = ({
  widget,
  onShowAll,
  onOpenInPanel,
}) => {
  const field = useAreaContext()

  return (
    <ContextMenuContent>
      {widget.type === WidgetType.MOLD && (
        <ContextMenuItem
          onClick={async (e) => {
            onOpenInPanel?.()
          }}
        >
          <PanelLeft size={16} />
          <span>
            <Trans>Open in new panel</Trans>
          </span>
        </ContextMenuItem>
      )}

      <ContextMenuItem
        onClick={async (e) => {
          onShowAll?.()
        }}
      >
        <Rows4Icon size={16} />
        <div>
          <Trans>Show all</Trans>
        </div>
      </ContextMenuItem>
      <ContextMenuItem
        onClick={async (e) => {
          await removeWidget(field.id, widget.id)
        }}
      >
        <TrashIcon size={16} />
        <div>
          <Trans>Delete</Trans>
        </div>
      </ContextMenuItem>
      <ContextMenuItem disabled onClick={async (e) => {}}>
        <PencilIcon size={16} />
        <div>
          <Trans>Rename</Trans>
        </div>
      </ContextMenuItem>
    </ContextMenuContent>
  )
}
