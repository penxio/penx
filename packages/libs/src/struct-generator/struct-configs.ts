import { t } from '@lingui/core/macro'
import { IColumn } from '@penx/model-type'
import { ColumnType, StructType } from '@penx/types'
import { uniqueId } from '@penx/unique-id'

// Base column factory function
export function createBaseColumn(
  slug: string,
  name: string,
  columnType: ColumnType,
  isPrimary = false,
): IColumn {
  return {
    id: uniqueId(),
    slug,
    name,
    description: '',
    columnType,
    config: {},
    options: [],
    isPrimary,
    createdAt: new Date(),
    updatedAt: new Date(),
  }
}

// Select column factory function
export function createSelectColumn(
  slug: string,
  name: string,
  options: Array<{ name: string; color: string; isDefault?: boolean }>,
): IColumn {
  return {
    ...createBaseColumn(slug, name, ColumnType.SINGLE_SELECT),
    options: options.map((option) => ({
      id: uniqueId(),
      ...option,
      isDefault: option.isDefault || false,
    })),
  }
}

// Struct type configuration interface
export interface StructTypeConfig {
  name: string
  columns: IColumn[]
  showDetail?: boolean
  syncable?: boolean
}

export function getStructTypeConfig() {
  // Struct type configurations
  const STRUCT_TYPE_CONFIGS: Record<StructType, StructTypeConfig> = {
    [StructType.PAGE]: {
      name: t`Page`,
      columns: [],
    },

    [StructType.NOTE]: {
      name: t`Note`,
      columns: [],
      showDetail: true,
    },

    [StructType.IMAGE]: {
      name: t`Image`,
      columns: [],
      showDetail: true,
    },

    [StructType.TASK]: {
      name: t`Task`,
      columns: [
        createSelectColumn('status', t`Status`, [
          { name: t`To Do`, color: 'yellow', isDefault: true },
          { name: t`Doing`, color: 'green' },
          { name: t`Done`, color: 'blue' },
        ]),
        createSelectColumn('priority', t`Priority`, [
          { name: t`Low`, color: 'sky' },
          { name: t`Medium`, color: 'yellow' },
          { name: t`High`, color: 'red' },
        ]),
        createBaseColumn('date', t`Date`, ColumnType.DATE),
        createBaseColumn('reminder', t`Reminder`, ColumnType.DATE),
        createBaseColumn('list', t`List`, ColumnType.SINGLE_SELECT),
      ],
      showDetail: true,
    },

    [StructType.VOICE]: {
      name: t`Voice`,
      columns: [],
    },

    [StructType.SNIPPET]: {
      name: t`Snippet`,
      columns: [
        createBaseColumn('content', t`Content`, ColumnType.TEXT),
        createBaseColumn('keyword', t`Keyword`, ColumnType.TEXT),
      ],
      showDetail: true,
    },

    [StructType.QUICK_LINK]: {
      name: t`Quicklink`,
      columns: [
        createBaseColumn('link', t`Link`, ColumnType.URL),
        createBaseColumn('open_with', t`Open with`, ColumnType.TEXT),
      ],
    },

    [StructType.PROMPT]: {
      name: t`Prompt`,
      columns: [
        createBaseColumn('instruction', t`Instruction`, ColumnType.TEXT),
        createBaseColumn('model', t`Model`, ColumnType.SINGLE_SELECT),
      ],
    },

    [StructType.AI_COMMAND]: {
      name: t`AI Command`,
      columns: [
        createBaseColumn('prompt', t`Prompt`, ColumnType.LONG_TEXT),
        createBaseColumn('model', t`Model select`, ColumnType.MODEL_SELECT),
      ],
    },

    [StructType.BOOKMARK]: {
      name: t`Bookmark`,
      columns: [
        createBaseColumn('icon', t`Icon`, ColumnType.URL),
        createBaseColumn('url', t`URL`, ColumnType.URL),
      ],
    },

    [StructType.BROWSER_TAB]: {
      name: t`Browser tab`,
      columns: [
        createBaseColumn('id', t`ID`, ColumnType.NUMBER),
        createBaseColumn('title', t`Title`, ColumnType.TEXT),
        createBaseColumn('url', t`URL`, ColumnType.URL),
        createBaseColumn('active', t`Active`, ColumnType.BOOLEAN),
        createBaseColumn('muted', t`Muted`, ColumnType.BOOLEAN),
        createBaseColumn('pinned', t`Pinned`, ColumnType.BOOLEAN),
        createBaseColumn('lastAccessed', t`Last Accessed`, ColumnType.NUMBER),
        createBaseColumn('index', t`Index`, ColumnType.NUMBER),
      ],
      syncable: false,
    },

    // Unused struct types, provide default configuration
    [StructType.ARTICLE]: {
      name: t`Article`,
      columns: [],
    },

    [StructType.VIDEO]: {
      name: t`Video`,
      columns: [],
    },

    [StructType.AUDIO]: {
      name: t`Audio`,
      columns: [],
    },

    [StructType.FRIEND]: {
      name: t`Friend`,
      columns: [],
    },

    [StructType.PROJECT]: {
      name: t`Project`,
      columns: [],
    },
  }
  return STRUCT_TYPE_CONFIGS
}
