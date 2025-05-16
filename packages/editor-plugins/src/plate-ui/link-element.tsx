'use client'

import * as React from 'react'
import type { TLinkElement } from '@udecode/plate-link'
import { useLink } from '@udecode/plate-link/react'
import type { PlateElementProps } from '@udecode/plate/react'
import { PlateElement } from '@udecode/plate/react'

export function LinkElement(props: PlateElementProps<TLinkElement>) {
  const { props: linkProps } = useLink({ element: props.element })

  return (
    <PlateElement
      {...props}
      as="a"
      className="text-primary decoration-primary font-medium underline underline-offset-4"
      attributes={{
        ...props.attributes,
        ...(linkProps as any),
      }}
    >
      {props.children}
    </PlateElement>
  )
}
