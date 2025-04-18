'use client'

import { useState } from 'react'
import { CommentWidget } from '@/components/CommentWidget'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { Creation } from '@/lib/theme.types'
import { Trans } from '@lingui/react/macro'
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
              <Trans>Comments</Trans>
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
