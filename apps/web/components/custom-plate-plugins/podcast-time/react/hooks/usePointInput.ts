import React, { useEffect, useRef } from 'react'
import { isHotkey } from '@udecode/plate'
import { useEditorRef, useElement } from '@udecode/plate/react'
import { TPodcastTimeElement } from '../../lib'

export const usePointInput = ({
  isInline,
  open,
  onClose,
}: {
  isInline?: boolean
  open?: boolean
  onClose?: () => void
}) => {
  const editor = useEditorRef()
  const element = useElement<TPodcastTimeElement>()
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const [pointInput, setPointInput] = React.useState<string>(
    element.point || '',
  )

  const initialPointRef = useRef<string>(element.point)

  useEffect(() => {
    if (open) {
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus()
          inputRef.current.select()

          if (isInline) {
            initialPointRef.current = element.point
          }
        }
      }, 0)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  useEffect(() => {
    const setPoint = () => {
      editor.tf.setNodes<TPodcastTimeElement>(
        {
          point: pointInput || '',
        },
        { at: element },
      )
    }
    // When the cursor is inside an inline equation, the popover needs to open.
    // However, during an undo operation, the cursor focuses on the inline equation, triggering the popover to open, which disrupts the normal undo process.
    // So we need to remove the inline equation focus in one times undo.
    // block equation will not block the undo process because it will not open the popover by focus.
    // The disadvantage of this approach for block equation is that the popover cannot be opened using the keyboard.
    isInline ? editor.tf.withMerging(setPoint) : setPoint()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pointInput])

  const onSubmit = () => {
    onClose?.()
  }

  const onDismiss = () => {
    if (isInline) {
      editor.tf.setNodes(
        {
          texExpression: initialPointRef.current,
        },
        { at: element },
      )
    }

    onClose?.()
  }

  return {
    props: {
      value: pointInput,
      onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setPointInput(e.target.value)
      },
      onKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (isHotkey('enter')(e)) {
          e.preventDefault()
          onSubmit()
        } else if (isHotkey('escape')(e)) {
          e.preventDefault()
          onDismiss()
        }
        if (isInline) {
          const { selectionEnd, selectionStart, value } =
            e.target as HTMLInputElement

          // at the left edge
          if (
            selectionStart === 0 &&
            selectionEnd === 0 &&
            isHotkey('ArrowLeft')(e)
          ) {
            editor.tf.select(element, {
              previous: true,
            })
          }
          // at the right edge
          if (
            selectionEnd === value.length &&
            selectionStart === value.length &&
            isHotkey('ArrowRight')(e)
          ) {
            editor.tf.select(element, { next: true })
          }
        }
      },
    },
    ref: inputRef,
    onDismiss,
    onSubmit,
  }
}
