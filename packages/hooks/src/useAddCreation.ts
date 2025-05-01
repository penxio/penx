import { CreateCreationInput, editorDefaultValue } from '@penx/constants'
import { CommentStatus } from '@penx/db/client'
import { useCollaborators } from '@penx/hooks/useCollaborators'
import { updateCreationState } from '@penx/hooks/useCreation'
import { useMolds } from '@penx/hooks/useMolds'
import { ICreation } from '@penx/model-type/ICreation'
import { useSession } from '@penx/session'
import { store } from '@penx/store'
import { api } from '@penx/trpc-client'
import { CreationStatus, CreationType, GateType, PanelType } from '@penx/types'
import { uniqueId } from '@penx/unique-id'

export function useAddCreation() {
  const { session } = useSession()
  const { molds } = useMolds()
  const { data: collaborators = [] } = useCollaborators()
  return async (type: string) => {
    const mold = molds.find((mold) => mold.type === type)!
    const { user } = collaborators.find((c) => c.userId === session?.uid)!

    const area = store.area.get()

    const id = uniqueId()
    const createPostInput: CreateCreationInput = {
      id,
      slug: uniqueId(),
      siteId: session?.siteId!,
      title: '',
      description: '',
      image: '',
      content: JSON.stringify(editorDefaultValue),
      type: mold.type,
      moldId: mold.id,
      areaId: area.id,
    }

    const newCreation = {
      ...createPostInput,
      siteId: mold.siteId,
      icon: '',
      props: [],
      podcast: {},
      i18n: {},
      userId: session?.uid!,
      gateType: GateType.FREE,
      status: CreationStatus.DRAFT,
      commentStatus: CommentStatus.OPEN,
      featured: false,
      collectible: false,
      isJournal: false,
      isPopular: false,
      isPage: false,
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

    store.panels.addPanel({
      id: uniqueId(),
      type: PanelType.CREATION,
      creationId: newCreation.id,
    })

    // TODO: need to retry
    await api.creation.create.mutate(createPostInput)
  }
}
