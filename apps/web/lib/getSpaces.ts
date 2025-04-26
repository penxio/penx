import { request } from 'graphql-request'
import { SUBGRAPH_URL } from '@penx/constants'
import { spacesQuery } from './gql'
import { SpaceType } from './types'

export async function getSpaces() {
  const { spaces = [] } = await request<{ spaces: SpaceType[] }>({
    url: SUBGRAPH_URL,
    document: spacesQuery,
  })
  return spaces
}
