'use client'

import { Button } from '@penx/uikit/button'
import { Site } from '@penx/types'
import { Trans } from '@lingui/react'
import { PencilIcon, PenToolIcon } from 'lucide-react'

interface Props {
  className?: string
}

export const CreatePostButton = ({ className }: Props) => {
  return (
    <Button
      // size={'icon'}
      size="sm"
      // variant="outline"
      variant="ghost"
      className="gap-0.5 rounded-full"
      onClick={() => {
        //
      }}
    >
      {/* <PenToolIcon size={16} className="text-foreground/80" /> */}
      <span className="icon-[iconamoon--edit-light] size-5"></span>
      {/* <PencilIcon size={16} className="text-foreground/80" /> */}
      <Trans id="Write"></Trans>
    </Button>
  )
}
