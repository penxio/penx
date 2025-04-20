'use client'

import { Suspense } from 'react'
import { UserAvatar } from '@penx/components/UserAvatar'
import { useQueryLogoImages } from '@penx/hooks/useLogoImages'
import { useSpaces } from '@penx/hooks/useSpaces'
import { Link } from '@penx/libs/i18n'
import { precision } from '@/lib/math'
import { cn } from '@penx/utils'
import { Skeleton } from '@penx/uikit/ui/skeleton'
import { SpaceLogo } from './SpaceLogo'

export function SpaceList() {
  const { isLoading, data: spaces = [] } = useSpaces()
  useQueryLogoImages(spaces)
  if (isLoading)
    return (
      <div>
        <div className="mx-auto grid w-full gap-4 rounded-lg sm:w-full md:grid-cols-2 lg:grid-cols-3">
          {Array(9)
            .fill('')
            .map((_, i) => (
              <Skeleton
                key={i}
                className={cn(
                  'bg-background dark:bg-foreground/80 flex h-[116px] cursor-pointer items-center justify-between gap-3 rounded-2xl p-5 shadow-sm transition-all hover:scale-105',
                )}
              ></Skeleton>
            ))}
        </div>
      </div>
    )

  return (
    <div className="mx-auto grid w-full gap-4 rounded-lg sm:w-full md:grid-cols-2 lg:grid-cols-3">
      {spaces.map((space, index) => (
        <Link
          key={space.id}
          href={`/space/${space.id}`}
          className={cn(
            'bg-background dark:bg-foreground/80 flex cursor-pointer items-center justify-between gap-3 rounded-2xl p-5 shadow-sm transition-all hover:scale-105',
            // spaces.length !== index + 1 && 'border-b border-neutral-100/90',
          )}
        >
          <div className="flex items-center gap-2">
            <SpaceLogo uri={space.uri} />

            <div className="grid gap-1">
              <div className="flex items-center gap-2">
                <div className="mr-3 text-xl font-semibold">{space.name}</div>
              </div>
              <div className="flex items-center gap-2">
                <div className="text-foreground/80 text-sm">
                  ${space.symbol}
                </div>
                <div className="text-foreground/60 text-xs">
                  TVL {precision.toDecimal(space.ethVolume).toFixed(6)} ETH
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-foreground/60 text-xs">
                  {space.memberCount} members
                </div>
                <div className="flex gap-1">
                  {space.members.map((item) => (
                    <UserAvatar
                      key={item.id}
                      address={item.account}
                      className={cn('h-5 w-5')}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}
