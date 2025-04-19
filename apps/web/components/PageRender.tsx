'use client'

import { getUrl } from '@penx/utils'
import Image from 'next/image'
import { createEditor } from 'slate'
import { Slate, withReact } from 'slate-react'
import { SlateContent } from './theme-ui/ContentRender/SlateContent'

interface Props {
  content: any
}

export function PageRender({ content }: Props) {
  const editor = withReact(createEditor())

  return (
    <Slate
      editor={editor}
      initialValue={Array.isArray(content) ? content : JSON.parse(content)}
    >
      <SlateContent />
    </Slate>
  )
}
