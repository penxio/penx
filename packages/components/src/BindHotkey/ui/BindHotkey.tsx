import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { Box } from '@fower/react'
import { Trans } from '@lingui/react/macro'
import { useAppShortcuts } from '@penx/hooks/useAppShortcuts'
import { store } from '@penx/store'
import { Shortcut, ShortcutType } from '@penx/types'
import { Popover, PopoverContent, PopoverTrigger } from '@penx/uikit/popover'
import { cn } from '@penx/utils'
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

interface Props {
  type: ShortcutType
  commandId?: string
}
export const BindHotkey = ({ type, commandId }: Props) => {
  const [open, setOpen] = useState(false)
  const { data = [], isLoading } = useShortcuts()
  const { shortcuts } = useAppShortcuts()
  let keys: string[] = []

  if (isLoading) return null

  const commandShortcut = shortcuts.find((s) => s.commandId === commandId)

  console.log(
    '==========commandShortcut:',
    commandShortcut,
    'shortcuts;',
    shortcuts,
    'commandId:',
    commandId,
  )

  if (commandShortcut) {
    keys = commandShortcut.keys
  }

  const shortcut = data.find((i) => i.type === type)
  console.log('======shortcut:', shortcut)

  if (shortcut) {
    keys = shortcut.keys
  }

  // if (!shortcut) return null

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Box className="bg-foreground/10 flex h-10 w-[160px] cursor-pointer items-center justify-center rounded-full">
          <Box toCenterY gap1>
            {keys.length > 0 &&
              keys.map((item) => <Kbd key={item}>{item}</Kbd>)}
            {keys.length === 0 && (
              <div className="text-foreground/60 text-sm">
                <Trans>Record shortcut</Trans>
              </div>
            )}
          </Box>
        </Box>
      </PopoverTrigger>
      <PopoverContent className="flex h-[100px] w-[200px] flex-col justify-center p-4">
        <Content setOpen={setOpen} shortcut={undefined} commandId={commandId} />
      </PopoverContent>
    </Popover>
  )
}

function Content({
  setOpen,
  shortcut,
  commandId,
}: {
  setOpen: Dispatch<SetStateAction<boolean>>
  shortcut?: Shortcut
  commandId?: string
}) {
  const { refetch } = useShortcuts()
  const [keys, setKeys] = useState<string[]>([])
  const [ok, setOk] = useState(false)

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
        // const key = event.code.startsWith('Key')
        //   ? event.code.slice(-1)
        //   : event.key.toUpperCase()
        // keys.push(key)

        if (event.code.startsWith('Key')) {
          keys.push(event.code.slice(-1))
        }
      }

      console.log('key=====ss:', keys)

      const lastKey = keys[keys.length - 1]

      const isModifierKey =
        modifierKeys.includes(lastKey) || modifierCodes.includes(lastKey)

      keys = keys.filter((key) => !modifierCodes.includes(key))

      if (!isModifierKey) {
        shortcut && (await unregisterHotkey(shortcut))

        const newShortcut = {
          ...shortcut,
          key: keys,
        }

        console.log(
          '========newShortcut:',
          newShortcut,
          'commandId:',
          commandId,
        )

        // await unregisterHotkey(newShortcut)
        // await registerHotkey(newShortcut)
        // await upsertShortcut(newShortcut)
        // await refetch()

        setKeys(keys)
        setOk(true)

        if (commandId) {
          store.app.upsertShortcut({
            commandId,
            keys,
          })
        }

        setTimeout(() => {
          setOpen(false)
          setTimeout(() => {
            setOk(false)
          }, 500)
        }, 1000)
      } else {
        setKeys(keys)
      }
    }

    function handleKeyUp() {
      //
    }

    document.addEventListener('keydown', handler)

    document.addEventListener('keyup', handleKeyUp)

    return () => {
      document.removeEventListener('keydown', handler)
      document.removeEventListener('keyup', handleKeyUp)
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
            <Kbd className={cn(ok && 'bg-green-100 text-green-700')} key={key}>
              {key}
            </Kbd>
          ))}
        </Box>
      )}
      <Box neutral500 textXS>
        <Trans>Recording...</Trans>
      </Box>
    </Box>
  )
}
