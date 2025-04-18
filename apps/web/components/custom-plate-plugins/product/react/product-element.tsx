'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { extractErrorMessage } from '@/lib/extractErrorMessage'
import { api, trpc } from '@/lib/trpc'
import { getUrl, isValidUUIDv4 } from '@/lib/utils'
import { useMutation } from '@tanstack/react-query'
import { cn, withRef } from '@udecode/cn'
import { PlateElement, usePlateEditor } from '@udecode/plate/react'
import Image from 'next/image'
import { setNodes } from 'slate'
import { ReactEditor, useSlate } from 'slate-react'
import { toast } from 'sonner'
import { TProductElement } from '../lib'
import { ProductCard } from './ProductCard'

export const ProductElement = withRef<typeof PlateElement>((props, ref) => {
  // const editor = usePlateEditor()
  const editor = useSlate()
  const { children, className, nodeProps, ...rest } = props
  const [value, setValue] = useState('')

  const { isPending, mutateAsync } = useMutation({
    mutationKey: ['product'],
    mutationFn: async (id: string) => {
      return await api.product.byId.query(id)
    },
  })

  if (!rest.element.productId) {
    return (
      <PlateElement
        ref={ref}
        className={cn(
          'border-foreground/5 space-y-1 rounded-2xl border p-4',
          className,
        )}
        {...rest}
        contentEditable={false}
      >
        <div className="text-foreground/60 text-sm">Enter product ID</div>
        <div className="flex items-center gap-1">
          <Input
            placeholder="Product ID"
            value={value}
            onChange={(e) => setValue(e.target.value.trim())}
          />
          <Button
            disabled={isPending || !value}
            onClick={async () => {
              try {
                if (!isValidUUIDv4(value)) throw new Error('Invalid product ID')
                await mutateAsync(value)
                const path = ReactEditor.findPath(editor as any, props.element)
                setNodes<TProductElement>(
                  editor as any,
                  { productId: value },
                  { at: path },
                )
              } catch (error) {
                toast.error(
                  extractErrorMessage(error) || 'Failed to load product',
                )
              }
            }}
          >
            Save
          </Button>
        </div>
      </PlateElement>
    )
  }

  return (
    <PlateElement
      ref={ref}
      {...props}
      className={cn(props.className, className)}
      contentEditable={false}
    >
      <ProductCard productId={props.element.productId as string} />
      {children}
    </PlateElement>
  )
})
