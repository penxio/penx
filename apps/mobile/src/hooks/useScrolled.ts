import { atom, useAtom } from 'jotai'

const scrolledAtom = atom(false)

export function useScrolled() {
  const [scrolled, setScrolled] = useAtom(scrolledAtom)

  return {
    scrolled,
    setScrolled,
  }
}
