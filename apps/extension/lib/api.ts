import ky from 'ky'
import { z } from 'zod'
import { Area, Tag } from '@prisma/client'
import '@penx/types'
import { BASE_URL } from './constants'

enum CreationStatus {
  PUBLISHED = 'PUBLISHED',
  CONTRIBUTED = 'CONTRIBUTED',
  DRAFT = 'DRAFT',
  ARCHIVED = 'ARCHIVED',
}

const API_BASE_URL = `${BASE_URL}/api/v1`

export const addCreationInputSchema = z.object({
  type: z.string(),
  title: z.string().optional(),
  description: z.string().optional(),
  content: z.string().optional(),
  image: z.string().optional(),
  status: z.nativeEnum(CreationStatus).optional(),
  userId: z.string().optional(),
  areaId: z.string(),
  props: z.record(z.string(), z.any()).optional(),
  tagIds: z.array(z.string()).optional(),
  isPublishDirectly: z.boolean().optional(),
})

export type AddCreationInput = z.infer<typeof addCreationInputSchema>

export async function addCreation(input: AddCreationInput) {
  const url = `${API_BASE_URL}/creations`
  const res = await ky.post(url, { json: input }).json()
  return res
}

interface CreateTagInput {
  siteId: string
  name: string
}

export async function createTag(input: CreateTagInput) {
  const url = `${API_BASE_URL}/tags`
  const res = await ky.post<Tag>(url, { json: input }).json()
  return res
}

export const addCreationTagInputSchema = z.object({
  tagId: z.string(),
  siteId: z.string(),
  postId: z.string(),
})

export type AddCreationTagInput = z.infer<typeof addCreationTagInputSchema>

export async function addCreationTag(input: AddCreationTagInput) {
  const url = `${API_BASE_URL}/creation-tags`
  const res = await ky.post(url, { json: input }).json()
  return res
}

export async function getAreas() {
  const url = `${API_BASE_URL}/areas`
  const res = await ky.get<Area[]>(url).json()
  return res
}
