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
      unstyled:
        'border-none shadow-none focus-visible:border-none focus-visible:ring-0 dark:bg-transparent',
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
        'file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input shadow-xs flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base outline-none transition-[color,box-shadow] file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
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
