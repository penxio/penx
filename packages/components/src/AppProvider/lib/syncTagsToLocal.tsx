'use client'

import { Shape, ShapeStream } from '@electric-sql/client'
import { SHAPE_URL } from '@penx/constants'
import { localDB } from '@penx/local-db'
import { queryClient } from '@penx/query-client'
import { isRowsEqual } from './isRowsEqual'

export function syncTagsToLocal(siteId: string) {
  //
  const tagStream = new ShapeStream({
    url: SHAPE_URL,
    params: {
      table: 'tag',
      where: `"siteId" = '${siteId}'`,
    },
  })

  const tagShape = new Shape(tagStream)

  // tagStream.subscribe(async (data) => {
  //   console.log('tagStream=============:', data)
  //   console.log('=====tagShape.offet:', tagShape.lastOffset, tagShape.handle)
  // })

  tagShape.subscribe(async ({ rows }) => {
    const tags = await localDB.tag.where({ siteId }).toArray()

    const isEqual = isRowsEqual(rows, tags, [
      'id',
      'name',
      'color',
      'creationCount',
      'hidden',
      'siteId',
      'userId',
    ])
    // console.log('-=========>>isEqual:', isEqual)

    if (isEqual) return

    const tx = localDB
      .transaction('rw', localDB.tag, async () => {
        await localDB.tag.where({ siteId }).delete()
        await localDB.tag.bulkPut(rows as any)
        const tags = await localDB.tag.where({ siteId }).toArray()
        queryClient.setQueryData(['tags'], tags)
      })
      .then(() => {
        // console.log('Transaction committed')
      })
      .catch((err) => {
        // console.error(err.stack)
      })
  })
}
