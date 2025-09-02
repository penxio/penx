import { Struct } from '@penx/domain'
import { ICommandItem } from './types'

export const structToCommand = (struct: Struct): ICommandItem => {
  return {
    id: struct.id,
    title: struct.name,
    keywords: [struct.type],
    data: {
      type: 'Struct',
      alias: '',
      struct: struct,
      assets: {},
      filters: {},
      runtime: 'worker',
      commandName: struct.name,
      extensionSlug: '',
      extensionIcon: '',
      isDeveloping: false,
      applicationPath: '',
      isApplication: false,
    },
  }
}
