import React, { FC, forwardRef } from 'react'
import { Box, Colors, FowerHTMLProps, fowerStore } from '@fower/react'
import { upFirst } from '@fower/utils'

export interface TextareaProps extends FowerHTMLProps<'textarea'> {
  colorScheme?: keyof Colors
  size?: 'sm' | 'md' | 'lg'
  variant?: 'outline' | 'unstyled' | 'filled'
}

export const Textarea = forwardRef<HTMLDivElement, TextareaProps>(function Textarea(
  props: TextareaProps,
  ref,
) {
  const { colorScheme = 'brand500', size = 'md', variant = 'outline', ...rest } = props

  const { disabled } = props
  const color = fowerStore.theme.colors[colorScheme]

  const attrs: any = {}
  if (variant !== 'unstyled') {
    attrs[`border${upFirst(colorScheme)}--focus`] = true
  }

  const variants = {
    outline: {
      border: true,
      'borderColor--focus': color,
      'borderGray200--T30': true,
      'borderGray700--dark': true,
      'borderTransparent--dark--focus': true,
    },
    filled: {
      bgGray100: true,
      border: true,
      borderTransparent: true,
      'bgGray200--hover': !disabled,
      'borderColor--focus': color,
      'shadow--focus': `0 0 0 1px ${color}`,
    },
    unstyled: {
      border: 'none',
      'border--focus': 'none',
      'shadow--focus': 'none',
      px: 0,
    },
  }

  return (
    <Box
      className="uikit-textarea"
      as="textarea"
      ref={ref}
      textSM
      rounded-6
      w-100p
      minH-100
      pl-8
      pr-8
      py-8
      gray800
      bgWhite
      outlineNone
      transitionCommon
      duration-300
      opacity-40={!!disabled}
      bgTransparent--focus
      bgTransparent--dark
      cursorNotAllowed={!!disabled}
      {...variants[variant]}
      {...(rest as any)}
      {...attrs}
    />
  )
})

Textarea.displayName = 'Textarea'
;(Textarea as any).id = 'Textarea'
