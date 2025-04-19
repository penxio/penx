import { ReactNode } from 'react'
import { WidgetType } from '@penx/constants'
import { Widget } from '@/lib/types'
import { Trans } from '@lingui/react/macro'
import { Mold } from '@penx/db/client'
import { getMoldName } from './getMoldName'

export function getWidgetName(widget: Widget, molds: Mold[] = []): ReactNode {
  if (widget.type === WidgetType.ALL_CREATIONS) {
    return <Trans>All creations</Trans>
  }

  if (widget.type === WidgetType.COLLECTION) {
    return <Trans>Collection</Trans>
  }
  if (widget.type === WidgetType.FAVORITES) {
    return <Trans>Favorites</Trans>
  }
  if (widget.type === WidgetType.RECENTLY_EDITED) {
    return <Trans>Recently edited</Trans>
  }
  if (widget.type === WidgetType.RECENTLY_OPENED) {
    return <Trans>Recently opened</Trans>
  }
  const mold = molds.find((m) => m.id === widget.moldId)
  if (mold) return getMoldName(mold)
  return null
}
