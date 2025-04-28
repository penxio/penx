'use client'

import { useState } from 'react'
import { Trans } from '@lingui/react'
import { Creation } from '@penx/types'
import { Button } from '@penx/uikit/button'
import { Input } from '@penx/uikit/input'
import { Label } from '@penx/uikit/label'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@penx/uikit/sheet'
import { CommentWidget } from '@penx/widgets/CommentWidget/CommentWidget'
import { CommentAmount } from './CommentAmount'

interface Props {
  creation: Creation
}

export function CommentSheet({ creation }: Props) {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <>
      <CommentAmount creation={creation as any} setIsOpen={setIsOpen} />
      <Sheet open={isOpen} onOpenChange={(v) => setIsOpen(v)}>
        <SheetContent className="flex flex-col gap-6 overflow-y-auto">
          <SheetHeader>
            <SheetTitle>
              <Trans id="Comments"></Trans>
            </SheetTitle>
          </SheetHeader>
          <div className="px-4">
            <CommentWidget creationId={creation.id} isInPage={false} />
          </div>
        </SheetContent>
      </Sheet>
    </>
  )
}
