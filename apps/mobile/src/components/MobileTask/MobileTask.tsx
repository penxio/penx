'use client'

import { Trans } from '@lingui/react'
import { useCreations } from '@penx/hooks/useCreations'
import { useMolds } from '@penx/hooks/useMolds'
import { CreationType, Panel } from '@penx/types'
import { TaskItem } from './TaskItem'

interface Props {}

export function MobileTask({}: Props) {
  const { molds } = useMolds()
  const mold = molds.find((item) => item.type === CreationType.TASK)
  const { creations } = useCreations()
  const tasks = creations.filter((item) => item.moldId === mold?.id)

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
      <div className="flex w-full flex-1 overflow-auto px-4 pt-6">
        <div className="mx-auto flex w-full max-w-2xl flex-col gap-2">
          {[...todoTasks, ...completedTasks].map((item) => {
            return <TaskItem key={item.id} creation={item as any} />
          })}
        </div>
      </div>
    </div>
  )
}
