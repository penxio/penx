import React from 'react'
import { MobileContent } from '@/components/MobileContent'
import { CreationItem } from '@penx/components/DashboardLayout/panel-renderer/PanelJournal/CreationItem/CreationItem'
import { Tag } from '@penx/domain'
import { useCreations } from '@penx/hooks/useCreations'
import { useCreationTags } from '@penx/hooks/useCreationTags'
import { mappedByKey } from '@penx/utils'

interface Props {
  tag: Tag
}
export const PageTagCreations: React.FC = ({ tag }: Props) => {
  return <Content tag={tag}></Content>
}

function Content({ tag }: Props) {
  const { creations } = useCreations()
  const { creationTags } = useCreationTags()
  const creationMap = mappedByKey(creations, 'id')
  const list = creationTags.filter((i) => i.tagId === tag.id)

  return (
    <MobileContent title={tag.name}>
      <div className="mx-auto flex max-w-xl flex-col gap-4">
        {list.map((item) => {
          const creation = creationMap[item.creationId]
          return <CreationItem key={item.id} className="" creation={creation} />
        })}
      </div>
    </MobileContent>
  )
}
