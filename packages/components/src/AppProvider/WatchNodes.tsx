import { useEffect } from 'react'
import isEqual from 'react-fast-compare'
import { useLiveQuery } from '@electric-sql/pglite-react'
import { NodeType } from '@penx/model-type'
import { useSession } from '@penx/session'
import { store } from '@penx/store'

export function WatchNodes() {
  const { session, isLoading } = useSession()

  {
    const creationLive = useLiveQuery.sql`
    SELECT *
    FROM node 
    WHERE "siteId" = ${session.siteId}
    AND "type" = ${NodeType.CREATION}
  `

    useEffect(() => {
      if (!creationLive || !creationLive?.rows.length) return
      const creations = store.creations.get()
      const equal = isEqual(creations, creationLive?.rows)
      if (!equal) store.creations.set(creationLive?.rows as any)
    }, [creationLive])
  }

  {
    const siteLive = useLiveQuery.sql`
      SELECT *
      FROM node 
      WHERE "siteId" = ${session.siteId}
      AND "type" = ${NodeType.SITE}
    `

    useEffect(() => {
      if (!siteLive || !siteLive?.rows.length) return
      const site = store.site.get()
      const equal = isEqual(site, siteLive?.rows[0])
      if (!equal) store.site.set(siteLive?.rows[0] as any)
    }, [siteLive])
  }

  {
    const areaLive = useLiveQuery.sql`
    SELECT *
    FROM node 
    WHERE "siteId" = ${session.siteId}
    AND "type" = ${NodeType.AREA}
  `

    useEffect(() => {
      if (!areaLive || !areaLive?.rows.length) return
      const areas = store.areas.get()
      const equal = isEqual(areas, areaLive?.rows)
      if (!equal) store.areas.set(areaLive?.rows as any)
    }, [areaLive])
  }

  {
    const tagLive = useLiveQuery.sql`
    SELECT *
    FROM node 
    WHERE "siteId" = ${session.siteId}
    AND "type" = ${NodeType.TAG}
  `

    useEffect(() => {
      if (!tagLive || !tagLive?.rows.length) return
      const tags = store.tags.get()
      const equal = isEqual(tags, tagLive?.rows)
      if (!equal) store.tags.set(tagLive?.rows as any)
    }, [tagLive])
  }

  {
    const creationTagLive = useLiveQuery.sql`
    SELECT *
    FROM node 
    WHERE "siteId" = ${session.siteId}
    AND "type" = ${NodeType.CREATION_TAG}
  `

    useEffect(() => {
      if (!creationTagLive || !creationTagLive?.rows.length) return
      const creationTags = store.creationTags.get()
      const equal = isEqual(creationTags, creationTagLive?.rows)
      if (!equal) store.creationTags.set(creationTagLive?.rows as any)
    }, [creationTagLive])
  }

  {
    const structLive = useLiveQuery.sql`
    SELECT *
    FROM node 
    WHERE "siteId" = ${session.siteId}
    AND "type" = ${NodeType.STRUCT}
  `

    useEffect(() => {
      if (!structLive || !structLive?.rows.length) return
      const structs = store.structs.get()
      const equal = isEqual(structs, structLive?.rows)
      if (!equal) store.structs.set(structLive?.rows as any)
    }, [structLive])
  }

  return null
}
