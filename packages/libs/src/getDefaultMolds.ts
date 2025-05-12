import { editorDefaultValue } from '@penx/constants'
import { IMoldNode, NodeType } from '@penx/model-type'
import { CreationType, Prop, PropType } from '@penx/types'
import { uniqueId } from '@penx/unique-id'

type Input = {
  siteId: string
  userId: string
}

function getMoldNode(
  type: string,
  name: string,
  input: Input,
  props: Prop[] = [],
) {
  return {
    id: uniqueId(),
    type: NodeType.MOLD,
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
  } as IMoldNode
}

export function getDefaultMolds(input: Input): IMoldNode[] {
  return [
    getMoldNode(CreationType.PAGE, 'Page', input),
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

    getMoldNode(CreationType.NOTE, 'Note', input),
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

    getMoldNode(CreationType.TASK, 'Task', input),

    getMoldNode(CreationType.BOOKMARK, 'Bookmark', input, [
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
  ] as IMoldNode[]
}
