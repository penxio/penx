import { CheckIcon } from 'lucide-react'
import { cn } from '@penx/utils'

interface ItemProps {
  className?: string
  onClick?: () => void
  children?: React.ReactNode
}

export function CardItem({ className, children, onClick }: ItemProps) {
  return (
    <div
      className={cn('flex h-12 items-center justify-between px-3', className)}
      onClick={() => {
        onClick && onClick()
      }}
    >
      {children}
    </div>
  )
}
