import { atom, useAtom } from 'jotai'
import { workerStore } from '~/lib/workerStore'
import { useCommandAppUI } from './useCommandAppUI'
import { useCurrentCommand } from './useCurrentCommand'

type Position = 'ROOT' | 'COMMAND_APP' | 'COMMAND_APP_DETAIL'

export const positionAtom = atom<Position>('ROOT')

export function useCommandPosition() {
  const { setCurrentCommand } = useCurrentCommand()
  const { setUI } = useCommandAppUI()
  const [position, setPosition] = useAtom(positionAtom)
  function backToRoot() {
    setPosition('ROOT')
    setCurrentCommand(null as any)
    setUI({} as any)

    if (workerStore.currentWorker) {
      workerStore.currentWorker.postMessage('BACK_TO_ROOT')
    }
  }

  function backToCommandApp() {
    setPosition('COMMAND_APP')
  }

  return {
    isRoot: position === 'ROOT',
    isCommandApp:
      position === 'COMMAND_APP' || position === 'COMMAND_APP_DETAIL',
    isCommandAppDetail: position === 'COMMAND_APP_DETAIL',
    position,
    backToRoot,
    backToCommandApp,
    setPosition,
  }
}
