import { ArrowLeft } from 'lucide-react'
import { Button } from '@penx/uikit/ui/button'
import { cn } from '@penx/utils'
import { useCommandPosition } from '~/hooks/useCommandPosition'
import { useSearch } from '~/hooks/useSearch'

interface Props {
  className?: string
}

export const BackRootButton = ({ className }: Props) => {
  const { setSearch } = useSearch()
  const { isCommandAppDetail, backToRoot, backToCommandApp } =
    useCommandPosition()

  return (
    <Button
      size="icon"
      variant="ghost"
      className={cn(
        'text-foreground/90 no-drag hover:bg-foreground/10 flex size-7 items-center justify-center rounded-md',
        className,
      )}
      onClick={() => {
        if (isCommandAppDetail) {
          backToCommandApp()
        } else {
          backToRoot()
          setSearch('')
        }
      }}
    >
      <ArrowLeft size={16}></ArrowLeft>
    </Button>
  )
}
