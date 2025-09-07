import { ArrowLeft } from 'lucide-react'
import { Button } from '@penx/uikit/ui/button'
import { cn } from '@penx/utils'
import { navigation } from '../../../hooks/useNavigation'

interface Props {
  className?: string
}

export const PopButton = ({ className }: Props) => {
  return (
    <Button
      size="icon"
      variant="secondary"
      className={cn(
        'text-foreground/90 no-drag bg-foreground/8 hover:bg-foreground/12 z-30 flex size-7 shrink-0 items-center justify-center rounded-md',
        className,
      )}
      onClick={() => {
        console.log('back........')
        navigation.pop()
      }}
    >
      <ArrowLeft size={16}></ArrowLeft>
    </Button>
  )
}
