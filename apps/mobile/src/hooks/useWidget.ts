import { atom, useAtom } from 'jotai'
import { Widget } from '@penx/types'

const widgetAtom = atom<Widget>(null as any as Widget)

export function useWidget() {
  const [widget, setWidget] = useAtom(widgetAtom)

  return {
    widget,
    setWidget,
  }
}
