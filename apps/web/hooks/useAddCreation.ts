import { LoadingDots } from '@/components/icons/loading-dots'
import { useSession } from '@/components/session'
import { useSiteContext } from '@/components/SiteContext'
import { addCreation } from '@/hooks/useAreaCreations'
import { useCollaborators } from '@/hooks/useCollaborators'
import { updateCreationState } from '@/hooks/useCreation'
import { addPanel } from '@/hooks/usePanels'
import { editorDefaultValue } from '@/lib/constants'
import { CreateCreationInput } from '@/lib/constants/schema.constants'
import { CreationType } from '@/lib/theme.types'
import { api } from '@/lib/trpc'
import { PanelType, SiteCreation } from '@/lib/types'
import { uniqueId } from '@/lib/unique-id'

export function useAddCreation() {
  const { session } = useSession()
  const { molds } = useSiteContext()
  const { data: collaborators = [] } = useCollaborators()
  return async (type: string) => {
    const mold = molds.find((mold) => mold.type === type)!
    const { user } = collaborators.find((c) => c.userId === session?.uid)!

    const id = uniqueId()
    const createPostInput: CreateCreationInput = {
      id,
      slug: uniqueId(),
      siteId: session?.siteId!,
      title: '',
      description: '',
      image: '',
      content: JSON.stringify(editorDefaultValue),
      areaId: session?.activeAreaId!,
      moldId: mold.id,
      type: mold.type,
    }

    const newPost = {
      ...createPostInput,
      icon: '',
      props: [],
      type: CreationType.NOTE,
      openedAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
      userId: session?.uid!,
      mold: mold,
      authors: [
        {
          id,
          siteId: session?.siteId!,
          userId: session?.uid!,
          user: user,
        },
      ],
      creationTags: [],
    } as any as SiteCreation
    addCreation(newPost)
    updateCreationState(newPost)

    addPanel({
      id: uniqueId(),
      type: PanelType.CREATION,
      creation: newPost,
    })

    // TODO: need to retry
    await api.creation.create.mutate(createPostInput)
  }
}
