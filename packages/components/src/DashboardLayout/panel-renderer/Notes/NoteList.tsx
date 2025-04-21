'use client'

import { Trans } from '@lingui/react'
import { Mold } from '@prisma/client'
import { useQuery } from '@tanstack/react-query'
import { useAreaContext } from '@penx/components/AreaContext'
import { useSiteContext } from '@penx/contexts/SiteContext'
import { api } from '@penx/trpc-client'
import { Panel } from '@penx/types'
import { NoteItem } from './NoteItem'

interface PostListProps {
  mold: Mold
  panel: Panel
  index: number
}

export function NoteList({ mold }: PostListProps) {
  const area = useAreaContext()
  const { id } = useSiteContext()
  const { data: posts = [], isLoading } = useQuery({
    queryKey: ['notes', area.id, mold.id],
    queryFn: async () => {
      return api.creation.listNotes.query({
        areaId: area.id,
        moldId: mold.id,
      })
    },
  })

  if (isLoading) return <div className="text-foreground/60">Loading...</div>

  if (!posts.length) {
    return (
      <div className="text-foreground/60">
        <Trans id="No notes yet."></Trans>
      </div>
    )
  }

  return (
    <div className="flex w-full flex-col gap-2">
      {/* @ts-ignore */}
      {posts.map((post) => {
        return <NoteItem key={post.id} creation={post as any} />
      })}
    </div>
  )
}
