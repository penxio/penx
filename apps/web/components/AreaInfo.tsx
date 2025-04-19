'use client'

import { useAreaContext } from '@/components/AreaContext'
import { useAreaDialog } from '@/components/AreaDialog/useAreaDialog'
import { useSiteContext } from '@/components/SiteContext'
import { Avatar, AvatarFallback, AvatarImage } from '@penx/ui/components/avatar'
import { Badge } from '@penx/ui/components/badge'
import { Button } from '@penx/ui/components/button'
import { updateSiteState } from '@/hooks/useSite'
import { ROOT_DOMAIN } from '@/lib/constants'
import { getSiteDomain } from '@/lib/getSiteDomain'
import { useRouter } from '@/lib/i18n'
import { api } from '@/lib/trpc'
import { cn, getUrl } from '@/lib/utils'
import { Trans } from '@lingui/react/macro'
import { AreaType } from '@penx/db/client'
import { GlobeIcon, PencilIcon, TrashIcon } from 'lucide-react'
import { ConfirmDialog } from './ConfirmDialog'

interface Props {
  className?: string
}

export function AreaInfo({ className }: Props) {
  const field = useAreaContext()
  const { setState } = useAreaDialog()
  const { push } = useRouter()
  const site = useSiteContext()
  const { isSubdomain, domain } = getSiteDomain(site as any)
  const host = isSubdomain ? `${domain}.${ROOT_DOMAIN}` : domain
  return (
    <div className={cn('flex justify-between', className)}>
      <div className="flex items-center gap-2">
        <Avatar>
          <AvatarImage src={getUrl(field.logo || '')} />
          <AvatarFallback>{field.name.slice(0, 1)}</AvatarFallback>
        </Avatar>
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold">{field.name}</h2>
            {field.type === AreaType.BOOK && (
              <Badge>
                <Trans>Book</Trans>
              </Badge>
            )}

            {field.type === AreaType.COLUMN && (
              <Badge>
                <Trans>Column</Trans>
              </Badge>
            )}
            <a
              href={`${location.protocol}//${host}/areas/${field.slug}`}
              target="_blank"
              className="text-foreground/60 hover:text-foreground inline-flex cursor-pointer"
            >
              <GlobeIcon size={20} />
            </a>
          </div>
          <div className="text-foreground/60">{field.description}</div>
        </div>
      </div>
      <div className="flex gap-1">
        <Button
          variant="secondary"
          size="icon"
          className="size-9"
          onClick={() => {
            setState({
              isOpen: true,
              area: field,
            })
          }}
        >
          <PencilIcon size={20} className="text-foreground/60" />
        </Button>

        <ConfirmDialog
          title="Delete this field?"
          content="Are you sure you want to delete this field?"
          tooltipContent="Delete this field"
          onConfirm={async () => {
            await api.area.deleteArea.mutate({
              id: field.id,
            })
            const nextField = site.areas.find((f) => field.isGenesis)
            push(`/~/areas/${nextField?.id}`)
            updateSiteState({
              areas: site.areas.filter((f) => f.id !== field.id),
            })
          }}
        >
          <Button
            variant="destructive"
            size="icon"
            className="size-9 opacity-70"
          >
            <TrashIcon size={20} className="" />
          </Button>
        </ConfirmDialog>
      </div>
    </div>
  )
}
