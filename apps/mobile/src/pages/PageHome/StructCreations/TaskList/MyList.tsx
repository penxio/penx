import React from 'react'
import { impact } from '@/lib/impact'
import { ChevronRightIcon } from 'lucide-react'
import { appEmitter } from '@penx/emitter'
import { useStructs } from '@penx/hooks/useStructs'

interface Props {}

export const MyList = (props: Props) => {
  const { structs } = useStructs()
  const taskStruct = structs.find((s) => s.isTask)!

  const column = taskStruct.columns.find((c) => c.slug === 'list')!
  if (!column) return null
  const { options = [] } = column
  return (
    <div className="flex flex-col gap-2">
      {options.map((option) => (
        <div
          key={option.id}
          className="flex items-center justify-between"
          onClick={() => {
            appEmitter.emit('ROUTE_TO_TASKS', {
              column,
              option,
            })

            impact()
          }}
        >
          <div className="text-lg font-bold">{option.name}</div>
          <ChevronRightIcon className="text-foreground/50" />
        </div>
      ))}
    </div>
  )
}
