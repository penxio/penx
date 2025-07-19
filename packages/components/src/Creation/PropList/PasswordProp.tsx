import { useState } from 'react'
import { Input } from '@penx/uikit/ui/input'

interface Props {
  value: string
  onChange: (v: string) => void
}
export const PasswordProp = ({ value = '', onChange }: Props) => {
  const [show, setShow] = useState(false)
  return (
    <Input
      placeholder=""
      variant="unstyled"
      className=""
      type={show ? 'text' : 'password'}
      defaultValue={value}
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
