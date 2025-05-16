import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@penx/utils'

const badgeVariants = cva(
  'focus:ring-ring inline-flex items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground border-transparent',
        secondary:
          'bg-secondary text-secondary-foreground hover:bg-secondary/80 border-transparent',
        destructive:
          'bg-destructive text-destructive-foreground hover:bg-destructive/80 border-transparent',
        outline: 'text-foreground border',
        success:
          'border-transparent bg-green-500 text-white hover:bg-green-500/80',
        feature:
          'text-foreground/60 bg-background shrink-0 shadow-sm dark:bg-white/5',
      },

      size: {
        default: 'h-7 px-2 text-xs',
        sm: 'h-7 px-2 text-xs',
        md: 'h-8 px-2 text-xs',
        lg: 'h-9 px-3 text-sm',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, size, ...props }: BadgeProps) {
  return (
    <div
      className={cn(badgeVariants({ variant, size }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
