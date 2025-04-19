'use client'

import { LoadingDots } from '@/components/icons/loading-dots'
import { Image } from '@/components/Image'
import { Skeleton } from '@penx/ui/components/skeleton'
import { Site } from '@/lib/theme.types'
import { trpc } from '@/lib/trpc'
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
