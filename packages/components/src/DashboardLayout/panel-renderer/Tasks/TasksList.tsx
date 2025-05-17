'use client'

import { Trans } from '@lingui/react'
import { useQuery } from '@tanstack/react-query'
import { Struct } from '@penx/domain'
import { useCreations } from '@penx/hooks/useCreations'
import { useStructs } from '@penx/hooks/useStructs'
import { api } from '@penx/trpc-client'
import { Panel } from '@penx/types'
import { TaskInput } from './TaskInput'
import { TaskItem } from './TaskItem'

interface PostListProps {
  struct: Struct
  panel: Panel
  index: number
}

export function TasksList({ struct }: PostListProps) {
  const { creations } = useCreations()
  const tasks = creations.filter((item) => item.structId === struct.id)

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
