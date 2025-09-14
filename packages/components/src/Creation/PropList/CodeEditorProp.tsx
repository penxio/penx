import { useEffect, useRef, useState } from 'react'
import { t } from '@lingui/core/macro'
import Editor, { loader } from '@monaco-editor/react'
import { ArrowLeft, Maximize2Icon } from 'lucide-react'
import * as monaco from 'monaco-editor'
// @ts-ignore
import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker'
// @ts-ignore
import tsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker'
import { Button } from '@penx/uikit/ui/button'
import { Textarea, TextareaProps } from '@penx/uikit/ui/textarea'
import { cn } from '@penx/utils'

// @ts-ignore
self.MonacoEnvironment = {
  getWorker(_: any, label: any) {
    if (label === 'typescript' || label === 'javascript') {
      return new tsWorker()
    }
    return new editorWorker()
  },
}
loader.config({ monaco })

interface Props extends Omit<TextareaProps, 'onChange'> {
  value: string
  onChange: (v: string) => void
}
export const CodeEditorProp = ({ value = '', onChange, ...rest }: Props) => {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLTextAreaElement>(null)
  useEffect(() => {
    if (!ref.current) return
    if (value !== ref.current?.value) {
      ref.current!.value = value
    }
  }, [value])

  return (
    <div className="bg-background relative w-full">
      {open && (
        <div className="bg-background fixed inset-0 z-50 flex flex-col">
          <div className="flex h-10 items-center px-2">
            <Button
              size="icon"
              variant="secondary"
              className={cn(
                'text-foreground/90 no-drag bg-foreground/8 hover:bg-foreground/12 flex size-7 shrink-0 items-center justify-center rounded-md',
              )}
              onClick={() => {
                setOpen(false)
              }}
            >
              <ArrowLeft size={16}></ArrowLeft>
            </Button>
          </div>
          <div className="flex-1">
            <Editor
              className="flex-1 pt-2"
              // height=""
              defaultLanguage="javascript"
              value={value ?? '// start your code'}
              onChange={(newValue) => onChange(newValue ?? '')}
              options={{
                minimap: {
                  enabled: false,
                },
              }}
            />
          </div>
        </div>
      )}
      <Maximize2Icon
        className="absolute right-2 top-2 size-4 cursor-pointer"
        onClick={() => setOpen(true)}
      />
      {/* <Textarea
        ref={ref}
        placeholder={t`Empty`}
        className="bg-transparent"
        rows={8}
        defaultValue={value ?? ''}
        onChange={(e) => onChange(e.target.value)}
        {...rest}
      /> */}

      <div className="border-foreground/10 h-40 rounded-lg border">
        <Editor
          className="h-full flex-1 pt-2"
          // height=""
          defaultLanguage="javascript"
          value={value ?? '// start your code'}
          onChange={(newValue) => onChange(newValue ?? '')}
          options={{
            minimap: {
              enabled: false,
            },
          }}
        />
      </div>
    </div>
  )
}
