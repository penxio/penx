import { editorDefaultValue } from '@penx/constants'
import { IStructNode, NodeType } from '@penx/model-type'
import { CreationType, Prop, PropType } from '@penx/types'
import { uniqueId } from '@penx/unique-id'

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
