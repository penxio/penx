import { editorDefaultValue } from '@penx/constants'
import { IMold } from '@penx/model-type'
import { CreationType, Prop, PropType } from '@penx/types'
import { uniqueId } from '@penx/unique-id'

export function getDefaultMolds(input: { siteId: string; userId: string }) {
  return [
    {
      id: uniqueId(),
      name: 'Page',
      description: '',
      type: CreationType.PAGE,
      props: [],
      content: JSON.stringify(editorDefaultValue),
      createdAt: new Date(),
      updatedAt: new Date(),
      ...input,
    },

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
    {
      id: uniqueId(),
      name: 'Note',
      description: '',
      type: CreationType.NOTE,
      props: [],
      content: JSON.stringify(editorDefaultValue),
      createdAt: new Date(),
      updatedAt: new Date(),
      ...input,
    },
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

    {
      id: uniqueId(),
      name: 'Task',
      description: '',
      type: CreationType.TASK,
      content: JSON.stringify(editorDefaultValue),
      createdAt: new Date(),
      updatedAt: new Date(),
      ...input,
    },

    {
      id: uniqueId(),
      name: 'Bookmark',
      description: '',
      type: CreationType.BOOKMARK,
      props: [
        { id: uniqueId(), name: 'URL', slug: 'url', type: PropType.URL },
      ] as Prop[],
      content: JSON.stringify(editorDefaultValue),
      createdAt: new Date(),
      updatedAt: new Date(),
      ...input,
    },
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
  ] as IMold[]
}
