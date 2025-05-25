import { useEffect } from 'react'
import { Editor, useCurrentEditor } from '@tiptap/react'
import { appEmitter } from '@penx/emitter'

export function FocusHelper() {
  const { editor } = useCurrentEditor()
  useEffect(() => {
    const handleFocus = () => {
      editor?.chain().focus().run()
    }
    appEmitter.on('FOCUS_EDITOR', handleFocus)
    return () => {
      appEmitter.off('FOCUS_EDITOR', handleFocus)
    }
  }, [])
  return null
}
