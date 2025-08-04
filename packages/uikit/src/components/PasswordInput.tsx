import React, { forwardRef, useState } from 'react'
import { EyeIcon, EyeOffIcon } from 'lucide-react'
import { Input, InputProps } from '@penx/uikit/input'
import { cn, matchNumber } from '@penx/utils'

export interface PasswordInputProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    'onChange' | 'size'
  > {
  precision?: number
  onChange?: (value: string) => void
}

export const PasswordInput = forwardRef<
  HTMLInputElement,
  PasswordInputProps & Omit<InputProps, 'onChange'>
>(function PasswordInput({ onChange, ...rest }, ref) {
  const [show, setShow] = useState(false)
  return (
    <div className="relative flex">
      <Input
        ref={ref}
        type={show ? 'text' : 'password'}
        {...rest}
        className={cn(rest.className, '!pr-7')}
        onChange={(e) => {
          onChange?.(e.target.value)
        }}
      />
      <div
        className="absolute bottom-0 right-0 top-0 flex w-7 cursor-pointer items-center justify-center"
        onClick={() => {
          setShow(!show)
        }}
      >
        {!show && <EyeOffIcon size={16} />}
        {show && <EyeIcon size={16} />}
      </div>
    </div>
  )
})
