'use client'

import { useLoginDialog } from '@/components/LoginDialog/useLoginDialog'
import { useSession } from '@/components/session'
import { ContentRender } from '@/components/theme-ui/ContentRender'
import { Button } from '@/components/ui/button'
import { Creation, Site } from '@/lib/theme.types'
import Image from 'next/image'
import { usePathname } from 'next/navigation'

interface Props {
  site: Site
  about: any
}

export const AboutCard = ({ site, about }: Props) => {
  const { data } = useSession()
  const { setIsOpen } = useLoginDialog()
  const pathname = usePathname()
  return (
    <div className="hover:text-foreground text-foreground/80 drop-shadow-xs mb-10 p-5">
      <div className="mb-4 flex shrink-0 flex-col">
        {site.logo && (
          <Image
            src={site.logo}
            alt="avatar"
            width={192}
            height={192}
            className="h-20 w-20 rounded-full"
          />
        )}
        <h3 className="pb-2 pt-4 text-2xl font-bold leading-8 tracking-tight">
          {site.name}
        </h3>
        <div className="text-foreground/60">{site.description}</div>
      </div>

      <Button
        size="lg"
        className="w-full rounded-xl"
        onClick={() => {
          // if (!isConnected) {
          //   openConnectModal?.()
          // }

          if (!data) {
            setIsOpen(true)
          }
          if (data) {
            location.href = `/subscribe?source=${pathname}`
          }
        }}
      >
        Become a member
      </Button>
    </div>
  )
}
