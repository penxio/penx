import { useEffect, useRef } from 'react'
import { t } from '@lingui/core/macro'
import { Input, InputProps } from '@penx/uikit/ui/input'
import { AIModelSelect } from '../../AIModelSelect'

interface Props {
  isPanel?: boolean
  className?: string
  value: string
  onChange: (v: string) => void
}

export const AIModelSelectProp = ({ value = '', onChange, ...rest }: Props) => {
  const [type, modelId, modelName] = value.split(':')

  return (
    <AIModelSelect
      className="h-9 w-full justify-between rounded-md border pl-2 pr-1"
      contentClassName="w-[var(--radix-popover-trigger-width)]"
      commandClassName="max-h-[200px]"
      value={{
        type: type as any,
        model: {
          id: modelId,
          label: modelName,
        },
      }}
      onChange={(v) => onChange(`${v.type}:${v.model.id}:${v.model.label}`)}
    />
  )
}
