import { memo, useEffect, useRef, useState } from 'react'
import { t } from '@lingui/core/macro'
import { Input, InputProps } from '@penx/uikit/ui/input'

interface Props extends Omit<InputProps, 'onChange'> {
  value: string
  onChange: (v: string) => void
}
export const TextInputProp = memo(
  function TextInputProp({ value = '', onChange, ...rest }: Props) {
    const ref = useRef<HTMLInputElement>(null)
    useEffect(() => {
      if (!ref.current) return
      if (value !== ref.current?.value) {
        ref.current!.value = value
      }
    }, [value])
    return (
      <Input
        ref={ref}
        placeholder={t`Empty`}
        className=""
        type="text"
        defaultValue={value ?? ''}
        onChange={(e) => onChange(e.target.value)}
        {...rest}
      />
    )
  },
  (prev, next) => {
    return prev.value === next.value
  },
)
