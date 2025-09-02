import { ArrowLeft } from 'lucide-react'
import { Button } from '@penx/uikit/ui/button'
import { cn } from '@penx/utils'
import { navigation } from '../../../hooks/useNavigation'
import { useSearch } from '../../../hooks/useSearch'

interface Props {
  className?: string
}

export const BackRootButton = ({ className }: Props) => {
  return (
    <Button
      size="icon"
      variant="ghost"
      className={cn(
        'text-foreground/90 no-drag hover:bg-foreground/10 flex size-7 items-center justify-center rounded-md',
        className,
      )}
      onClick={() => {
        navigation.pop()
      }}
    >
      <ArrowLeft size={16}></ArrowLeft>
    </Button>
  )
}
