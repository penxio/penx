import React from 'react'
import { Trans } from '@lingui/react/macro'
import { Creation } from '@penx/domain'
import { AddMyListButton } from './AddMyListButton'
import { MyList } from './MyList'
import { TaskSection } from './TaskSection'
import { getCreations, SectionType } from './utils'

interface Props {
  creations: Creation[]
}

export const TaskList = (props: Props) => {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        {Object.keys(SectionType).map((key) => {
          const creations = getCreations(props.creations, key)
          return (
            <TaskSection key={key} sectionType={key} creations={creations} />
          )
        })}
      </div>
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="text-foreground/60 text-sm">
            <Trans>My lists</Trans>
          </div>
          <AddMyListButton />
        </div>
        <MyList />
      </div>
    </div>
  )
}
