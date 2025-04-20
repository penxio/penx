'use client'

import { LoadingDots } from '@penx/uikit/components/icons/loading-dots'
import { Image } from '@penx/components/Image'
import { Skeleton } from '@penx/uikit/ui/skeleton'
import { Site } from '@penx/types'
import { trpc } from '@penx/trpc-client'
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
