'use client'

import { Site } from '@penx/types'
import { cn } from '@penx/utils'
import { Product } from '@prisma/client'
import { TierItem } from './TierItem'

interface Props {
  site: Site
  tiers: Product[]
}

export function TierList({ tiers, site }: Props) {
  return (
    <div
      className={cn('mt-4 flex flex-wrap items-center justify-center gap-4')}
    >
      {tiers.map((item, index) => {
        return <TierItem key={index} tier={item} site={site} />
      })}
    </div>
  )
}
