'use client'

import { useState } from 'react'
import hljs from 'highlight.js'
import {
  EditorCommand,
  EditorCommandEmpty,
  EditorCommandItem,
  EditorCommandList,
  EditorContent,
  EditorRoot,
  handleCommandNavigation,
  handleImageDrop,
  handleImagePaste,
  ImageResizer,
  useEditor,
  type EditorInstance,
  type JSONContent,
} from 'novel'
import { useDebouncedCallback } from 'use-debounce'
import { defaultEditorContent } from '@penx/constants'
import { Separator } from '@penx/uikit/ui/separator'
import { cn } from '@penx/utils'
import { defaultExtensions } from './extensions'
import { FocusHelper } from './FocusHelper'
import GenerativeMenuSwitch from './generative/generative-menu-switch'
import { uploadFn } from './image-upload'
import { ColorSelector } from './selectors/color-selector'
import { LinkSelector } from './selectors/link-selector'
import { MathSelector } from './selectors/math-selector'
import { NodeSelector } from './selectors/node-selector'
import { TextButtons } from './selectors/text-buttons'
import { slashCommand, suggestionItems } from './slash-command'

const extensions = [...defaultExtensions, slashCommand]

interface Props {
  className?: string
  value?: JSONContent
  onChange?: (value: any) => void
  children?: React.ReactNode
}

export const NovelEditor = ({
  value,
  onChange,
  className,
  children,
}: Props) => {
  const [charsCount, setCharsCount] = useState()

  const [openNode, setOpenNode] = useState(false)
  const [openColor, setOpenColor] = useState(false)
  const [openLink, setOpenLink] = useState(false)
  const [openAI, setOpenAI] = useState(false)

  //Apply Codeblock Highlighting on the HTML from editor.getHTML()
  const highlightCodeblocks = (content: string) => {
    const doc = new DOMParser().parseFromString(content, 'text/html')
    doc.querySelectorAll('pre code').forEach((el) => {
      // @ts-ignore
      // https://highlightjs.readthedocs.io/en/latest/api.html?highlight=highlightElement#highlightelement
      hljs.highlightElement(el)
    })
    return new XMLSerializer().serializeToString(doc)
  }

  const debouncedUpdates = useDebouncedCallback(
    async (editor: EditorInstance) => {
      const json = editor.getJSON()
      console.log('=====json:', json)

      // setCharsCount(editor.storage.characterCount.words())

      // window.localStorage.setItem(
      //   'html-content',
      //   highlightCodeblocks(editor.getHTML()),
      // )

      // window.localStorage.setItem('novel-content', JSON.stringify(json))
      // window.localStorage.setItem(
      //   'markdown',
      //   editor.storage.markdown.getMarkdown(),
      // )
    },
    500,
  )

  return (
    <div className={cn('relative w-full', className)}>
      <EditorRoot>
        <EditorContent
          initialContent={value || defaultEditorContent}
          extensions={extensions}
          className="penx-editor relative"
          editorProps={{
            handleDOMEvents: {
              keydown: (_view, event) => handleCommandNavigation(event),
            },
            handlePaste: (view, event) =>
              handleImagePaste(view, event, uploadFn),
            handleDrop: (view, event, _slice, moved) =>
              handleImageDrop(view, event, moved, uploadFn),
            attributes: {
              class: 'focus:outline-none max-w-full flex flex-col ProseMirror',
            },
          }}
          onUpdate={({ editor }) => {
            console.log('=======editor.getJSON():', editor.getJSON())

            // debouncedUpdates(editor)
            onChange?.(editor.getJSON())
          }}
          slotAfter={<ImageResizer />}
        >
          <EditorCommand className="border-muted bg-background z-50 h-auto max-h-[330px] overflow-y-auto rounded-md border px-1 py-2 shadow-md transition-all">
            <EditorCommandEmpty className="text-muted-foreground px-2">
              No results
            </EditorCommandEmpty>
            <EditorCommandList>
              {suggestionItems.map((item) => (
                <EditorCommandItem
                  value={item.title}
                  onCommand={(val) => item.command?.(val)}
                  className="hover:bg-accent aria-selected:bg-accent flex w-full items-center space-x-2 rounded-md px-2 py-1 text-left text-sm"
                  key={item.title}
                >
                  <div className="border-muted bg-background flex h-10 w-10 items-center justify-center rounded-md border">
                    {item.icon}
                  </div>
                  <div>
                    <p className="font-medium">{item.title}</p>
                    <p className="text-muted-foreground text-xs">
                      {item.description}
                    </p>
                  </div>
                </EditorCommandItem>
              ))}
            </EditorCommandList>
          </EditorCommand>

          <GenerativeMenuSwitch open={openAI} onOpenChange={setOpenAI}>
            <Separator orientation="vertical" />
            <NodeSelector open={openNode} onOpenChange={setOpenNode} />
            <Separator orientation="vertical" />

            <LinkSelector open={openLink} onOpenChange={setOpenLink} />
            <Separator orientation="vertical" />
            <MathSelector />
            <Separator orientation="vertical" />
            <TextButtons />
            <Separator orientation="vertical" />
            <ColorSelector open={openColor} onOpenChange={setOpenColor} />
          </GenerativeMenuSwitch>
          <FocusHelper />
          {children}
        </EditorContent>
      </EditorRoot>
    </div>
  )
}
