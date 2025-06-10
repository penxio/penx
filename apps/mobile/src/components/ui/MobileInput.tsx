import { ReactNode } from 'react'
import { Input, InputProps } from '@penx/uikit/ui/input'

interface Props extends InputProps {
  isRequired?: boolean
  label: ReactNode
}

export function MobileInput({ label, isRequired, ...props }: Props) {
  return (
    <div className="flex h-11 items-center gap-2">
      <div className="flex shrink-0 items-center gap-0.5 pl-3">
        {label}
        {isRequired && <span className="text-red-500">*</span>}
      </div>
      <Input
        variant="unstyled"
        className="text-right focus-visible:bg-transparent"
        {...props}
      />
    </div>
  )
}
