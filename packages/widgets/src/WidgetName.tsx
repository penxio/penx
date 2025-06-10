import { Trans } from '@lingui/react/macro'
import { WidgetType } from '@penx/constants'
import { Struct } from '@penx/domain'
import { Widget } from '@penx/types'
import { StructName } from './StructName'

interface Props {
  widget: Widget
  structs: Struct[]
}

export function WidgetName({ widget, structs }: Props) {
  if (widget.type === WidgetType.JOURNAL) {
    return <Trans>Journals</Trans>
  }

  if (widget.type === WidgetType.ALL_CREATIONS) {
    return <Trans>All creations</Trans>
  }

  if (widget.type === WidgetType.ALL_STRUCTS) {
    return <Trans>My structs</Trans>
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
  if (widget.type === WidgetType.AI_CHAT) {
    return <Trans>AI chat</Trans>
  }
  if (widget.type === WidgetType.RECENTLY_OPENED) {
    return <Trans>Recently opened</Trans>
  }
  const struct = structs.find((m) => m.id === widget.structId)
  if (struct) return <StructName struct={struct!} />
  return null
}
