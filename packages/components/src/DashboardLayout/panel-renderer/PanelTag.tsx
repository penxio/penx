'use client'

import { Trans } from '@lingui/react/macro'
import { useCreations } from '@penx/hooks/useCreations'
import { useCreationTags } from '@penx/hooks/useCreationTags'
import { useTags } from '@penx/hooks/useTags'
import { Panel } from '@penx/types'
import { mappedByKey } from '@penx/utils'
import { CreationItem } from './PanelJournal/CreationItem/CreationItem'
import { PanelWidgetHeader } from './PanelWidgetHeader'

interface Props {
  panel: Panel
  index: number
}

export function PanelTag({ panel, index }: Props) {
  const { tags } = useTags()
  const tag = tags.find((m) => m.id === panel.tagId)!
  if (!tag) return null

  const { creations } = useCreations()
  const { creationTags } = useCreationTags()
  const creationMap = mappedByKey(creations, 'id')
  const list = creationTags.filter((i) => i.tagId === tag.id)

  return (
    <>
      <PanelWidgetHeader
        className="z-20"
        index={index}
        panel={panel}
        title={tag.name}
      />
      <div className="mx-auto flex max-w-xl flex-col gap-4 pt-20">
        {list.map((item) => {
          const creation = creationMap[item.creationId]
          return <CreationItem key={item.id} className="" creation={creation} />
        })}
      </div>
    </>
  )
}
