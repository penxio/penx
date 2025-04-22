import { editorDefaultValue } from '@penx/constants'
import { CreationType, Prop, PropType } from '@penx/types'
import { uniqueId } from '@penx/unique-id'

export function getDefaultMolds(input: { siteId: string; userId: string }) {
  return [
    {
      name: 'Articles',
      description: '',
      type: CreationType.ARTICLE,
      props: [],
      content: JSON.stringify(editorDefaultValue),
      ...input,
    },
    {
      name: 'Notes',
      description: '',
      type: CreationType.NOTE,
      props: [],
      content: JSON.stringify(editorDefaultValue),
      ...input,
    },
    {
      name: 'Images',
      description: '',
      type: CreationType.IMAGE,
      props: [],
      content: JSON.stringify(editorDefaultValue),
      ...input,
    },
    {
      name: 'Podcasts',
      description: '',
      type: CreationType.AUDIO,
      props: [],
      content: JSON.stringify(editorDefaultValue),
      ...input,
    },
    {
      name: 'Bookmarks',
      description: '',
      type: CreationType.BOOKMARK,
      props: [
        { id: uniqueId(), name: 'URL', slug: 'url', type: PropType.URL },
      ] as Prop[],
      content: JSON.stringify(editorDefaultValue),
      ...input,
    },
    {
      name: 'Pages',
      description: '',
      type: CreationType.PAGE,
      props: [],
      content: JSON.stringify(editorDefaultValue),
      ...input,
    },
    {
      name: 'Friends',
      description: '',
      type: CreationType.FRIEND,
      props: [
        {
          id: uniqueId(),
          name: 'Avatar',
          slug: 'avatar',
          type: PropType.IMAGE,
        },
        { id: uniqueId(), name: 'URL', slug: 'url', type: PropType.URL },
        {
          id: uniqueId(),
          name: 'Status',
          slug: 'status',
          type: PropType.SINGLE_SELECT,
          options: [
            { name: 'pending', color: 'amber' },
            { name: 'rejected', color: 'red' },
            { name: 'approved', color: 'emerald' },
          ],
        },
      ] as Prop[],
      content: JSON.stringify(editorDefaultValue),
      ...input,
    },
    {
      name: 'Projects',
      description: '',
      type: CreationType.PROJECT,
      props: [
        { id: uniqueId(), name: 'Icon', slug: 'icon', type: PropType.IMAGE },
        { id: uniqueId(), name: 'Cover', slug: 'cover', type: PropType.IMAGE },
        { id: uniqueId(), name: 'URL', slug: 'url', type: PropType.URL },
      ] as Prop[],
      content: JSON.stringify(editorDefaultValue),
      ...input,
    },
  ]
}
