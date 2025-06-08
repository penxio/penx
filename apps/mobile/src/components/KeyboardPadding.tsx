import { useKeyboard } from '@/hooks/useKeyboard'
import { Editor, useCurrentEditor } from '@tiptap/react'

export function KeyboardPadding() {
  const { editor } = useCurrentEditor()
  const { height, isShow, setState } = useKeyboard()

  if (!editor) return null

  return (
    <div
      className=""
      style={{ height: `${height}px` }}
      onClick={() => {
        editor.chain().focus().run()
      }}
    ></div>
  )
}
