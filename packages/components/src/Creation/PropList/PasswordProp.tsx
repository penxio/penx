import { useState } from 'react'
import { t } from '@lingui/core/macro'
import { Input, InputProps } from '@penx/uikit/ui/input'

interface Props extends Omit<InputProps, 'onChange'> {
  value: string
  onChange: (v: string) => void
}
export const PasswordProp = ({ value = '', onChange, ...rest }: Props) => {
  const [show, setShow] = useState(false)
  return (
    <Input
      placeholder={t`Empty`}
      variant="unstyled"
      className=""
      type={show ? 'text' : 'password'}
      defaultValue={value}
      {...rest}
      onFocus={() => {
        setShow(true)
      }}
      onBlur={() => {
        setShow(false)
      }}
      onChange={(e) => {
        onChange(e.target.value)
      }}
    />
  )
}
