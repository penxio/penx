import React from 'react'
import { cn } from '@udecode/cn'
import type { SlateElementProps } from '@udecode/plate'
import { SlateElement } from '@udecode/plate'
import { ProductCard } from './ProductCard'

export const ProductElementStatic = ({
  children,
  className,
  ...props
}: SlateElementProps) => {
  const productId = props.element.productId as string
  if (!productId) return null

  return (
    <SlateElement className={cn(className, 'm-0 px-0 py-1')} {...props}>
      <ProductCard productId={productId} />
      {children}
    </SlateElement>
  )
}
