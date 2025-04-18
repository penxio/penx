import { memo, useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { atom, useAtom } from 'jotai'
import { Path, Transforms } from 'slate'
import { useSlate, useSlateStatic } from 'slate-react'
import { Textarea } from '../ui/textarea'

type State = {
  isOpen: boolean
  node: any
  path: Path
}

const blockStyleDialogAtom = atom<State>({ isOpen: false, node: {}, path: [] })

export function useBlockStyleDialog() {
  const [state, setState] = useAtom(blockStyleDialogAtom)
  return {
    ...state,
    setIsOpen: (isOpen: boolean) => setState({ ...state, isOpen }),
    setState,
  }
}

const Content = memo(() => {
  const { path, node } = useBlockStyleDialog()
  const editor = useSlateStatic()
  return (
    <Textarea
      placeholder="rounded-full px-4 mt-3..."
      defaultValue={node.style || ''}
      onChange={(e) => {
        Transforms.setNodes(
          editor,
          {
            style: e.target.value,
          } as any,
          { at: path },
        )
      }}
    />
  )
})

export function BlockStyleDialog() {
  const { isOpen, setIsOpen, path, node } = useBlockStyleDialog()

  return (
    <Dialog open={isOpen} onOpenChange={(v) => setIsOpen(v)}>
      <DialogContent className="sm:max-w-[420px]">
        <DialogHeader>
          <DialogTitle>Block style</DialogTitle>
          <DialogDescription>support basic tailwindcss</DialogDescription>
        </DialogHeader>
        <Content />
      </DialogContent>
    </Dialog>
  )
}
