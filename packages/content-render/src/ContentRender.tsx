'use client'

import {
  BaseParagraphPlugin,
  createSlateEditor,
  PlateStatic,
} from '@udecode/plate'
import Image from 'next/image'
import { BaseBidirectionalLinkPlugin } from '@penx/editor-custom-plugins/bidirectional-link/lib/BaseBidirectionalLinkPlugin'
import { BaseProductPlugin } from '@penx/editor-custom-plugins/product/lib/BaseProductPlugin'
import { getUrl } from '@penx/utils'
import { BidirectionalLinkElementStatic } from './bidirectional-link/bidirectional-link-static'
import { components } from './components'
import { serverSideComponents, serverSideEditor } from './server-side-editor'
import { SlateContent } from './SlateContent'

interface Element {
  type: string
  id: string
  [key: string]: any
}

interface Props {
  content: any
}

export function ContentRender({ content }: Props) {
  if (typeof content === 'string' && content.startsWith('/')) {
    return (
      <div>
        <Image
          src={getUrl(content)}
          alt=""
          width={1000}
          height={1000}
          className="h-auto w-full rounded-lg"
        />
      </div>
    )
  }

  // console.log('========:>>content:', content)

  const value: Element[] = Array.isArray(content)
    ? content
    : JSON.parse(content)

  return (
    <PlateStatic
      editor={serverSideEditor}
      components={{
        ...serverSideComponents,
        [BaseBidirectionalLinkPlugin.key]: BidirectionalLinkElementStatic,
      }}
      // editor={editor}
      // components={components}
      value={value.map(({ id, ...rest }) => rest) as any}
      className="text-base"
    />
  )
}
