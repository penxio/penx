import { useMemo } from 'react'
import { atom, useAtom } from 'jotai'

const sidebarAtom = atom<boolean>(false)

export function useSidebar() {
  const [isOpen, setIsOpen] = useAtom(sidebarAtom)
  const status = useMemo(() => {
    if (isOpen) return true
    return false
  }, [isOpen])
  console.log('=====status:', status)

  return {
    status,
    isOpen,
    setIsOpen,
  }
}
