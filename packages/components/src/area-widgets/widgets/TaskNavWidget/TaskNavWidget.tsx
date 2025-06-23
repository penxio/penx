import { Trans } from '@lingui/react/macro'
import { TaskNav } from '@penx/constants'
import { Struct } from '@penx/domain'
import { useCreations } from '@penx/hooks/useCreations'
import { getTasksByTaskNav } from '@penx/libs/getTasksByTaskNav'
import { store } from '@penx/store'
import { PanelType } from '@penx/types'
import { AddMyListButton } from './AddMyListButton'
import { MyList } from './MyList'

interface Props {
  struct: Struct
}
export function TaskNavWidget({ struct }: Props) {
  const { creations } = useCreations()
  const tasks = creations.filter((c) => c.isTask)

  const labelMaps: Record<string, any> = {
    [TaskNav.TODAY]: <Trans>Today</Trans>,
    [TaskNav.TOMORROW]: <Trans>Tomorrow</Trans>,
    [TaskNav.UPCOMING]: <Trans>Upcoming</Trans>,
    [TaskNav.ALL]: <Trans>All</Trans>,
  }
  return (
    <div className="flex flex-col gap-4 px-3 pb-2">
      <div className="flex flex-col gap-2">
        {Object.keys(TaskNav).map((key) => {
          return (
            <div
              key={key}
              className="origin-left cursor-pointer text-sm font-medium transition-all hover:scale-105 hover:font-bold"
              onClick={() => {
                store.panels.openTaskList({
                  taskNav: key,
                })
              }}
            >
              {labelMaps[key]}
            </div>
          )
        })}
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="text-foreground/60 text-xs">
            <Trans>My lists</Trans>
          </div>
          <AddMyListButton />
        </div>
        <MyList />
      </div>
    </div>
  )
}
