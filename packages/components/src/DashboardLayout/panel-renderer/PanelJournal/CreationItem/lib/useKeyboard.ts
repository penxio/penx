import { useEffect } from 'react'
import { Keyboard } from '@capacitor/keyboard'
import { atom, useAtom } from 'jotai'

interface State {
  isShow: boolean
  height: number
}

const keyboardAtom = atom<State>({
  isShow: false,
  height: 0,
} as State)

export function useKeyboard() {
  const [state, setState] = useAtom(keyboardAtom)

  return {
    ...state,
    setState,
  }
}

export function useKeyboardChange() {
  const { setState } = useKeyboard()

  useEffect(() => {
    const showHandler = Keyboard.addListener('keyboardWillShow', (info) => {
      setState({ isShow: true, height: info.keyboardHeight })
    })
    const hideHandler = Keyboard.addListener('keyboardWillHide', () => {
      setState({ isShow: false, height: 0 })
    })
    return () => {
      showHandler.then((handle) => handle?.remove())
      hideHandler.then((handle) => handle?.remove())
    }
  }, [])
}
