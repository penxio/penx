import { Creation } from '@penx/domain'
import { ICommandItem } from './types'

export const creationToCommand = (creation: Creation): ICommandItem => {
  return {
    id: creation.id,
    title: creation.title,
    keywords: [],
    data: {
      type: 'Creation',
      alias: '',
      creation: creation,
      assets: {},
      filters: {},
      runtime: 'worker',
      commandName: creation.title || creation.previewedContent,
      extensionSlug: '',
      extensionIcon: '',
      isDeveloping: false,
      applicationPath: '',
      isApplication: false,
    },
  }
}
