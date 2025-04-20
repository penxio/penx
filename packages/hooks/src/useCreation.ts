import isEqual from 'react-fast-compare'
import { CreationTag, Tag } from '@prisma/client'
import { useQuery } from '@tanstack/react-query'
import { get, set } from 'idb-keyval'
import debounce from 'lodash.debounce'
import { RouterOutputs } from '@penx/api'
import { UpdateCreationInput } from '@penx/constants'
// import { CreationTag, Tag } from '@penx/db/client'
import { appEmitter } from '@penx/emitter'
import { useSiteTags } from '@penx/hooks/useSiteTags'
import { queryClient } from '@penx/query-client'
import { api, trpc } from '@penx/trpc-client'
import { CreationById } from '@penx/types'

export type CreationTagWithTag = CreationTag & { tag: Tag }

function getQueryKey(creationId: string) {
  return ['creations', creationId]
}

function getCacheKey(creationId: string) {
  return `CREATION_${creationId}`
}

async function getCachedCreation(creationId: string) {
  const key = getCacheKey(creationId)
  const creation = await get(key)
  return creation as CreationById
}

async function setCachedCreation(creationId: string, creation: CreationById) {
  const key = getCacheKey(creationId)
  set(key, creation)
}

export async function setCachedCreationProps(
  creationId: string,
  data: Partial<CreationById>,
) {
  const creation = await getCachedCreation(creationId)
  setCachedCreation(creationId, {
    ...creation,
    ...data,
    updatedAt: new Date(),
  })
}

export function useCreation(creationId: string) {
  const { data, refetch, ...rest } = useQuery({
    queryKey: getQueryKey(creationId),
    queryFn: async (c) => {
      const cached = await getCachedCreation(creationId)
      if (typeof cached === 'object' && cached) {
        const passedTIme = Date.now() - cached.updatedAt.valueOf()
        const tenMinutes = 1000 * 60 * 1
        if (passedTIme > tenMinutes) {
          setTimeout(async () => {
            const creation = (await api.creation.byId.query(
              creationId,
            )) as any as CreationById

            const equal = isEqual(
              {
                content: cached.content,
                title: cached.title,
                description: cached.description,
              },
              {
                content: creation.content,
                title: creation.title,
                description: creation.description,
              },
            )

            if (!equal) {
              appEmitter.emit('CREATION_UPDATED', creation)
              queryClient.setQueryData(getQueryKey(creationId), creation)
              await setCachedCreation(creationId, creation)
            }
          }, 0)
        }
        return cached
      }

      const creationSate = getCreation(creationId)
      const creation = (await api.creation.byId.query(
        creationId,
      )) as any as CreationById

      await setCachedCreation(creationId, creation)
      return creation
    },
    // staleTime: 1000 * 60,
  })
  return { data, ...rest }
}

export function getCreation(creationId: string) {
  return queryClient.getQueryData(getQueryKey(creationId)) as CreationById
}

export function addCreationTag(creationTag: CreationTagWithTag) {
  const creation = getCreation(creationTag.creationId)
  const newCreation = {
    ...creation,
    creationTags: [...creation.creationTags, creationTag as any],
  }
  queryClient.setQueryData(getQueryKey(creation.id), newCreation)
}

export function removeCreationTag(postTag: CreationTagWithTag) {
  const creation = getCreation(postTag.creationId)
  const newTags = creation.creationTags.filter((tag) => tag.id !== postTag.id)
  const newCreation = {
    ...creation,
    creationTags: newTags,
  }
  queryClient.setQueryData(getQueryKey(creation.id), newCreation)
}

export async function updateCreationState(
  props: Partial<CreationById> & { id: string },
) {
  const newCreation = {
    ...getCreation(props.id),
    ...props,
  }
  queryClient.setQueryData(getQueryKey(props.id), newCreation)
  await setCachedCreationProps(props.id, {
    ...props,
  })
}

async function saveCreationToServer(props: UpdateCreationInput) {
  await setCachedCreationProps(props.id, {
    ...props,
  })
  const newCreation = (await api.creation.update.mutate(
    props,
  )) as any as CreationById
  if (newCreation) {
    await setCachedCreation(newCreation.id, newCreation)
  }
}

const debouncedSaveCreation = debounce(saveCreationToServer, 250, {
  maxWait: 1000,
})

export async function updateCreation(props: UpdateCreationInput) {
  const newCreation = {
    ...getCreation(props.id),
    ...props,
  }

  queryClient.setQueryData(getQueryKey(props.id), newCreation)
  await debouncedSaveCreation(props)
}
