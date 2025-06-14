import { XIcon } from 'lucide-react'
import { Button } from '@penx/uikit/ui/button'
import { cn } from '@penx/utils'
import { useDrawerContext } from './DrawerContext'

interface Props {
  className?: string
}

export function DrawerClose({ className }: Props) {
  const { setOpen } = useDrawerContext()
  return (
    <Button
      variant="secondary"
      size="icon"
      className="size-7 rounded-full"
      onClick={() => setOpen(false)}
    >
      <XIcon size={18} className="text-foreground/60" />
    </Button>
  )
}
