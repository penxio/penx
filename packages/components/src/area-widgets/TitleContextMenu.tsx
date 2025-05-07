import { FC, PropsWithChildren } from 'react'
import { Trans } from '@lingui/react'
import { PanelLeft, PencilIcon, Rows4Icon, TrashIcon } from 'lucide-react'
import { WidgetType } from '@penx/constants'
import { useArea } from '@penx/hooks/useArea'
import { store } from '@penx/store'
import { Widget } from '@penx/types'
import { ContextMenuContent, ContextMenuItem } from '@penx/uikit/context-menu'
import { Menu, MenuItem } from '@penx/uikit/menu'

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
  const { area } = useArea()

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
          await store.area.removeWidget(widget.id)
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
