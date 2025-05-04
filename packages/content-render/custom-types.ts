import { BaseEditor } from 'slate'
import { HistoryEditor } from 'slate-history'
import { ReactEditor } from 'slate-react'

export type CustomEditor = BaseEditor &
  ReactEditor &
  HistoryEditor & {
    elementMaps: any
    onKeyDownFns: any
  }

declare module 'slate' {
  interface CustomTypes {
    Editor: CustomEditor
    Element: {
      type?: any
      id?: string
      nodeType?: string
      listStyleType?: string
      indent?: number
    }
  }
}
