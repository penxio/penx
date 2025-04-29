import { type ComponentType } from 'react'
import { AppType } from '@penx/constants'
import { cn } from '@penx/utils'
import { type LucideProps } from 'lucide-react'

interface FeatureEntryProps {
  className?: string
  name: string
  type: AppType
  icon: ComponentType<LucideProps>
  onClick?: () => void
}

export function FeatureEntry({
  name,
  type,
  icon: Icon,
  className,
  onClick,
}: FeatureEntryProps) {
  return (
    <div
      className={cn(
        'group flex cursor-pointer flex-col gap-3 rounded-xl bg-foreground/5 p-2 hover:bg-foreground/10',
        className,
      )}
      onClick={() => onClick?.()}
    >
      <div className="origin-left text-sm font-medium transition-all group-hover:scale-105">
        {name}
      </div>
      <Icon
        size={20}
        className="origin-left transition-all group-hover:scale-105"
      />
    </div>
  )
}
