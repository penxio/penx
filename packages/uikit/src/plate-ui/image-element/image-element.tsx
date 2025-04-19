'use client'

import React from 'react'
import { getBlockClassName, getUrl } from '@penx/utils'
import { cn, withRef } from '@udecode/cn'
import { useDraggable } from '@udecode/plate-dnd'
import { Image, ImagePlugin, useMediaState } from '@udecode/plate-media/react'
import { ResizableProvider, useResizableValue } from '@udecode/plate-resizable'
import { PlateElement, withHOC } from '@udecode/plate/react'
import { Caption, CaptionTextarea } from '../caption'
import { MediaPopover } from '../media-popover'
import {
  mediaResizeHandleVariants,
  Resizable,
  ResizeHandle,
} from '../resizable'
import { UploadBox } from './UploadBox'

export const ImageElement = withHOC(
  ResizableProvider,
  withRef<typeof PlateElement>((props, ref) => {
    const { children, className, nodeProps, ...rest } = props
    const { align = 'center', focused, readOnly, selected } = useMediaState()

    const width = useResizableValue('width')

    const { isDragging, handleRef } = useDraggable({
      element: props.element,
    })
    if (!rest.element.url) {
      return (
        <PlateElement
          ref={ref}
          className={cn('py-2.5', className)}
          {...rest}
          contentEditable={false}
        >
          <UploadBox {...props}></UploadBox>
        </PlateElement>
      )
    }

    return (
      <MediaPopover plugin={ImagePlugin}>
        <PlateElement
          ref={ref}
          {...props}
          className={cn(props.className, className, 'py-2.5')}
        >
          <figure className="group relative m-0" contentEditable={false}>
            <Resizable
              align={align}
              options={{
                align,
                readOnly,
              }}
            >
              <ResizeHandle
                className={mediaResizeHandleVariants({ direction: 'left' })}
                options={{ direction: 'left' }}
              />
              <Image
                ref={handleRef}
                className={cn(
                  'block w-full max-w-full cursor-pointer object-cover px-0',
                  'rounded-sm',
                  focused && selected && 'ring-ring ring-2 ring-offset-2',
                  isDragging && 'opacity-50',
                  getBlockClassName(props),
                )}
                src={getUrl(rest.element.url as string)}
                alt=""
                {...nodeProps}
              />
              <ResizeHandle
                className={mediaResizeHandleVariants({
                  direction: 'right',
                })}
                options={{ direction: 'right' }}
              />
            </Resizable>

            <Caption style={{ width }} align={align}>
              <CaptionTextarea
                readOnly={readOnly}
                onFocus={(e) => {
                  e.preventDefault()
                }}
                placeholder="Write a caption..."
              />
            </Caption>
          </figure>

          {children}
        </PlateElement>
      </MediaPopover>
    )
  }),
)
