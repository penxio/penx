'use client'

import { useSession } from '@penx/session'
import { Button } from '@penx/uikit/ui/button'
import { usePathname } from '@/lib/i18n'
import { useRouter } from 'next/navigation'

interface Props {
  slug: string
}

export function GateCover({ slug }: Props) {
  const { data } = useSession()
  const { push } = useRouter()
  const pathname = usePathname()!
  return (
    <div className="from-background via-background/80 to-background/0 absolute bottom-0 -mt-16 flex h-80 w-full flex-col justify-center gap-6 bg-gradient-to-t from-50% via-90% to-95%">
      <div className="text-center text-2xl font-semibold">
        The creator made this a member only post.
      </div>
      <div className="flex items-center justify-center gap-3">
        <Button
          size="lg"
          className="w-48 rounded-xl"
          onClick={() => {
            push(`/subscribe?source=${pathname}`)
            // if (!isConnected) {
            //   openConnectModal?.()
            // }
            // if (data) {
            //   location.href = `/membership?post_slug=${slug}`
            // }
          }}
        >
          Become a member
        </Button>
      </div>
    </div>
  )
}
