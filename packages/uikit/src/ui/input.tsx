import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@penx/utils'

const inputVariants = cva('', {
  variants: {
    size: {
      default: 'h-10',
      sm: 'h-9 rounded-md',
      lg: 'h-11 rounded-lg text-base',
      xl: 'h-12 rounded-lg text-base',
    },
    variant: {
      default: '',
      mobile:
        'border-none bg-white shadow-none focus-visible:border-none focus-visible:ring-0 dark:bg-neutral-700/60',
      unstyled:
        'focus-visible:bg-foreground/5 hover:bg-foreground/5 border-none shadow-none focus-visible:border-none focus-visible:ring-0 dark:bg-transparent',
      panel:
        'border-none shadow-none focus-visible:border-none focus-visible:ring-0 dark:bg-transparent h-9 text-right',
      filled:
        'bg-foreground/5 border-none shadow-none focus-visible:border-none focus-visible:ring-0',
    },
  },
  defaultVariants: {
    size: 'default',
    variant: 'default',
  },
})

export type InputProps = Omit<React.ComponentProps<'input'>, 'size'> &
  VariantProps<typeof inputVariants>

function Input({ className, size, variant, type, ...props }: InputProps) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        'file:text-foreground placeholder:text-foreground/30 selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input shadow-xs text-foreground flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base outline-none transition-[color,box-shadow] file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
        // 'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
        'focus-visible:border-ring focus-visible:ring-1',
        'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',

        inputVariants({ size, variant, className }),
      )}
      {...props}
    />
  )
}

export { Input }
