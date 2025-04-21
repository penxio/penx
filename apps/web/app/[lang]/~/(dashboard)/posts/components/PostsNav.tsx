'use client'

import { Trans } from '@lingui/react'
import { Link, usePathname } from '@penx/libs/i18n'
import { cn } from '@penx/utils'

interface Props {}

export function PostsNav({}: Props) {
  const pathname = usePathname()

  const Paths = {
    published: '/~/posts',
    drafts: '/~/creations/drafts',
    archived: '/~/creations/archived',
  }

  const linkClassName = (path: string) =>
    cn(
      'item-center -mb-[1px] inline-flex justify-center border-b-2 py-1.5',
      path !== pathname && 'border-transparent',
      path === pathname && 'border-foreground/80',
    )

  return (
    <div className="border-foreground/10 flex gap-8 border-b">
      <Link href={Paths.drafts} className={linkClassName(Paths.drafts)}>
        <Trans id="Drafts"></Trans>
      </Link>

      <Link href={Paths.published} className={linkClassName(Paths.published)}>
        <Trans id="Published"></Trans>
      </Link>

      <Link href={Paths.archived} className={linkClassName(Paths.archived)}>
        <Trans id="Archived"></Trans>
      </Link>
    </div>
  )
}
