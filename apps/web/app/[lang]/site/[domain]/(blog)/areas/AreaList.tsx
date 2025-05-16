'use client'

import { Image } from '@penx/components/Image'
import { trpc } from '@penx/trpc-client'
import { Site } from '@penx/types'
import { LoadingDots } from '@penx/uikit/loading-dots'
import { Skeleton } from '@penx/uikit/skeleton'
import { AreaItem } from './AreaItem'

interface Props {
  site: Site
}
export function AreaList({ site }: Props) {
  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-2">
      {site.areas.map((item) => (
        <AreaItem key={item.id} area={item} />
      ))}
    </div>
  )
}
