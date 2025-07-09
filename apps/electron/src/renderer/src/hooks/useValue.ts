import { atom, useAtom } from 'jotai'

const valueAtom = atom('')
export function useValue() {
  const [value, set] = useAtom(valueAtom)

  const setValue = (value: string) => {
    set(value)
  }
  return { value, setValue }
}
