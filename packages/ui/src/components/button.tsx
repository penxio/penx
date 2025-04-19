import * as React from 'react'
import { cn } from '@penx/utils'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'

const buttonVariants = cva(
  'ring-offset-background focus-visible:ring-ring inline-flex cursor-pointer items-center justify-center whitespace-nowrap rounded-xl text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        brand: 'bg-brand hover:bg-brand/80 text-white',
        destructive:
          'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline:
          'border-input bg-background hover:bg-accent hover:text-accent-foreground border',
        secondary:
          'bg-secondary text-secondary-foreground hover:bg-secondary/60 hover:ring-1 hover:ring-black/10',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
        farcaster: 'bg-purple-500 text-white hover:bg-purple-500/90',
        'outline-solid':
          'border-foreground hover:bg-foreground hover:text-background border',
      },
      size: {
        default: 'h-10 px-4 py-3',
        xs: 'h-8 rounded-lg px-3 text-xs',
        sm: 'h-9 rounded-xl px-3',
        lg: 'h-11 rounded-xl px-4',
        xl: 'h-13 rounded-xl px-4 text-base',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  },
)
Button.displayName = 'Button'

export { Button, buttonVariants }
