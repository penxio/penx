'use client'

import { Shape, ShapeStream } from '@electric-sql/client'
import { SHAPE_URL } from '@penx/constants'
import { localDB } from '@penx/local-db'
import { queryClient } from '@penx/query-client'
import { getSession } from '@penx/session'
import { isRowsEqual } from './isRowsEqual'

export function syncCreationTagsToLocal(siteId: string) {
  //
  const stream = new ShapeStream({
    url: SHAPE_URL,
    params: {
      table: 'creation_tag',
      where: `"siteId" = '${siteId}'`,
    },
  })

  const shape = new Shape(stream)

  // stream.subscribe(async (data) => {
  //   console.log('tagStream=============:', data)
  // })

  shape.subscribe(async ({ rows }) => {
    console.log('creation tag rows=======:', rows)

    const creationTags = await localDB.creationTag.where({ siteId }).toArray()

    const isEqual = isRowsEqual(rows, creationTags, [
      'id',
      'creationId',
      'siteId',
      'tagId',
      'siteId',
    ])
    console.log('-=========>>isEqual:', isEqual)

    if (isEqual) return

    const tx = localDB
      .transaction('rw', localDB.creationTag, async () => {
        console.log('start sync creation tag')
        // const session = await getSession()
        await localDB.creationTag.where({ siteId }).delete()
        await localDB.creationTag.bulkAdd(rows as any)

        const creationTags = await localDB.creationTag
          .where({ siteId })
          .toArray()

        await localDB.creationTag.bulkPut(rows as any)
        console.log('creation updated....')

        queryClient.setQueryData(['creation-tags'], creationTags)
      })
      .then(() => {
        console.log('Transaction committed')
      })
      .catch((err) => {
        console.error(err)
      })
  })
}
