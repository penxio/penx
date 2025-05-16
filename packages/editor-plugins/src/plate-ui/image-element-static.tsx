import * as React from 'react'
import { cn } from '@penx/utils'
import type { SlateElementProps } from '@udecode/plate'
import { NodeApi, SlateElement } from '@udecode/plate'
import type { TCaptionElement } from '@udecode/plate-caption'
import type { TImageElement } from '@udecode/plate-media'

export function ImageElementStatic(
  props: SlateElementProps<TImageElement & TCaptionElement & { width: number }>,
) {
  const { align = 'center', caption, url, width } = props.element

  return (
    <SlateElement {...props} className="py-2.5">
      <figure className="group relative m-0 inline-block" style={{ width }}>
        <div
          className="relative min-w-[92px] max-w-full"
          style={{ textAlign: align }}
        >
          <img
            className={cn(
              'w-full max-w-full cursor-default object-cover px-0',
              'rounded-sm',
            )}
            alt={(props.attributes as any).alt}
            src={url}
          />
          {caption && (
            <figcaption className="mx-auto mt-2 h-[24px] max-w-full">
              {NodeApi.string(caption[0])}
            </figcaption>
          )}
        </div>
      </figure>
      {props.children}
    </SlateElement>
  )
}
