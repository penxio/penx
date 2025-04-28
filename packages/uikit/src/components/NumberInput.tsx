import React, { forwardRef } from 'react'
import { Input, InputProps } from '@penx/uikit/input'
import { matchNumber } from '@penx/utils'

export interface NumberInputProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    'onChange' | 'size'
  > {
  precision?: number
  onChange?: (value: string) => void
}

export const NumberInput = forwardRef<
  HTMLInputElement,
  NumberInputProps & Omit<InputProps, 'onChange'>
>(function NumberInput({ onChange, precision = 6, ...rest }, ref) {
  return (
    <Input
      ref={ref}
      placeholder="0.0"
      {...rest}
      onChange={(e) => {
        let value = e.target.value
        if ((e.nativeEvent as any)?.data === '。') {
          value = value.replace('。', '.')
        }

        if (!matchNumber(value, precision) && value.length) {
          if (/^\.\d+$/.test(value)) {
            onChange?.('0' + value)
            e.preventDefault()
          }

          return
        }

        onChange?.(value)
      }}
    />
  )
})
