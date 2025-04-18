'use client'

import { useAreaContext } from '@/components/AreaContext'
import { Link } from '@/lib/i18n'
import { Trans } from '@lingui/react/macro'
import { Creation } from '@penx/db/client'

interface CreationItemProps {
  creation: Creation
}

export function CreationItem({ creation }: CreationItemProps) {
  const field = useAreaContext()
  return (
    <Link
      href={`/areas/${field.slug}/${creation.slug}`}
      className="hover:bg-foreground/5 group flex h-7 cursor-pointer items-center gap-2 rounded py-1 pl-2 pr-1 transition-all"
    >
      <div className="line-clamp-1 flex-1 text-sm">
        {creation.title || 'Untitled'}
      </div>
    </Link>
  )
}
