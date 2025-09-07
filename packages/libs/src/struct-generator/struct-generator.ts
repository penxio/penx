import { t } from '@lingui/core/macro'
import { defaultEditorContent } from '@penx/constants'
import { IColumn, IStructNode, IView, NodeType } from '@penx/model-type'
import { ColumnType, StructType } from '@penx/types'
import { uniqueId } from '@penx/unique-id'
import { getRandomColorName } from '../color-helper'
import { createBaseColumn, getStructTypeConfig } from './struct-configs'
import { createDefaultViews, createViewColumns } from './view-factory'

type MetaInfo = {
  id?: string
  spaceId: string
  userId: string
  areaId: string
}

export function generateStructNode({
  spaceId,
  userId,
  areaId,
  ...props
}: Partial<IStructNode['props']> & MetaInfo) {
  const { type, name } = props

  if (!type) {
    throw new Error('Struct type is required')
  }

  // Get column definitions
  const columns = getColumnsForStructType(
    type as StructType,
    props?.columns as IColumn[],
  )

  // Create views
  const viewColumns = createViewColumns(columns.map((col) => col.id))
  const views = createDefaultViews(viewColumns)

  const struct: IStructNode = {
    id: props.id || uniqueId(),
    type: NodeType.STRUCT,
    props: {
      syncable: true,
      ...props,
      name: props.name!,
      pluralName: `${name}s`,
      description: '',
      type: props.type!,
      about: JSON.stringify(defaultEditorContent),
      color: getRandomColorName(),
      activeViewId: views[0].id,
      viewIds: views.map((view) => view.id),
      columns,
      views,
    },
    createdAt: new Date(),
    updatedAt: new Date(),
    areaId: areaId,
    userId,
    spaceId,
  }
  return struct
}

// Get column definitions based on struct type
function getColumnsForStructType(
  type: StructType,
  customColumns?: IColumn[],
): IColumn[] {
  // If custom columns are provided, use them directly
  if (customColumns?.length) {
    return customColumns
  }

  // Get configuration
  const config = getStructTypeConfig()[type]
  if (!config) {
    throw new Error(`Unknown struct type: ${type}`)
  }

  // Build column array: default title column + type-specific columns
  return [
    createBaseColumn('title', t`Title`, ColumnType.PRIMARY, true),
    ...config.columns,
  ]
}

// Default struct type configuration
const DEFAULT_STRUCT_TYPES = [
  StructType.PAGE,
  StructType.NOTE,
  StructType.IMAGE,
  StructType.TASK,
  StructType.VOICE,
  StructType.SNIPPET,
  StructType.QUICK_LINK,
  StructType.PROMPT,
  StructType.AI_COMMAND,
  StructType.BOOKMARK,
  StructType.BROWSER_TAB,
] as const

export function getDefaultStructs(input: MetaInfo): IStructNode[] {
  return DEFAULT_STRUCT_TYPES.map((structType) => {
    const config = getStructTypeConfig()[structType]
    return generateStructNode({
      type: structType,
      name: config.name,
      showDetail: config.showDetail ?? false,
      syncable: config.syncable ?? true,
      ...input,
    })
  })
}
