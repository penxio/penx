import { useEffect, useMemo, useRef } from 'react'
import { Box } from '@fower/react'
import {
  isCopyToClipboard,
  isCustomAction,
  isFormApp,
  isListApp,
  isOpenInBrowser,
  isSubmitForm,
} from '@penxio/preset-ui'
import { open } from '@tauri-apps/plugin-shell'
import { DoorOpenIcon } from 'lucide-react'
import { writeText } from 'tauri-plugin-clipboard-api'
import { appEmitter } from '@penx/event'
import { workerStore } from '~/common/workerStore'
import { useCommandAppUI } from '~/hooks/useCommandAppUI'
import { useValue } from '~/hooks/useValue'
import { MenuItem } from './MenuItem'

interface Props {
  onSelect?: () => void
}

export const CommandAppActions = ({ onSelect }: Props) => {
  const itemIndexRef = useRef(0)
  const { value } = useValue()
  const { ui } = useCommandAppUI()

  const actions = useMemo(() => {
    if (ui.type !== 'render') return []

    if (isListApp(ui.component)) {
      const { items = [] } = ui.component
      const index = items.findIndex((_, index) => String(index) === value)
      itemIndexRef.current = index
      const item = items[index]
      if (!item?.actions?.length) return []
      return item.actions
    }

    if (isFormApp(ui.component)) {
      return ui.component.actions || []
    }

    return []
  }, [ui, value])

  return (
    <>
      {actions.map((item, index) => (
        <MenuItem
          key={index}
          shortcut="↵"
          onSelect={async () => {
            if (isOpenInBrowser(item)) {
              await open(item.url)
            }

            if (isCopyToClipboard(item)) {
              await writeText(item.content)
            }

            if (isSubmitForm(item)) {
              appEmitter.emit('SUBMIT_FORM_APP', index)
            }

            if (isCustomAction(item)) {
              workerStore.currentWorker!.postMessage({
                type: 'action--custom-action',
                itemIndex: itemIndexRef.current,
                actionIndex: index,
              })
            }

            onSelect?.()
          }}
        >
          <Box toCenterY gap2 inlineFlex>
            <Box gray800>
              <DoorOpenIcon size={16} />
            </Box>
            <Box>{item.title || getDefaultTitle(item)}</Box>
          </Box>
        </MenuItem>
      ))}
    </>
  )
}

function getDefaultTitle(item: any) {
  if (isOpenInBrowser(item)) {
    return 'Open in browser'
  }

  if (isCopyToClipboard(item)) {
    return 'Copy to clipboard'
  }

  if (isSubmitForm(item)) {
    return 'Submit form'
  }
  return 'TODO:'
}
