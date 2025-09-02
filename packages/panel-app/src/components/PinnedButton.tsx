import { useQuery } from '@tanstack/react-query'
import { Conf } from 'electron-conf/renderer'
import { PinIcon } from 'lucide-react'
import { cn } from '@penx/utils'

const conf = new Conf()

interface Props {
  className?: string
}

export const PinnedButton = ({ className }: Props) => {
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

  return (
    <PinIcon
      className={cn(
        'no-drag size-4 cursor-pointer',
        pinned && 'text-brand',
        className,
      )}
      onClick={() => {
        pinWindow()
      }}
    />
  )
}
