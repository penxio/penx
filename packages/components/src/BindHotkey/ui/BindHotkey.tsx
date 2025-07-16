import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { Box } from '@fower/react'
import { Trans } from '@lingui/react/macro'
import { Shortcut, ShortcutType } from '@penx/types'
import { Popover, PopoverContent, PopoverTrigger } from '@penx/uikit/popover'
import { Kbd } from '../../Kbd'
import { useShortcuts } from '../hooks/useShortcuts'
import {
  convertKeysToHotkey,
  registerHotkey,
  unregisterHotkey,
  upsertShortcut,
} from '../utils'

const modifierKeys = ['Control', 'Meta', 'Shift', 'Alt']
const modifierCodes = [
  'ControlLeft',
  'MetaLeft',
  'ShiftLeft',
  'AltLeft',
  'ControlRight',
  'MetaRight',
  'ShiftRight',
  'AltRight',
]

function Content({
  setOpen,
  shortcut,
}: {
  setOpen: Dispatch<SetStateAction<boolean>>
  shortcut: Shortcut
}) {
  const { refetch } = useShortcuts()
  const [keys, setKeys] = useState<string[]>([])

  useEffect(() => {
    // let unlisten: UnlistenFn

    // async function listenBlur() {
    //   unlisten = await listen('tauri://blur', () => {
    //     // close()
    //   })
    // }

    // listenBlur()

    async function handler(event: KeyboardEvent) {
      let keys: string[] = []
      console.log('event========:', event)
      if (event.ctrlKey) keys.push('Control')
      if (event.metaKey) keys.push('Meta')
      if (event.shiftKey) keys.push('Shift')
      if (event.altKey) keys.push('Alt')

      if (event.code === 'Space') {
        keys.push('Space')
      } else {
        console.log('=========event.key:', event.key, event)

        const key = event.code.startsWith('Key')
          ? event.code.slice(-1)
          : event.key.toUpperCase()
        keys.push(key)
      }

      console.log('key=====ss:', keys)

      const lastKey = keys[keys.length - 1]

      const isModifierKey =
        modifierKeys.includes(lastKey) || modifierCodes.includes(lastKey)

      keys = keys.filter((key) => !modifierCodes.includes(key))

      if (!isModifierKey) {
        await unregisterHotkey(shortcut)

        const newShortcut = {
          ...shortcut,
          key: keys,
        }
        await unregisterHotkey(newShortcut)
        await registerHotkey(newShortcut)
        await upsertShortcut(newShortcut)
        await refetch()
        setOpen(false)
      } else {
        setKeys(keys)
      }
    }

    document.addEventListener('keydown', handler)

    return () => {
      document.removeEventListener('keydown', handler)
      // unlisten?.()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return (
    <Box column toBetween h-100p toCenterX>
      {!keys.length && (
        <Box toCenterY leadingNone gap2>
          <Box textSM neutral500>
            e.g.
          </Box>

          <Box toCenterY gap1>
            <Kbd>⌘</Kbd>
            <Kbd>⇧</Kbd>
            <Kbd>Space</Kbd>
          </Box>
        </Box>
      )}
      {keys.length > 0 && (
        <Box toCenterY gap1>
          {keys.map((key) => (
            <Kbd key={key}>{key}</Kbd>
          ))}
        </Box>
      )}
      <Box neutral500 textXS>
        <Trans>Recording...</Trans>
      </Box>
    </Box>
  )
}

interface Props {
  type: ShortcutType
}
export const BindHotkey = ({ type }: Props) => {
  const [open, setOpen] = useState(false)
  const { data = [], isLoading } = useShortcuts()

  if (isLoading) return null

  const shortcut = data.find((i) => i.type === type)

  if (!shortcut) return null

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Box className="bg-foreground/10 flex h-10 w-[200px] cursor-pointer items-center justify-center rounded-full">
          <Box toCenterY gap1>
            {shortcut.key.map((item) => (
              <Kbd key={item}>{item}</Kbd>
            ))}
          </Box>
        </Box>
      </PopoverTrigger>
      <PopoverContent className="flex h-[100px] w-[200px] flex-col justify-center p-4">
        <Content setOpen={setOpen} shortcut={shortcut} />
      </PopoverContent>
    </Popover>
  )
}
