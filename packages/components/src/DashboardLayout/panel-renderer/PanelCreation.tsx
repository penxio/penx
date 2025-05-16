'use client'

import { Creation } from '@penx/components/Creation'
import { CreationMoreMenu } from '@penx/components/CreationMoreMenu'
import {
  PanelCreationProvider,
  usePanelCreationContext,
} from '@penx/components/PanelCreationProvider'
import { PublishDialog } from '@penx/components/PublishDialog'
import { BUILTIN_PAGE_SLUGS, ROOT_DOMAIN } from '@penx/constants'
import { CreationStatus } from '@penx/db/client'
import { getSiteDomain } from '@penx/libs/getSiteDomain'
import { Panel } from '@penx/types'
import { ClosePanelButton } from '../ClosePanelButton'
import { PanelHeaderWrapper } from '../PanelHeaderWrapper'
import { CreationLink } from './CreationLink'

interface Props {
  panel: Panel
  index: number
}

export function PanelCreation(props: Props) {
  return (
    <PanelCreationProvider
      creationId={props.panel?.creationId!}
      panel={props.panel}
    >
      <Content {...props}></Content>
    </PanelCreationProvider>
  )
}

export function Content({ panel, index }: Props) {
  const creation = usePanelCreationContext()

  return (
    <>
      <PublishDialog />
      <PanelHeaderWrapper index={index}>
        <div className="line-clamp-1 text-sm">{creation?.title}</div>
        <div className="flex items-center gap-1">
          {/* {creation?.status === CreationStatus.PUBLISHED && <AreaLink />} */}
          <CreationMoreMenu creation={creation} />
          <ClosePanelButton panel={panel} />
        </div>
      </PanelHeaderWrapper>
      <Creation panel={panel} className="" />
    </>
  )
}
