'use client'

import { Trans } from '@lingui/react'
import { useQuery } from '@tanstack/react-query'
import { Mold } from '@penx/domain'
import { api } from '@penx/trpc-client'
import { Panel } from '@penx/types'
import { TaskItem } from './TaskItem'

interface PostListProps {
  mold: Mold
  panel: Panel
  index: number
}

export function TasksList({ mold }: PostListProps) {
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
        <Trans id="No creations yet."></Trans>
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
