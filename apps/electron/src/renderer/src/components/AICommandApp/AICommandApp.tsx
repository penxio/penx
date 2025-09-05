import { useEffect } from 'react'
import { Trans } from '@lingui/react/macro'
import { useQuery } from '@tanstack/react-query'
import { Conf } from 'electron-conf/renderer'
import { PinIcon, XIcon } from 'lucide-react'
import { motion } from 'motion/react'
import { toast } from 'sonner'
import { tinykeys } from 'tinykeys'
import { JournalQuickInput } from '@penx/components/JournalQuickInput'
import { Kbd } from '@penx/components/Kbd'
import { Creation } from '@penx/domain'
import { useCreations } from '@penx/hooks/useCreations'
import { useStructs } from '@penx/hooks/useStructs'
import { cn } from '@penx/utils'
import { getSelection, useSelection } from '~/hooks/useSelection'

const conf = new Conf()
export function AICommandApp() {
  const { data: pinned, refetch } = useQuery({
    queryKey: ['input-window-pinned'],
    queryFn: async () => {
      const pinned = await conf.get('pinned')
      return !!pinned
    },
  })

  async function pinWindow() {
    await conf.set('pinned', !pinned)
    window.electron.ipcRenderer.send('pinned', !pinned)
    refetch()
  }

  const { structs } = useStructs()
  const { creations } = useCreations()
  const aiCommandStruct = structs.find((s) => s.isAICommand)!
  const commands = creations.filter((c) => c.structId === aiCommandStruct.id)

  useEffect(() => {
    const bindings: Record<string, any> = commands.reduce(
      (acc, cur, index) => {
        return {
          ...acc,
          [`Alt+Digit${index + 1}`]: () => {
            const selection = getSelection()
            window.electron.ipcRenderer.send('open-ai-command', {
              creationId: cur.id,
              selection,
            })
          },
        }
      },
      {} as Record<string, any>,
    )

    let unsubscribe = tinykeys(window, bindings)
    return () => {
      unsubscribe()
    }
  }, [commands])

  return (
    <div
      className={cn(
        'drag fixed bottom-0 left-0 right-0 top-0 flex flex-col justify-center bg-transparent',
      )}
    >
      <div className="text-foreground/60 mb-2 flex items-center justify-end gap-1 px-4">
        <PinIcon
          className={cn(
            'no-drag size-4 cursor-pointer',
            pinned && 'text-brand',
          )}
          onClick={() => {
            pinWindow()
          }}
        />
        <XIcon
          className="no-drag size-4 cursor-pointer"
          onClick={() => {
            window.electron.ipcRenderer.send('hide-ai-command-window')
          }}
        />
      </div>

      <div className="no-drag flex flex-col gap-2 px-4">
        {/* <div>{JSON.stringify(selection, null, 2)}</div> */}
        {commands.map((c, index) => (
          <CommandItem key={c.id} creation={c} index={index} />
        ))}
      </div>
    </div>
  )
}

function CommandItem({
  creation,
  index,
}: {
  creation: Creation
  index: number
}) {
  function handleOpen() {
    const selection = getSelection()
    console.log('ai=======selection:', selection)
    window.electron.ipcRenderer.send('open-ai-command', {
      creationId: creation.id,
      selection,
    })
  }

  return (
    <motion.div
      whileHover={
        {
          // scale: 1.05,
        }
      }
      className="bg-background hover:shadow-brand flex h-10 cursor-pointer items-center justify-between rounded-xl p-2 text-sm shadow-sm outline-none transition-all hover:text-sm hover:shadow-lg dark:bg-neutral-800"
      onClick={handleOpen}
    >
      <div>{creation.title}</div>
      <div className="flex items-center gap-1">
        <Kbd>⌥</Kbd>
        <Kbd>{index + 1}</Kbd>
      </div>
    </motion.div>
  )
}
