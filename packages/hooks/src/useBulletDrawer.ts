import { INode } from '@penx/model-type'
import { atom, useAtom } from 'jotai'

interface BulletDrawerState {
  isOpen: boolean
  node: INode
  element: any
}

export const bulletDrawerAtom = atom<BulletDrawerState>({
  isOpen: false,
  node: {} as INode,
  element: {} as any,
})

export function useBulletDrawer() {
  const [value, setValue] = useAtom(bulletDrawerAtom)
  return {
    isOpen: value.isOpen,
    node: value.node,
    element: value.element,
    open: (data?: Partial<BulletDrawerState>) =>
      setValue({
        ...value,
        isOpen: true,
        ...data,
      }),
    close: () =>
      setValue({
        ...value,
        isOpen: false,
      }),
  }
}
