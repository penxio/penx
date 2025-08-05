import { useEffect, useRef } from 'react'
import { t } from '@lingui/core/macro'
import { Textarea, TextareaProps } from '@penx/uikit/ui/textarea'

interface Props extends Omit<TextareaProps, 'onChange'> {
  value: string
  onChange: (v: string) => void
}
export const TextareaProp = ({ value = '', onChange, ...rest }: Props) => {
  const ref = useRef<HTMLTextAreaElement>(null)
  useEffect(() => {
    if (!ref.current) return
    if (value !== ref.current?.value) {
      ref.current!.value = value
    }
  }, [value])
  return (
    <Textarea
      ref={ref}
      placeholder={t`Empty`}
      className="bg-transparent"
      defaultValue={value ?? ''}
      onChange={(e) => onChange(e.target.value)}
      {...rest}
    />
  )
}
