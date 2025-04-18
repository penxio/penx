'use client'

import { Skeleton } from '@/components/ui/skeleton'
import { useHomeSites } from '@/hooks/useHomeSites'
import { MySite } from '@/lib/types'
import { cn } from '@/lib/utils'
import { SiteItem } from './SiteItem'

interface Props {
  sites?: MySite[]
}

export function SiteList({ sites }: Props) {
  const { isLoading, data } = useHomeSites()

  if (isLoading || !data)
    return (
      <div>
        <div className="mx-auto grid w-full gap-4 sm:w-full md:grid-cols-2 lg:grid-cols-3">
          {Array(9)
            .fill('')
            .map((_, i) => (
              <Skeleton
                key={i}
                className={cn(
                  'bg-background dark:bg-foreground/5 flex h-[96px] cursor-pointer items-center justify-between gap-3 p-5 transition-all hover:scale-105',
                )}
              ></Skeleton>
            ))}
        </div>
      </div>
    )

  return (
    <div className="mx-auto grid w-full gap-4 sm:w-full md:grid-cols-2 lg:grid-cols-3">
      {data.map((site) => (
        <SiteItem key={site.id} site={site} />
      ))}
    </div>
  )
}
