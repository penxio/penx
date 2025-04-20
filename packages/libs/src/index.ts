import { v4 } from 'uuid'
import { WidgetType } from '@penx/constants'
import { Widget } from '@penx/types'

export function uniqueId() {
  return v4()
}
