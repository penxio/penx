'use client'

import { Shape, ShapeStream } from '@electric-sql/client'
import { SHAPE_URL } from '@penx/constants'
import { localDB } from '@penx/local-db'
import { queryClient } from '@penx/query-client'
import { isRowsEqual } from './isRowsEqual'

export function syncMoldsToLocal(siteId: string) {
  //
  const stream = new ShapeStream({
    url: SHAPE_URL,
    params: {
      table: 'mold',
      where: `"siteId" = '${siteId}'`,
    },
  })

  const shape = new Shape(stream)

  shape.subscribe(async ({ rows }) => {
    const molds = await localDB.mold.where({ siteId }).toArray()

    // const isEqual = isRowsEqual(rows, molds, [
    //   'id',
    //   'name',
    //   'description',
    //   'type',
    //   'props',
    //   'content',
    //   'siteId',
    //   'userId',
    // ])
    // // console.log('-=========>>isEqual:', isEqual)

    // if (isEqual) return

    const tx = localDB
      .transaction('rw', localDB.mold, async () => {
        await localDB.mold.where({ siteId }).delete()
        await localDB.mold.bulkPut(rows as any)
        const molds = await localDB.mold.where({ siteId }).toArray()
        queryClient.setQueryData(['molds'], molds)
      })
      .then(() => {
        // console.log('Transaction committed')
      })
      .catch((err) => {
        // console.error(err.stack)
      })
  })
}
