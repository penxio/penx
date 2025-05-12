import { Trans } from '@lingui/react'
import { WidgetType } from '@penx/constants'
import { Mold } from '@penx/domain'
import { Widget } from '@penx/types'
import { MoldName } from './MoldName'

interface Props {
  widget: Widget
  molds: Mold[]
}

export function WidgetName({ widget, molds }: Props) {
  if (widget.type === WidgetType.ALL_CREATIONS) {
    return <Trans id="All creations"></Trans>
  }

  if (widget.type === WidgetType.COLLECTION) {
    return <Trans id="Collection"></Trans>
  }

  if (widget.type === WidgetType.FAVORITES) {
    return <Trans id="Favorites"></Trans>
  }
  if (widget.type === WidgetType.RECENTLY_EDITED) {
    return <Trans id="Recently edited"></Trans>
  }
  if (widget.type === WidgetType.AI_CHAT) {
    return <Trans id="AI chat"></Trans>
  }
  if (widget.type === WidgetType.RECENTLY_OPENED) {
    return <Trans id="Recently opened"></Trans>
  }
  const mold = molds.find((m) => m.id === widget.moldId)
  if (mold) return <MoldName mold={mold!} />
  return null
}
