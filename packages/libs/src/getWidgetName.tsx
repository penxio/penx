import { ReactNode } from 'react'
import { Trans } from '@lingui/react'
import { Mold } from '@penx/db/client'
import { WidgetType } from '@penx/constants'
import { Widget } from '@penx/types'
import { getMoldName } from './getMoldName'

export function getWidgetName(widget: Widget, molds: Mold[] = []): ReactNode {
  if (widget.type === WidgetType.ALL_CREATIONS) {
    return <Trans id="all_creations" message="All creations"></Trans>
  }

  if (widget.type === WidgetType.COLLECTION) {
    return <Trans id="collection" message="Collection"></Trans>
  }
  if (widget.type === WidgetType.FAVORITES) {
    return <Trans id="favorites" message="Favorites"></Trans>
  }
  if (widget.type === WidgetType.RECENTLY_EDITED) {
    return <Trans id="recently_edited" message="Recently edited"></Trans>
  }
  if (widget.type === WidgetType.RECENTLY_OPENED) {
    return <Trans id="recently_opened" message="Recently opened"></Trans>
  }
  const mold = molds.find((m) => m.id === widget.moldId)
  if (mold) return getMoldName(mold)
  return null
}
