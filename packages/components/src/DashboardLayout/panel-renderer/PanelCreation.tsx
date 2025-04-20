'use client'

import { Creation } from '@penx/components/Creation/Creation'
import { CreationMoreMenu } from '@penx/components/Creation/CreationMoreMenu'
import {
  PanelCreationProvider,
  usePanelCreationContext,
} from '@penx/components/Creation/PanelCreationProvider'
import { PublishDialog } from '@penx/components/Creation/PublishDialog/PublishDialog'
import { useSiteContext } from '@penx/contexts/SiteContext'
import { BUILTIN_PAGE_SLUGS, ROOT_DOMAIN } from '@penx/constants'
import { getSiteDomain } from '@penx/libs/getSiteDomain'
import { Panel } from '@penx/types'
import { CreationStatus } from '@prisma/client'
import { GlobeIcon } from 'lucide-react'
import { ClosePanelButton } from '../ClosePanelButton'
import { PanelHeaderWrapper } from '../PanelHeaderWrapper'

interface Props {
  panel: Panel
  index: number
}

export function PanelCreation(props: Props) {
  return (
    <PanelCreationProvider
      panel={props.panel}
      creationId={props.panel?.creation?.id!}
    >
      <Content {...props}></Content>
    </PanelCreationProvider>
  )
}

export function Content({ panel, index }: Props) {
  const creation = usePanelCreationContext()
  const site = useSiteContext()
  const { isSubdomain, domain } = getSiteDomain(site as any)
  const host = isSubdomain ? `${domain}.${ROOT_DOMAIN}` : domain
  let prefix = '/creations'
  if (BUILTIN_PAGE_SLUGS.includes(creation?.slug)) {
    prefix = ''
  }

  return (
    <>
      <PublishDialog />
      <PanelHeaderWrapper index={index}>
        <div className="line-clamp-1 text-sm">{creation?.title}</div>
        <div className="flex items-center gap-1">
          {creation?.status === CreationStatus.PUBLISHED && (
            <div className="hidden items-center gap-1 md:flex">
              <a
                href={`${location.protocol}//${host}${prefix}/${creation.slug}`}
                target="_blank"
                className="text-foreground/40 hover:text-foreground/80 flex items-center gap-1 text-sm"
              >
                <GlobeIcon size={14} />
              </a>
            </div>
          )}
          <CreationMoreMenu creation={creation} />
          <ClosePanelButton panel={panel} />
        </div>
      </PanelHeaderWrapper>
      <div className="flex-1 overflow-y-auto overflow-x-hidden p-3">
        <Creation index={index} />
      </div>
    </>
  )
}
