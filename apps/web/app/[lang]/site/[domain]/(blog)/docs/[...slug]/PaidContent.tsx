'use client'

import { useMemo } from 'react'
import { useSession } from '@/components/session'
import { loadTheme } from '@/lib/loadTheme'
import { Creation, Site } from '@penx/types'
import { trpc } from '@penx/trpc-client'
import { SubscriptionInSession } from '@/lib/types'
import { cn } from '@penx/utils'
import dynamic from 'next/dynamic'
import readingTime from 'reading-time'
import { GateCover } from './GateCover'

// const PostDetail: any = dynamic(
//   () => import(process.env.NEXT_PUBLIC_THEME!).then((mod) => mod.PostDetail),
//   { ssr: false },
// )

function getContent(creation: Creation, isGated = false) {
  let content = JSON.parse(creation.content || '{}')
  if (!isGated) return content
  const len = content?.length || 0
  const index = len < 6 ? 2 : 4
  content = content?.slice(0, index) || []
  return content
}

function checkMembership(subscriptions: SubscriptionInSession[]) {
  if (!Array.isArray(subscriptions)) return false
  if (!subscriptions.length) return false
  const subscription = subscriptions[0]!
  if (Date.now() / 1000 < subscription.startTime + subscription.duration) {
    return true
  }
  return false
}

interface Props {
  site: Site
  creationId: string
  creation: Creation
  prev: Creation
  next: Creation
}

export function PaidContent({ site, creationId, creation, next, prev }: Props) {
  const { data: session, status } = useSession()

  const { PostDetail } = loadTheme('garden')

  if (status === 'loading') return null

  /**  not login */
  if (!session) {
    return (
      <div>
        <PostDetail
          site={site}
          creation={{
            ...creation,
            content: getContent(creation, true),
            readingTime: readingTime(creation.content),
          }}
          readable={false}
          next={next}
          prev={prev}
          className="min-h-[auto]"
        />

        <div className="relative mx-auto">
          <GateCover slug={creation.slug} />
        </div>
      </div>
    )
  }

  return (
    <MyPaidContent
      site={site}
      creationId={creationId}
      creation={creation}
      next={next}
      prev={prev}
    />
  )
}

export function MyPaidContent({
  site,
  creationId,
  creation: creation,
  next,
  prev,
}: Props) {
  const { PostDetail } = loadTheme('garden')
  const { data: subscription } = trpc.tier.mySubscriptionBySiteId.useQuery({
    siteId: site.id,
  })

  const isMember = useMemo(() => {
    if (!subscription) return false
    if (
      !subscription.sassCurrentPeriodEnd ||
      subscription.sassSubscriptionStatus === 'canceled'
    ) {
      return false
    }
    return new Date(subscription.sassCurrentPeriodEnd).getTime() > Date.now()
  }, [subscription])

  return (
    <div className="">
      <PostDetail
        site={site}
        creation={{
          ...creation,
          content: isMember ? getContent(creation) : getContent(creation, true),
          readingTime: readingTime(creation.content),
        }}
        readable={isMember}
        next={next}
        prev={prev}
        className={cn(!isMember && 'min-h-[auto]')}
      />
      {!isMember && (
        <div className="relative mx-auto">
          <GateCover slug={creation.slug} />
        </div>
      )}
    </div>
  )
}
