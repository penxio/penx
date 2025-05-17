import { editorDefaultValue } from '@penx/constants'
import { IColumn, IStructNode, IView, NodeType } from '@penx/model-type'
import {
  ColumnType,
  CreationType,
  Prop,
  PropType,
  ViewColumn,
  ViewType,
} from '@penx/types'
import { uniqueId } from '@penx/unique-id'
import { getRandomColorName } from './color-helper'

type Input = {
  siteId: string
  userId: string
}

function getStructNode(
  type: string,
  name: string,
  input: Input,
  props: Prop[] = [],
) {
  const columns: IColumn[] = [
    {
      id: uniqueId(),
      slug: uniqueId(),
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
  ]

  return {
    id: uniqueId(),
    type: NodeType.STRUCT,
    props: {
      name,
      pluralName: `${name}s`,
      description: '',
      type,
      props,
      content: JSON.stringify(editorDefaultValue),
      color: getRandomColorName(),
      activeViewId: views[0].id,
      viewIds: views.map((view) => view.id),
      columns,
      views,
    },
    createdAt: new Date(),
    updatedAt: new Date(),
    ...input,
  } as IStructNode
}

export function getDefaultStructs(input: Input): IStructNode[] {
  return [
    getStructNode(CreationType.PAGE, 'Page', input),
    // {
    //   id: uniqueId(),
    //   name: 'Articles',
    //   description: '',
    //   type: CreationType.ARTICLE,
    //   props: [],
    //   content: JSON.stringify(editorDefaultValue),
    //   createdAt: new Date(),
    //   updatedAt: new Date(),
    //   ...input,
    // },

    getStructNode(CreationType.NOTE, 'Note', input),
    // {
    //   id: uniqueId(),
    //   name: 'Images',
    //   description: '',
    //   type: CreationType.IMAGE,
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
    //   type: CreationType.AUDIO,
    //   props: [],
    //   content: JSON.stringify(editorDefaultValue),
    //   createdAt: new Date(),
    //   updatedAt: new Date(),
    //   ...input,
    // },

    getStructNode(CreationType.TASK, 'Task', input),

    getStructNode(CreationType.BOOKMARK, 'Bookmark', input, [
      { id: uniqueId(), name: 'URL', slug: 'url', type: PropType.URL },
    ]),
    // {
    //   id: uniqueId(),
    //   name: 'Friends',
    //   description: '',
    //   type: CreationType.FRIEND,
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
    //   type: CreationType.PROJECT,
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
