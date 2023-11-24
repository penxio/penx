import { nanoid } from 'nanoid'
import { SettingsType } from '@penx/constants'
import { ISpace } from '@penx/model-types'
import { getRandomColor } from './getRandomColor'

export function getNewSpace(data: Partial<ISpace>): ISpace {
  return {
    id: nanoid(),
    name: 'My Space',
    sort: 1,
    // version: 0,
    isActive: true,
    isCloud: false,
    color: getRandomColor(),
    activeNodeIds: [],
    nodeSnapshot: {
      version: 0,
      nodeMap: {},
    },
    pageSnapshot: {
      version: 0,
      pageMap: {},
    },
    createdAt: new Date(),
    updatedAt: new Date(),
    ...data,
  }
}
