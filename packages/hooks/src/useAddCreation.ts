import {
  AddCreationInput,
  editorDefaultValue,
  isMobileApp,
} from '@penx/constants'
import { CommentStatus } from '@penx/db/client'
import { appEmitter } from '@penx/emitter'
import { useCollaborators } from '@penx/hooks/useCollaborators'
import { updateCreationState } from '@penx/hooks/useCreation'
import { useMolds } from '@penx/hooks/useMolds'
import { ICreation } from '@penx/model-type/ICreation'
import { store } from '@penx/store'
import { CreationStatus, GateType, PanelType } from '@penx/types'
import { uniqueId } from '@penx/unique-id'
import { useMySite } from './useMySite'

export function useAddCreation() {
  const { molds } = useMolds()
  const { site } = useMySite()

  return async (type: string, content?: string) => {
    const mold = molds.find((mold) => mold.type === type)!
    const area = store.area.get()

    const id = uniqueId()
    const addCreationInput: AddCreationInput = {
      id,
      slug: uniqueId(),
      siteId: site.id,
      title: '',
      description: '',
      image: '',
      content: content || JSON.stringify(editorDefaultValue),
      type: mold.type,
      moldId: mold.id,
      areaId: area.id,
    }

    const newCreation = {
      ...addCreationInput,
      siteId: mold.siteId,
      icon: '',
      props: {},
      podcast: {},
      i18n: {},
      userId: site.userId,
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
      createdAt: new Date(),
      updatedAt: new Date(),
    } as ICreation

    store.creations.addCreation(newCreation)

    updateCreationState(newCreation)

    if (isMobileApp && !content) {
      appEmitter.emit('ROUTE_TO_CREATION', newCreation)
    } else {
      store.panels.addPanel({
        id: uniqueId(),
        type: PanelType.CREATION,
        creationId: newCreation.id,
      })
    }
    return newCreation
  }
}
