'use client'

import { PGlite } from '@electric-sql/pglite'
import { PGliteProvider } from '@electric-sql/pglite-react'
import { electricSync } from '@electric-sql/pglite-sync'
import { live } from '@electric-sql/pglite/live'
import { useQuery } from '@tanstack/react-query'
import { SHAPE_URL } from '@penx/constants'
import { pgStore } from '@penx/pg'
import { LogoSpinner } from '@penx/widgets/LogoSpinner'

export function SyncProvider({ children }: { children: React.ReactNode }) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['sync_db'],
    queryFn: async () => {
      const t0 = Date.now()
      const pg = await PGlite.create('idb://penx', {
        extensions: {
          electric: electricSync(),
          live,
        },
      })

      pgStore.pg = pg

      await pg.exec(`
        CREATE TABLE IF NOT EXISTS node (
          "id" TEXT PRIMARY KEY,
          "type" TEXT NOT NULL,
          "props" JSONB NOT NULL,
          "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
          "updatedAt" TIMESTAMP NOT NULL,
          "areaId" TEXT,
          "userId" TEXT NOT NULL,
          "siteId" TEXT NOT NULL
        );
      `)

      const t1 = Date.now()

      return pg
    },
    staleTime: Infinity,
  })

  if (isLoading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <LogoSpinner />
      </div>
    )
  }

  if (error) {
    console.log('==error:', error)

    return <div>error</div>
  }

  return <PGliteProvider db={data}>{children}</PGliteProvider>
}
