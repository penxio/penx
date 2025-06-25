'use client'

import * as React from 'react'
import { Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@penx/uikit/alert-dialog'
import { Button } from '@penx/uikit/button'
import { LoadingDots } from '@penx/uikit/loading-dots'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@penx/uikit/tooltip'
import { extractErrorMessage } from '@penx/utils/extractErrorMessage'

interface Props {
  title: React.ReactNode
  content: React.ReactNode
  onConfirm: () => Promise<any>
  tooltipContent?: React.ReactNode
  children?: React.ReactNode
}

export const ConfirmDialog = React.forwardRef<HTMLDivElement, Props>(
  function ConfirmDialog(
    { title, children, content, onConfirm, tooltipContent },
    ref,
  ) {
    const [isOpen, setIsOpen] = React.useState(false)
    const [isLoading, setIsLoading] = React.useState(false)

    return (
      <AlertDialog open={isOpen} onOpenChange={(v) => setIsOpen(v)}>
        <AlertDialogTrigger asChild>
          <TooltipProvider delayDuration={50}>
            <Tooltip>
              <TooltipTrigger asChild onClick={() => setIsOpen(true)}>
                {children || (
                  <Trash2 className="text-destructive hover:text-destructive/90 h-4 w-4 cursor-pointer" />
                )}
              </TooltipTrigger>

              {tooltipContent && (
                <TooltipContent>
                  <div>{tooltipContent}</div>
                </TooltipContent>
              )}
            </Tooltip>
          </TooltipProvider>
        </AlertDialogTrigger>
        <AlertDialogContent ref={ref} className="z-[100000]">
          <AlertDialogHeader>
            <AlertDialogTitle>{title}</AlertDialogTitle>
            <AlertDialogDescription>{content}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              className="w-24"
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </AlertDialogCancel>
            <Button
              disabled={isLoading}
              className="w-24"
              onClick={async () => {
                setIsLoading(true)
                try {
                  await onConfirm()
                  setIsOpen(false)
                } catch (error) {
                  toast.error(extractErrorMessage(error) || 'Failed to delete')
                }
                setIsLoading(false)
              }}
            >
              {isLoading ? <LoadingDots /> : 'Confirm'}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    )
  },
)
