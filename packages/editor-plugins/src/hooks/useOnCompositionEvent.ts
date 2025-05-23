import { CompositionEvent } from 'react'
import { PlateEditor } from '@udecode/plate/react'
import { ELEMENT_TITLE } from '@penx/constants'

export function useOnCompositionEvent(editor: PlateEditor) {
  return (event: CompositionEvent<HTMLDivElement>) => {
    const isUpdate = event.type === 'compositionupdate'
    const isEnd = event.type === 'compositionend'

    if (isUpdate) {
      editor.isOnComposition = true
    }

    if (isEnd) {
      editor.isOnComposition = false
      // editor.tf.insertText(event.data)
    }
  }
}
