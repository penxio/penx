'use client'

import { useSiteContext } from '@/components/SiteContext'
import { api } from '@penx/trpc-client'
import { Panel } from '@/lib/types'
import { Trans } from '@lingui/react/macro'
import { Mold } from '@penx/db/client'
import { useQuery } from '@tanstack/react-query'
import { TaskItem } from './TaskItem'

interface PostListProps {
  mold: Mold
  panel: Panel
  index: number
}

export function TasksList({ mold }: PostListProps) {
  const { id } = useSiteContext()
  const { data: creations = [], isLoading } = useQuery({
    queryKey: ['creations', mold.id],
    queryFn: async () => {
      return api.creation.listCreationsByMold.query({ moldId: mold.id })
    },
  })

  if (isLoading) return <div className="text-foreground/60">Loading...</div>

  if (!creations.length) {
    return (
      <div className="text-foreground/60">
        <Trans>No creations yet.</Trans>
      </div>
    )
  }

  return (
    <div className="flex w-full flex-col gap-2">
      {creations.map((post) => {
        return <TaskItem key={post.id} creation={post as any} />
      })}
    </div>
  )
}
