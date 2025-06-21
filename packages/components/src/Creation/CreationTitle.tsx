'use client'

import TextareaAutosize, {
  TextareaAutosizeProps,
} from 'react-textarea-autosize'
import { appEmitter } from '@penx/emitter'

interface Props extends TextareaAutosizeProps {}

export function CreationTitle({ className, ...rest }: Props) {
  return (
    <TextareaAutosize
      className="dark:placeholder-text-600 text-foreground placeholder:text-foreground/40 min-h-[32px] w-full resize-none border-none bg-transparent px-0 text-2xl font-bold placeholder:text-2xl focus:outline-none focus:ring-0 md:text-4xl"
      placeholder="Title"
      minRows={1}
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          appEmitter.emit('FOCUS_EDITOR')
          e.preventDefault()
        }
      }}
      {...rest}
    />
  )
}
