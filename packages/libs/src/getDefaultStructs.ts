import { t } from '@lingui/core/macro'
import { defaultEditorContent } from '@penx/constants'
import { IColumn, IStructNode, IView, NodeType } from '@penx/model-type'
import { ColumnType, StructType, ViewColumn, ViewType } from '@penx/types'
import { uniqueId } from '@penx/unique-id'
import { getRandomColorName } from './color-helper'

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

  let columns: IColumn[] = []

  if (!props.columns) {
    columns = [
      {
        id: uniqueId(),
        // slug: uniqueId(),
        slug: 'title',
        name: t`Title`,
        description: '',
        columnType: ColumnType.PRIMARY,
        config: {},
        options: [],
        isPrimary: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]

    if (type === StructType.TASK) {
      columns.push(
        ...[
          {
            id: uniqueId(),
            slug: 'status',
            name: t`Status`,
            description: '',
            columnType: ColumnType.SINGLE_SELECT,
            config: {},
            options: [
              {
                id: uniqueId(),
                name: t`To Do`,
                color: 'yellow',
                isDefault: true,
              },
              {
                id: uniqueId(),
                name: t`Doing`,
                color: 'green',
                isDefault: false,
              },
              {
                id: uniqueId(),
                name: t`Done`,
                color: 'blue',
                isDefault: false,
              },
            ],
            isPrimary: false,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            id: uniqueId(),
            slug: 'priority',
            name: t`Priority`,
            description: '',
            columnType: ColumnType.SINGLE_SELECT,
            config: {},
            options: [
              {
                id: uniqueId(),
                name: t`Low`,
                color: 'sky',
                isDefault: false,
              },
              {
                id: uniqueId(),
                name: t`Medium`,
                color: 'yellow',
                isDefault: false,
              },
              {
                id: uniqueId(),
                name: t`High`,
                color: 'red',
                isDefault: false,
              },
            ],
            isPrimary: false,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            id: uniqueId(),
            slug: 'date',
            name: t`Date`,
            description: '',
            columnType: ColumnType.DATE,
            config: {},
            options: [],
            isPrimary: false,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            id: uniqueId(),
            slug: 'reminder',
            name: t`Reminder`,
            description: '',
            columnType: ColumnType.DATE,
            config: {},
            options: [],
            isPrimary: false,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            id: uniqueId(),
            slug: 'list',
            name: t`List`,
            description: '',
            columnType: ColumnType.SINGLE_SELECT,
            config: {},
            options: [],
            isPrimary: false,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ],
      )
    }

    if (type === StructType.BOOKMARK) {
      columns.push(
        ...[
          {
            id: uniqueId(),
            slug: 'icon',
            name: t`Icon`,
            description: '',
            columnType: ColumnType.URL,
            config: {},
            options: [],
            isPrimary: false,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            id: uniqueId(),
            slug: 'url',
            name: t`URL`,
            description: '',
            columnType: ColumnType.URL,
            config: {},
            options: [],
            isPrimary: false,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ],
      )
    }

    if (type === StructType.PROMPT) {
      columns.push(
        ...[
          {
            id: uniqueId(),
            slug: 'instruction',
            name: t`Instruction`,
            description: '',
            columnType: ColumnType.TEXT,
            config: {},
            options: [],
            isPrimary: false,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            id: uniqueId(),
            slug: 'model',
            name: t`Model`,
            description: '',
            columnType: ColumnType.SINGLE_SELECT,
            config: {},
            options: [],
            isPrimary: false,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ],
      )
    }

    if (type === StructType.SNIPPET) {
      columns.push(
        ...[
          {
            id: uniqueId(),
            slug: 'content',
            name: t`Content`,
            description: '',
            columnType: ColumnType.TEXT,
            config: {},
            options: [],
            isPrimary: false,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            id: uniqueId(),
            slug: 'keyword',
            name: t`Keyword`,
            description: '',
            columnType: ColumnType.TEXT,
            config: {},
            options: [],
            isPrimary: false,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ],
      )
    }

    if (type === StructType.QUICK_LINK) {
      columns.push(
        ...[
          {
            id: uniqueId(),
            slug: 'link',
            name: t`Link`,
            description: '',
            columnType: ColumnType.URL,
            config: {},
            options: [],
            isPrimary: false,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            id: uniqueId(),
            slug: 'open_with',
            name: t`Open with`,
            description: '',
            columnType: ColumnType.TEXT,
            config: {},
            options: [],
            isPrimary: false,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ],
      )
    }
  }

  const viewColumns: ViewColumn[] = columns.map((column) => ({
    columnId: column.id,
    width: 160,
    visible: true,
  }))

  const views: IView[] = [
    {
      id: uniqueId(),
      name: t`Table`,
      viewType: ViewType.TABLE,
      viewColumns,
      description: '',
      kanbanColumnId: '',
      sorts: [],
      filters: [],
      groups: [],
      kanbanOptionIds: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: uniqueId(),
      name: t`Gallery`,
      viewType: ViewType.GALLERY,
      viewColumns,
      description: '',
      kanbanColumnId: '',
      sorts: [],
      filters: [],
      groups: [],
      kanbanOptionIds: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: uniqueId(),
      name: t`List`,
      viewType: ViewType.LIST,
      viewColumns,
      description: '',
      kanbanColumnId: '',
      sorts: [],
      filters: [],
      groups: [],
      kanbanOptionIds: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]

  const struct: IStructNode = {
    id: props.id || uniqueId(),
    type: NodeType.STRUCT,
    props: {
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

export function getDefaultStructs(input: MetaInfo): IStructNode[] {
  return [
    generateStructNode({
      type: StructType.PAGE,
      name: t`Page`,
      ...input,
    }),
    // {
    //   id: uniqueId(),
    //   name: 'Articles',
    //   description: '',
    //   type: StructType.ARTICLE,
    //   props: [],
    //   content: JSON.stringify(defaultEditorContent),
    //   createdAt: new Date(),
    //   updatedAt: new Date(),
    //   ...input,
    // },

    generateStructNode({
      type: StructType.NOTE,
      name: t`Note`,
      ...input,
    }),

    generateStructNode({
      type: StructType.IMAGE,
      name: t`Image`,
      ...input,
    }),

    // {
    //   id: uniqueId(),
    //   name: 'Podcasts',
    //   description: '',
    //   type: StructType.AUDIO,
    //   props: [],
    //   content: JSON.stringify(defaultEditorContent),
    //   createdAt: new Date(),
    //   updatedAt: new Date(),
    //   ...input,
    // },

    generateStructNode({
      type: StructType.TASK,
      name: t`Task`,
      ...input,
    }),

    generateStructNode({
      type: StructType.VOICE,
      name: t`Voice`,
      ...input,
    }),
    generateStructNode({
      type: StructType.SNIPPET,
      name: t`Snippet`,
      ...input,
    }),
    generateStructNode({
      type: StructType.QUICK_LINK,
      name: t`Quicklink`,
      ...input,
    }),
    generateStructNode({
      type: StructType.PROMPT,
      name: t`Prompt`,
      ...input,
    }),

    generateStructNode({
      type: StructType.BOOKMARK,
      name: t`Bookmark`,
      ...input,
    }),
    // {
    //   id: uniqueId(),
    //   name: 'Friends',
    //   description: '',
    //   type: StructType.FRIEND,
    //   props: [
    //     {
    //       id: uniqueId(),
    //       name: 'Avatar',
    //       slug: 'avatar',
    //       type: PropType.IMAGE,
    //     },
    //     { id: uniqueId(), name: 'URL', slug: 'url', type: PropType.URL },
    //     {
    //       id: uniqueId(),
    //       name: 'Status',
    //       slug: 'status',
    //       type: PropType.SINGLE_SELECT,
    //       options: [
    //         { name: 'pending', color: 'amber' },
    //         { name: 'rejected', color: 'red' },
    //         { name: 'approved', color: 'emerald' },
    //       ],
    //     },
    //   ] as Prop[],
    //   content: JSON.stringify(defaultEditorContent),
    //   createdAt: new Date(),
    //   updatedAt: new Date(),
    //   ...input,
    // },

    // {
    //   id: uniqueId(),
    //   name: 'Projects',
    //   description: '',
    //   type: StructType.PROJECT,
    //   props: [
    //     { id: uniqueId(), name: 'Icon', slug: 'icon', type: PropType.IMAGE },
    //     { id: uniqueId(), name: 'Cover', slug: 'cover', type: PropType.IMAGE },
    //     { id: uniqueId(), name: 'URL', slug: 'url', type: PropType.URL },
    //   ] as Prop[],
    //   content: JSON.stringify(defaultEditorContent),
    //   createdAt: new Date(),
    //   updatedAt: new Date(),
    //   ...input,
    // },
  ] as IStructNode[]
}
