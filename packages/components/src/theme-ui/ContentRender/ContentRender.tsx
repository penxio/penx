'use client'

// import { BaseProductPlugin } from '@penx/uikit/editor/custom-plate-plugins/product'
// import {
//   serverSideComponents,
//   serverSideEditor,
// } from '@penx/uikit/editor/server-side-editor'
import {
  BaseParagraphPlugin,
  createSlateEditor,
  PlateStatic,
} from '@udecode/plate'
import Image from 'next/image'
import { getUrl } from '@penx/utils'
import { components } from './components'
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

  return null

  // return (
  //   <PlateStatic
  //     editor={serverSideEditor}
  //     components={serverSideComponents}
  //     // editor={editor}
  //     // components={components}
  //     value={value.map(({ id, ...rest }) => rest) as any}
  //     className="text-base"
  //   />
  // )
}
