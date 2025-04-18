'use client'

import { useAreaContext } from '@/components/AreaContext'
import { useSiteContext } from '@/components/SiteContext'
import { api } from '@/lib/trpc'
import { Panel } from '@/lib/types'
import { Trans } from '@lingui/react/macro'
import { Mold } from '@penx/db/client'
import { useQuery } from '@tanstack/react-query'
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
        <Trans>No notes yet.</Trans>
      </div>
    )
  }

  return (
    <div className="flex w-full flex-col gap-2">
      {posts.map((post) => {
        return <NoteItem key={post.id} creation={post as any} />
      })}
    </div>
  )
}
