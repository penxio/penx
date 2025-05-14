'use client'

import { Trans } from '@lingui/react'
import { useQuery } from '@tanstack/react-query'
import { Mold } from '@penx/domain'
import { useCreations } from '@penx/hooks/useCreations'
import { useMolds } from '@penx/hooks/useMolds'
import { api } from '@penx/trpc-client'
import { Panel } from '@penx/types'
import { TaskInput } from './TaskInput'
import { TaskItem } from './TaskItem'

interface PostListProps {
  mold: Mold
  panel: Panel
  index: number
}

export function TasksList({ mold }: PostListProps) {
  const { creations } = useCreations()
  const tasks = creations.filter((item) => item.moldId === mold.id)

  const todoTasks = tasks
    .filter((item) => !item.checked)
    .sort((a, b) => new Date(b.createdAt).getTime() - a.createdAt.getTime())

  const completedTasks = tasks
    .filter((item) => item.checked)
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())

  return (
    <div className="flex flex-1 flex-col">
      {!tasks.length && (
        <div className="text-foreground/60">
          <Trans id="No task yet."></Trans>
        </div>
      )}
      <div className="flex w-full flex-1 overflow-auto px-6 pt-6">
        <div className="mx-auto flex w-full max-w-2xl flex-col gap-2">
          {[...todoTasks, ...completedTasks].map((item) => {
            return <TaskItem key={item.id} creation={item as any} />
          })}
        </div>
      </div>
      <div className="px-6 pb-2">
        <div className="mx-auto flex w-full max-w-2xl flex-col gap-2">
          <TaskInput />
        </div>
      </div>
    </div>
  )
}
