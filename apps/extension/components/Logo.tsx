import { cn } from '@penx/utils'

interface Props {
  className?: string
}
export function Logo({ className }: Props) {
  return (
    <img
      src="https://penx.io/logo.png"
      alt=""
      className={cn('h-20 w-20', className)}
    />
  )
}
