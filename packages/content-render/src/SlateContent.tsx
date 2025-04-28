import { Checkbox } from '@penx/uikit/checkbox'
import {
  ELEMENT_A,
  ELEMENT_CODE_BLOCK,
  ELEMENT_CODE_LINE,
  ELEMENT_FILE_CAPTION,
  ELEMENT_H1,
  ELEMENT_H2,
  ELEMENT_H3,
  ELEMENT_H4,
  ELEMENT_H5,
  ELEMENT_H6,
  ELEMENT_HR,
  ELEMENT_IMG,
  ELEMENT_LI,
  ELEMENT_LIC,
  ELEMENT_OL,
  ELEMENT_P,
  ELEMENT_TODO,
  ELEMENT_UL,
} from '@penx/constants'
import { cn, getUrl } from '@penx/utils'
import { slug } from 'github-slugger'
import { Node } from 'slate'
import { Editable } from 'slate-react'
import { Leaf } from './Leaf'

export function SlateContent() {
  return (
    <Editable
      className="mt-4"
      renderLeaf={(props) => <Leaf {...props} />}
      renderElement={({ attributes, children, element }) => {
        // console.log('=======element.type:', element.type)
        const text = Node.string(element)
        const id = slug(text)

        switch (element.type) {
          case ELEMENT_P:
            if (element.listStyleType == 'disc') {
              // console.log('=====element:', element)
              const { indent = 1 } = element
              return (
                <ul
                  className="my-[1px]"
                  style={{
                    marginLeft: indent === 1 ? 0 : `${indent}em`,
                  }}
                  {...attributes}
                >
                  <li className="[&>*]:inline">{children}</li>
                </ul>
              )
            }
            return (
              <div className="mb-4" {...attributes}>
                {children}
              </div>
            )
          case ELEMENT_H1:
            return (
              <h1 id={id} {...attributes}>
                {children}
              </h1>
            )
          case ELEMENT_H2:
            return (
              <h2 id={id} {...attributes}>
                {children}
              </h2>
            )
          case ELEMENT_H3:
            return (
              <h3 id={id} {...attributes}>
                {children}
              </h3>
            )
          case ELEMENT_H4:
            return (
              <h4 id={id} {...attributes}>
                {children}
              </h4>
            )
          case ELEMENT_H5:
            return (
              <h5 id={id} {...attributes}>
                {children}
              </h5>
            )
          case ELEMENT_H6:
            return (
              <h6 id={id} {...attributes}>
                {children}
              </h6>
            )
          case ELEMENT_HR:
            return <hr {...attributes}></hr>
          case ELEMENT_UL:
            return (
              <ul className="bg-red-300" {...attributes}>
                {children}
              </ul>
            )
          case ELEMENT_OL:
            return <ol {...attributes}>{children}</ol>
          case 'numbered-list':
            return <ol {...attributes}>{children}</ol>
          case ELEMENT_LI:
            return <>{children}</>
          case ELEMENT_LIC:
            return (
              <li className="inline bg-amber-200 [&>*]:inline" {...attributes}>
                {children}
              </li>
            )
          case ELEMENT_TODO:
            const checked = (element as any).checked
            return (
              <div
                className="py1 flex flex-1 items-center gap-1 leading-normal"
                {...attributes}
              >
                <Checkbox contentEditable={false} checked={checked || false} />
                <div
                  className={cn(
                    'relative flex-1',
                    checked && 'line-through opacity-60',
                  )}
                >
                  {children}
                </div>
              </div>
            )
          case ELEMENT_IMG:
            const width = (element as any).width
            return (
              <img
                className="mx-auto"
                style={{ width: width ? width : 'auto' }}
                src={getUrl((element as any).url)}
                alt=""
                {...attributes}
              ></img>
            )
          case ELEMENT_FILE_CAPTION:
            return null as any

          case ELEMENT_A:
            return (
              <a
                href={(element as any).url}
                target="_blank"
                className="text-brand decoration-brand cursor-pointer no-underline underline-offset-4 hover:underline"
                {...attributes}
              >
                {children}
              </a>
            )

          case ELEMENT_CODE_BLOCK:
            return (
              <pre
                className="bg-muted overflow-x-auto rounded-md px-6 py-8 font-mono text-sm leading-[normal] [tab-size:2]"
                {...attributes}
              >
                <code>{children}</code>
              </pre>
            )

          case ELEMENT_CODE_LINE:
            return (
              <div className="text-foreground" {...attributes}>
                {children}
              </div>
            )
          default:
            return <div {...attributes}>{children}</div>
        }
      }}
      readOnly
    />
  )
}
