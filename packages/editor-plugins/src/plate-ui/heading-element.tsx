'use client'

import * as React from 'react'
import type { PlateElementProps } from '@udecode/plate/react'
import { PlateElement } from '@udecode/plate/react'
import { cva, type VariantProps } from 'class-variance-authority'

const headingVariants = cva('relative mb-1', {
  variants: {
    variant: {
      h1: 'font-heading mt-[1em] pb-1 text-4xl font-bold',
      h2: 'font-heading mt-[0.8em] pb-px text-2xl font-semibold tracking-tight',
      h3: 'font-heading mt-[0.7m] pb-px text-xl font-semibold tracking-tight',
      h4: 'font-heading mt-[0.6em] text-lg font-semibold tracking-tight',
      h5: 'mt-[0.6em] text-lg font-semibold tracking-tight',
      h6: 'mt-[0.6em] text-base font-semibold tracking-tight',
    },
  },
})

export function HeadingElement({
  variant = 'h1',
  ...props
}: PlateElementProps & VariantProps<typeof headingVariants>) {
  return (
    <PlateElement
      as={variant!}
      className={headingVariants({ variant })}
      {...props}
    >
      {props.children}
    </PlateElement>
  )
}
