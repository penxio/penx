import { useMemo } from 'react'
import { atom, useAtom } from 'jotai'

const homeTabAtom = atom<'HOME' | 'TASK' | 'NOTE' | 'PROFILE'>('HOME')

export function useHomeTab() {
  const [type, setType] = useAtom(homeTabAtom)

  return {
    isHome: type === 'HOME',
    isTask: type === 'TASK',
    type,
    setType,
  }
}
