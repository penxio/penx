import React from 'react'
import { ChevronRightIcon } from 'lucide-react'
import { appEmitter } from '@penx/emitter'
import { useStructs } from '@penx/hooks/useStructs'
import { store } from '@penx/store'
import { PanelType } from '@penx/types'

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
          className="flex origin-left cursor-pointer items-center justify-between text-sm font-medium transition-all hover:scale-105 hover:font-bold"
          onClick={() => {
            store.panels.openTaskList({
              column,
              option,
            })
          }}
        >
          <div className="">{option.name}</div>
        </div>
      ))}
    </div>
  )
}
