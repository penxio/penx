// @ts-nocheck
import { Editor, Node, Path, Text, Transforms } from 'slate'
import { ReactEditor } from 'slate-react'

function findFirstEmptyParagraph(editor: Editor): number {
  for (let i = 0; i < editor.children.length; i++) {
    const node = editor.children[i]
    if (
      Editor.isBlock(editor, node) &&
      node.type === 'paragraph' &&
      node.children.length === 1 &&
      Text.isText(node.children[0]) &&
      node.children[0].text === ''
    ) {
      return i
    }
  }
  return -1
}

function focusParagraphAtIndex(editor: Editor, index: number): void {
  if (index < 0 || index >= editor.children.length) return

  const node = editor.children[index]
  if (!Editor.isBlock(editor, node)) return

  if (node.children.length === 0 || !Text.isText(node.children[0])) return

  const path: Path = [index, 0]
  Transforms.select(editor, {
    anchor: { path, offset: 0 },
    focus: { path, offset: 0 },
  })
  ReactEditor.focus(editor)
}

function focusToEnd(editor: Editor): void {
  const lastIndex = editor.children.length - 1
  if (lastIndex < 0) return

  const lastNode = editor.children[lastIndex]
  if (!Editor.isBlock(editor, lastNode)) return

  const lastTextIndex = lastNode.children.length - 1
  if (lastTextIndex < 0) return

  const lastTextNode = lastNode.children[lastTextIndex]
  if (!Text.isText(lastTextNode)) return

  const textLength = lastTextNode.text.length
  const path: Path = [lastIndex, lastTextIndex]

  Transforms.select(editor, {
    anchor: { path, offset: textLength },
    focus: { path, offset: textLength },
  })
  ReactEditor.focus(editor)
}

export function focusFirstEmptyParagraphOrEnd(editor: Editor): void {
  const emptyIndex = findFirstEmptyParagraph(editor)
  if (emptyIndex !== -1) {
    focusParagraphAtIndex(editor, emptyIndex)
  } else {
    focusToEnd(editor)
  }
}
