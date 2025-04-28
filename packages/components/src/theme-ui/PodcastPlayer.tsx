'use client'

import { useEffect, useRef } from 'react'
// @ts-ignore
import { Player } from 'shikwasa'
import { useSiteContext } from '@penx/contexts/SiteContext'
import { Creation } from '@penx/types'
import { Skeleton } from '@penx/uikit/skeleton'
import { cn, getUrl } from '@penx/utils'

interface Props {
  creation: Creation
  className?: string
}

export function PodcastPlayer({ creation, className }: Props) {
  const playerRef = useRef<any>(null)
  const site = useSiteContext()

  useEffect(() => {
    playerRef.current = new Player({
      container: () => document.querySelector('.podcast-audio'),
      // fixed: {
      //   type: 'fixed',
      //   position: 'bottom',
      // },
      themeColor: 'black',
      theme: 'light',
      download: true,
      preload: 'metadata',
      audio: {
        title: creation.title,
        artist:
          creation?.authors[0]?.user?.displayName ||
          creation?.authors[0]?.user?.name ||
          '',
        cover: creation.image
          ? getUrl(creation.image || '')
          : getUrl(site.logo || site.image || ''),
        src: getUrl(creation?.podcast?.media || ''),
      },
    })

    window.__PLAYER__ = playerRef.current
  }, [])

  return (
    <div className={cn('podcast-audio w-full', className)}>
      <div className="border-foreground/10 bg-background flex h-[120px] w-full items-center justify-between border p-3 shadow">
        <div className="flex items-center gap-6">
          <Skeleton className="h-24 w-28" />
          <div className="space-y-2">
            <Skeleton className="h-7 w-28" />
            <Skeleton className="h-10 w-40" />
          </div>
        </div>
        <div className="flex items-center gap-6">
          <Skeleton className="size-7 rounded-full" />
          <Skeleton className="size-8 rounded-full" />
          <Skeleton className="size-7 rounded-full" />
        </div>
      </div>
    </div>
  )
}

export default PodcastPlayer
