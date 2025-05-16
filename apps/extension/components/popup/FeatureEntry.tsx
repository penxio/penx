import { type ComponentType } from 'react'
import { type LucideProps } from 'lucide-react'
import { AppType } from '@penx/constants'
import { cn } from '@penx/utils'

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
        'bg-foreground/5 hover:bg-foreground/10 group flex cursor-pointer flex-col gap-3 rounded-xl p-2',
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
