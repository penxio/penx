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
import { getRandomColorName } from '@penx/libs/color-helper'
import { localDB } from '@penx/local-db'
import { ICreation } from '@penx/model/ICreation'
import { ICreationTag } from '@penx/model/ICreationTag'
import { ITag } from '@penx/model/ITag'
import { queryClient } from '@penx/query-client'
import { api, trpc } from '@penx/trpc-client'
import { uniqueId } from '@penx/unique-id'
import { refetchCreationTags } from './useCreationTags'
import { refetchTags } from './useTags'

export type CreationTagWithTag = CreationTag & { tag: Tag }

function getQueryKey(creationId: string) {
  return ['creations', creationId]
}

export function useCreation(creationId: string) {
  const { data, ...rest } = useQuery({
    queryKey: getQueryKey(creationId),
    queryFn: async () => {
      const creation = await localDB.creation.get(creationId)
      return creation
    },
  })
  return { data, ...rest }
}

export function getCreation(creationId: string) {
  return queryClient.getQueryData(getQueryKey(creationId)) as ICreation
}

export async function createTag(creation: ICreation, tagName: string) {
  const tag = await localDB.tag
    .where({
      siteId: creation.siteId,
      name: tagName,
    })
    .first()

  let newTag: ITag

  if (!tag) {
    const tagId = uniqueId()
    newTag = {
      id: tagId,
      name: tagName,
      color: getRandomColorName(),
      creationCount: 0,
      hidden: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      userId: creation.userId,
      siteId: creation.siteId,
    }
    await localDB.tag.add(newTag)

    const id = uniqueId()
    const newCreationTag: ICreationTag = {
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
      creationId: creation.id,
      tagId: newTag.id,
      siteId: creation.siteId,
    }
    await localDB.creationTag.add(newCreationTag)

    refetchTags()
    refetchCreationTags()

    await api.tag.createAndAddTag.mutate({
      tag: newTag,
      creationTag: newCreationTag,
    })
  }
}

export async function addCreationTag(creation: ICreation, tag: ITag) {
  const newCreationTag: ICreationTag = {
    id: uniqueId(),
    createdAt: new Date(),
    updatedAt: new Date(),
    creationId: creation.id,
    tagId: tag.id,
    siteId: creation.siteId,
  }
  await localDB.creationTag.add(newCreationTag)

  await refetchCreationTags()
  api.tag.add.mutate({
    id: newCreationTag.id,
    siteId: creation.siteId,
    creationId: creation.id,
    tagId: tag.id,
  })
}

export async function deleteCreationTag(postTag: ICreationTag) {
  const creation = getCreation(postTag.creationId)
  await localDB.creationTag.delete(postTag.id)
  await refetchCreationTags()
  api.tag.deleteCreationTag.mutate(postTag.id)
}

export async function updateCreationState(
  props: Partial<ICreation> & { id: string },
) {
  const newCreation = {
    ...getCreation(props.id),
    ...props,
  }
  queryClient.setQueryData(getQueryKey(props.id), newCreation)
}

async function persistCreation(props: UpdateCreationInput) {
  const { id, ...data } = props
  await localDB.creation.update(id, data)
  await api.creation.update.mutate(props)
}

const debouncedSaveCreation = debounce(persistCreation, 250, {
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
