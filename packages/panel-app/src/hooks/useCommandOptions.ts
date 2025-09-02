import { atom, useAtom } from 'jotai'

export type CommandOptions = {
  input?: string
  isEditStructProp?: boolean
}

export const commandOptionsAtom = atom<CommandOptions>({} as CommandOptions)

export function useCommandOptions() {
  const [options, setOptions] = useAtom(commandOptionsAtom)

  return {
    options,
    setOptions,
  }
}
