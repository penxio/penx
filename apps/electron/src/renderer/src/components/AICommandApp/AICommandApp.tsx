import { Trans } from '@lingui/react/macro'
import { useQuery } from '@tanstack/react-query'
import { Conf } from 'electron-conf/renderer'
import { PinIcon, XIcon } from 'lucide-react'
import { toast } from 'sonner'
import { JournalQuickInput } from '@penx/components/JournalQuickInput'
import { Creation } from '@penx/domain'
import { useCreations } from '@penx/hooks/useCreations'
import { useStructs } from '@penx/hooks/useStructs'
import { cn } from '@penx/utils'
import { navigation } from '~/hooks/useNavigation'
import { getSelection, useSelection } from '~/hooks/useSelection'
import { openCommand } from '~/lib/openCommand'

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

  const { selection } = useSelection()
  return (
    <div
      className={cn(
        'drag fixed bottom-0 left-0 right-0 top-0 flex flex-col bg-transparent bg-green-200',
      )}
    >
      <div className="flex items-center justify-between pl-1.5 pr-3 pt-2">
        <div className="text-foreground/60 flex items-center gap-1">
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
        <div className="no-drag">AI command</div>
      </div>
      <div className="no-drag">
        <div>{JSON.stringify(selection, null, 2)}</div>
        {commands.map((c) => (
          <CommandItem key={c.id} creation={c} />
        ))}
      </div>
    </div>
  )
}

function CommandItem({ creation }: { creation: Creation }) {
  function handleOpen() {
    const selection = getSelection()
    console.log('ai=======selection:', selection)

    window.electron.ipcRenderer.send('open-ai-command', {
      creationId: creation.id,
      selection,
    })
  }

  return (
    <div className="cursor-pointer" onClick={handleOpen}>
      <div>{creation.title}</div>
    </div>
  )
}
