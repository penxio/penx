import { ArrowLeft } from 'lucide-react'
import { Button } from '@penx/uikit/ui/button'
import { cn } from '@penx/utils'
import { useNavigation } from '~/hooks/useNavigation'

interface Props {
  className?: string
}

export const PopButton = ({ className }: Props) => {
  const { pop } = useNavigation()

  return (
    <Button
      size="icon"
      variant="secondary"
      className={cn(
        'text-foreground/90 no-drag bg-foreground/8 hover:bg-foreground/12 flex size-7 items-center justify-center rounded-md',
        className,
      )}
      onClick={() => {
        console.log('back........')

        pop()
      }}
    >
      <ArrowLeft size={16}></ArrowLeft>
    </Button>
  )
}
