'use client'

import { atom, useAtom } from 'jotai'

const themeNameAtom = atom('')

export function useThemeName() {
  const [themeName, setThemeName] = useAtom(themeNameAtom)
  return {
    themeName,
    setThemeName,
  }
}
