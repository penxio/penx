import {
  AddCreationInput,
  editorDefaultValue,
  isMobileApp,
} from '@penx/constants'
import { CommentStatus } from '@penx/db/client'
import { appEmitter } from '@penx/emitter'
import { updateCreationState } from '@penx/hooks/useCreation'
import { useMolds } from '@penx/hooks/useMolds'
import { ICreationNode, NodeType } from '@penx/model-type'
import { store } from '@penx/store'
import { CreationStatus, GateType, PanelType } from '@penx/types'
import { uniqueId } from '@penx/unique-id'
import { useMySite } from './useMySite'

export type Input = {
  type: string
  isAddPanel?: boolean
  content?: string
  title?: string
}

export function useAddCreation() {
  const { molds } = useMolds()
  const { site } = useMySite()

  return async (input: Input) => {
    const { isAddPanel = true } = input
    const mold = molds.find((mold) => mold.type === input.type)
    const area = store.area.get()

    if (!mold) throw new Error('Invalid mold type')

    const id = uniqueId()
    const addCreationInput: AddCreationInput = {
      slug: uniqueId(),
      siteId: site.id,
      title: input.title || '',
      description: '',
      image: '',
      content: input.content || JSON.stringify(editorDefaultValue),
      type: mold.type,
      moldId: mold.id,
      areaId: area.id,
    }

    const newCreation: ICreationNode = {
      id,
      type: NodeType.CREATION,
      props: {
        icon: '',
        props: {},
        podcast: {},
        i18n: {},
        gateType: GateType.FREE,
        status: CreationStatus.DRAFT,
        commentStatus: CommentStatus.OPEN,
        featured: false,
        collectible: false,
        isJournal: false,
        isPopular: false,
        checked: false,
        delivered: false,
        commentCount: 0,
        cid: '',
        openedAt: new Date(),
        ...addCreationInput,
      } as ICreationNode['props'],
      createdAt: new Date(),
      updatedAt: new Date(),
      areaId: area.id,
      siteId: mold.siteId,
      userId: site.userId,
    }

    store.creations.addCreation(newCreation)

    updateCreationState(newCreation)

    if (isMobileApp && !input.content) {
      appEmitter.emit('ROUTE_TO_CREATION', newCreation)
    } else {
      if (isAddPanel) {
        store.panels.addPanel({
          id: uniqueId(),
          type: PanelType.CREATION,
          creationId: newCreation.id,
        })
      }
    }
    return newCreation
  }
}
