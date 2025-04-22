import { FC, PropsWithChildren } from 'react'
import { Trans } from '@lingui/react'
import { PanelLeft, PencilIcon, Rows4Icon, TrashIcon } from 'lucide-react'
import { useAreaContext } from '@penx/components/AreaContext'
import { WidgetType } from '@penx/constants'
import { removeWidget } from '@penx/hooks/useArea'
import { Widget } from '@penx/types'
import {
  ContextMenuContent,
  ContextMenuItem,
} from '@penx/uikit/ui/context-menu'
import { Menu } from '@penx/uikit/ui/menu/Menu'
import { MenuItem } from '@penx/uikit/ui/menu/MenuItem'

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
  const area = useAreaContext()

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
            <Trans id="Open in new panel"></Trans>
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
          <Trans id="Show all"></Trans>
        </div>
      </ContextMenuItem>
      <ContextMenuItem
        onClick={async (e) => {
          await removeWidget(area.id, widget.id)
        }}
      >
        <TrashIcon size={16} />
        <div>
          <Trans id="Delete"></Trans>
        </div>
      </ContextMenuItem>
      <ContextMenuItem disabled onClick={async (e) => {}}>
        <PencilIcon size={16} />
        <div>
          <Trans id="Rename"></Trans>
        </div>
      </ContextMenuItem>
    </ContextMenuContent>
  )
}
