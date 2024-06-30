import React, { FC, forwardRef, PropsWithChildren } from 'react'
import { Box } from '@fower/react'
import { FormRegisterProps, useFormContext } from 'fomir'

export const Form: FC<PropsWithChildren<FormRegisterProps>> = forwardRef<
  HTMLFormElement,
  PropsWithChildren<FormRegisterProps>
>(function FormNode({ children, submitForm }, ref) {
  const form = useFormContext()
  const { layout = 'vertical' } = form.schema

  return (
    <Box
      as="form"
      className={`uikit-form-${layout}`}
      onSubmit={submitForm}
      ref={ref as any}
      display={layout === 'inline' ? 'flex' : 'block'}
      toCenterY={layout === 'inline'}
      gapX5={layout === 'inline'}
      gapY5
      flexWrap={layout === 'inline'}
    >
      {children}
    </Box>
  )
})
