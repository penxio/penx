import { BrushCleaning } from 'lucide-react'
import { Button } from '@penx/uikit/ui/button'
import { cn } from '@penx/utils'

interface Props {
  className?: string
}

export function RefreshChatButton({ className }: Props) {
  return (
    <Button
      variant="outline"
      className={cn(
        'text-foreground/90 no-drag bg-foreground/8 hover:bg-foreground/12 flex h-7 items-center justify-center gap-1 rounded-md',
        className,
      )}
      onClick={() => {}}
    >
      <BrushCleaning size={16} />
      Clean History
    </Button>
  )
}
