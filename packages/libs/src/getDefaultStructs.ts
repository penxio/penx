import { editorDefaultValue } from '@penx/constants'
import { IColumn, IStructNode, IView, NodeType } from '@penx/model-type'
import { ColumnType, StructType, ViewColumn, ViewType } from '@penx/types'
import { uniqueId } from '@penx/unique-id'
import { getRandomColorName } from './color-helper'

type Input = {
  siteId: string
  userId: string
}

export function generateStructNode(type: string, name: string, input: Input) {
  const columns: IColumn[] = [
    {
      id: uniqueId(),
      // slug: uniqueId(),
      slug: 'title',
      name: 'Title',
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
          name: 'Status',
          description: '',
          columnType: ColumnType.SINGLE_SELECT,
          config: {},
          options: [
            {
              id: uniqueId(),
              name: 'To Do',
              color: getRandomColorName(),
              isDefault: true,
            },
            {
              id: uniqueId(),
              name: 'Doing',
              color: getRandomColorName(),
              isDefault: false,
            },
            {
              id: uniqueId(),
              name: 'Done',
              color: getRandomColorName(),
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
          name: 'Priority',
          description: '',
          columnType: ColumnType.SINGLE_SELECT,
          config: {},
          options: [
            {
              id: uniqueId(),
              name: 'Low',
              color: getRandomColorName(),
              isDefault: false,
            },
            {
              id: uniqueId(),
              name: 'Medium',
              color: getRandomColorName(),
              isDefault: true,
            },
            {
              id: uniqueId(),
              name: 'High',
              color: getRandomColorName(),
              isDefault: false,
            },
          ],
          isPrimary: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: uniqueId(),
          slug: 'dueDate',
          name: 'Due date',
          description: '',
          columnType: ColumnType.DATE,
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
    columns.push({
      id: uniqueId(),
      slug: 'url',
      name: 'URL',
      description: '',
      columnType: ColumnType.URL,
      config: {},
      options: [],
      isPrimary: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
  }

  const viewColumns: ViewColumn[] = columns.map((column) => ({
    columnId: column.id,
    width: 160,
    visible: true,
  }))

  const views: IView[] = [
    {
      id: uniqueId(),
      name: 'Table',
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
      name: 'Gallery',
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
      name: 'List',
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
    id: uniqueId(),
    type: NodeType.STRUCT,
    props: {
      name,
      pluralName: `${name}s`,
      description: '',
      type,
      about: JSON.stringify(editorDefaultValue),
      color: getRandomColorName(),
      activeViewId: views[0].id,
      viewIds: views.map((view) => view.id),
      columns,
      views,
    },
    createdAt: new Date(),
    updatedAt: new Date(),
    ...input,
  }
  return struct
}

export function getDefaultStructs(input: Input): IStructNode[] {
  return [
    generateStructNode(StructType.PAGE, 'Page', input),
    // {
    //   id: uniqueId(),
    //   name: 'Articles',
    //   description: '',
    //   type: StructType.ARTICLE,
    //   props: [],
    //   content: JSON.stringify(editorDefaultValue),
    //   createdAt: new Date(),
    //   updatedAt: new Date(),
    //   ...input,
    // },

    generateStructNode(StructType.NOTE, 'Note', input),
    // {
    //   id: uniqueId(),
    //   name: 'Images',
    //   description: '',
    //   type: StructType.IMAGE,
    //   props: [],
    //   content: JSON.stringify(editorDefaultValue),
    //   createdAt: new Date(),
    //   updatedAt: new Date(),
    //   ...input,
    // },
    // {
    //   id: uniqueId(),
    //   name: 'Podcasts',
    //   description: '',
    //   type: StructType.AUDIO,
    //   props: [],
    //   content: JSON.stringify(editorDefaultValue),
    //   createdAt: new Date(),
    //   updatedAt: new Date(),
    //   ...input,
    // },

    generateStructNode(StructType.TASK, 'Task', input),

    generateStructNode(StructType.BOOKMARK, 'Bookmark', input),
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
    //   content: JSON.stringify(editorDefaultValue),
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
    //   content: JSON.stringify(editorDefaultValue),
    //   createdAt: new Date(),
    //   updatedAt: new Date(),
    //   ...input,
    // },
  ] as IStructNode[]
}
