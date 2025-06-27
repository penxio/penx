import isEqual from 'react-fast-compare'
import { useQuery } from '@tanstack/react-query'
import { get, set } from 'idb-keyval'
import debounce from 'lodash.debounce'
import { Creation, Tag } from '@penx/domain'
import { getRandomColorName } from '@penx/libs/color-helper'
import { localDB } from '@penx/local-db'
import {
  ICreationNode,
  ICreationTagNode,
  ITagNode,
  NodeType,
} from '@penx/model-type'
import { queryClient } from '@penx/query-client'
import { store } from '@penx/store'
import { uniqueId } from '@penx/unique-id'

function getQueryKey(creationId: string) {
  return ['creations', creationId]
}

export function useCreation(creationId: string) {
  const { data, ...rest } = useQuery({
    queryKey: getQueryKey(creationId),
    queryFn: async () => {
      const creation = await localDB.getCreation(creationId)
      return creation
    },
  })
  return { data, ...rest }
}

export function getCreation(creationId: string) {
  return queryClient.getQueryData(getQueryKey(creationId)) as ICreationNode
}

export async function createTag(
  creation: Creation,
  tagName: string,
  color?: string,
) {
  const tags = await localDB.listTags(creation.areaId)
  const tag = tags.find((t) => t.props.name === tagName)!

  let newTag: ITagNode

  if (tag) {
    const id = uniqueId()
    const newCreationTag: ICreationTagNode = {
      id,
      type: NodeType.CREATION_TAG,
      props: {
        creationId: creation.id,
        tagId: tag.id,
      },
      createdAt: new Date(),
      updatedAt: new Date(),
      areaId: creation.areaId,
      userId: creation.userId,
      siteId: creation.siteId,
    }
    await localDB.addCreationTag(newCreationTag)
  } else {
    const tagId = uniqueId()
    newTag = {
      id: tagId,
      type: NodeType.TAG,
      props: {
        name: tagName,
        color: color || getRandomColorName(),
        creationCount: 0,
        hidden: false,
      },
      createdAt: new Date(),
      updatedAt: new Date(),
      areaId: creation.areaId,
      userId: creation.userId,
      siteId: creation.siteId,
    }
    await localDB.addTag(newTag)

    const id = uniqueId()
    const newCreationTag: ICreationTagNode = {
      id,
      type: NodeType.CREATION_TAG,
      props: {
        creationId: creation.id,
        tagId: newTag.id,
      },
      createdAt: new Date(),
      updatedAt: new Date(),
      areaId: creation.areaId,
      userId: creation.userId,
      siteId: creation.siteId,
    }
    await localDB.addCreationTag(newCreationTag)
  }

  store.tags.refetchTags()
  store.creationTags.refetchCreationTags()
}

export async function addCreationTag(creation: Creation, tag: Tag) {
  const newCreationTag: ICreationTagNode = {
    id: uniqueId(),
    type: NodeType.CREATION_TAG,
    props: {
      creationId: creation.id,
      tagId: tag.id,
    },
    createdAt: new Date(),
    updatedAt: new Date(),
    areaId: creation.areaId,
    siteId: creation.siteId,
    userId: creation.userId,
  }
  await localDB.addCreationTag(newCreationTag)

  await store.creationTags.refetchCreationTags()
  await store.tags.refetchTags()
}

export async function deleteCreationTag(creationTag: ICreationTagNode) {
  await localDB.deleteCreationTag(creationTag.id)
  await store.creationTags.refetchCreationTags()
  await store.tags.refetchTags()
}

export async function updateCreationState(
  data: Partial<ICreationNode> & { id: string },
) {
  const newCreation = {
    ...getCreation(data.id),
    ...data,
  }
  queryClient.setQueryData(getQueryKey(data.id), newCreation)
}

async function persistCreation(
  id: string,
  props: Partial<ICreationNode['props']>,
) {
  await localDB.updateCreationProps(id, props)
}

const debouncedSaveCreation = debounce(persistCreation, 300, {
  maxWait: 1000,
})

export async function updateCreationProps(
  id: string,
  input: Partial<ICreationNode['props']>,
) {
  const creation = getCreation(id) || (await localDB.getNode(id))
  const newCreation: ICreationNode = {
    ...creation,
    props: {
      ...creation.props,
      ...input,
    },
  }

  queryClient.setQueryData(getQueryKey(id), newCreation)
  store.creations.updateCreationById(id, newCreation)
  await debouncedSaveCreation(id, input)
  return newCreation
}
