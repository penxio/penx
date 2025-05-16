import * as React from 'react'
import { cn } from '@penx/utils'
import { PlateStatic, type PlateStaticProps } from '@udecode/plate'
import type { VariantProps } from 'class-variance-authority'
import { cva } from 'class-variance-authority'

export const editorVariants = cva(
  cn(
    'group/editor',
    'relative w-full cursor-text select-text overflow-x-hidden whitespace-pre-wrap break-words',
    'ring-offset-background rounded-md focus-visible:outline-none',
    'placeholder:text-muted-foreground/80 **:data-slate-placeholder:top-[auto_!important] **:data-slate-placeholder:text-muted-foreground/80 **:data-slate-placeholder:opacity-100!',
    '[&_strong]:font-bold',
  ),
  {
    defaultVariants: {
      variant: 'none',
    },
    variants: {
      disabled: {
        true: 'cursor-not-allowed opacity-50',
      },
      focused: {
        true: 'ring-ring ring-2 ring-offset-2',
      },
      variant: {
        ai: 'w-full px-0 text-base md:text-sm',
        aiChat:
          'max-h-[min(70vh,320px)] w-full max-w-[700px] overflow-y-auto px-5 py-3 text-base md:text-sm',
        default:
          'size-full px-16 pb-72 pt-4 text-base sm:px-[max(64px,calc(50%-350px))]',
        demo: 'size-full px-16 pb-72 pt-4 text-base sm:px-[max(64px,calc(50%-350px))]',
        fullWidth: 'size-full px-16 pb-72 pt-4 text-base sm:px-24',
        none: '',
        select: 'data-readonly:w-fit px-3 py-2 text-base',
      },
    },
  },
)

export function EditorStatic({
  className,
  variant,
  ...props
}: PlateStaticProps & VariantProps<typeof editorVariants>) {
  return (
    <PlateStatic
      className={cn(editorVariants({ variant }), className)}
      {...props}
    />
  )
}
