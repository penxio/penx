import { useEffect, useRef } from 'react'
import { t } from '@lingui/core/macro'
import { NumberInput } from '@penx/uikit/components/NumberInput'
import { InputProps } from '@penx/uikit/ui/input'

interface Props extends Omit<InputProps, 'onChange'> {
  value: string
  onChange: (v: string) => void
}
export const NumberInputProp = ({ value = '', onChange, ...rest }: Props) => {
  const ref = useRef<HTMLInputElement>(null)
  useEffect(() => {
    if (!ref.current) return
    if (value !== ref.current?.value) {
      ref.current!.value = value
    }
  }, [value])

  return (
    <NumberInput
      ref={ref}
      placeholder={t`Empty`}
      className=""
      precision={18}
      type="text"
      defaultValue={value ?? ''}
      onChange={(value) => onChange(value)}
      {...rest}
    />
  )
}
