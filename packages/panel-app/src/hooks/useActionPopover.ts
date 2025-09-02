import { atom, useAtom } from 'jotai'

export const actionPopoverAtom = atom(false)

export function useActionPopover() {
  const [open, setState] = useAtom(actionPopoverAtom)

  function setOpen(v: any) {
    setState(v)
  }
  return { open, setOpen }
}
