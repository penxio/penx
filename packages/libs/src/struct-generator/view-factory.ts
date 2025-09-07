import { t } from '@lingui/core/macro'
import { IView } from '@penx/model-type'
import { ViewType } from '@penx/types'
import { uniqueId } from '@penx/unique-id'
import { ViewColumn } from '@penx/types'

// View factory function
export function createView(
  name: string,
  viewType: ViewType,
  viewColumns: ViewColumn[]
): IView {
  return {
    id: uniqueId(),
    name,
    viewType,
    viewColumns,
    description: '',
    kanbanColumnId: '',
    sorts: [],
    filters: [],
    groups: [],
    kanbanOptionIds: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  }
}

// Create default view collection
export function createDefaultViews(viewColumns: ViewColumn[]): IView[] {
  return [
    createView(t`Table`, ViewType.TABLE, viewColumns),
    createView(t`Gallery`, ViewType.GALLERY, viewColumns),
    createView(t`List`, ViewType.LIST, viewColumns),
  ]
}

// Create view columns
export function createViewColumns(columnIds: string[]): ViewColumn[] {
  return columnIds.map(columnId => ({
    columnId,
    width: 160,
    visible: true,
  }))
}
