import { Button } from '@penx/uikit/ui/button'
import { StopIcon } from './icons'

export function StopButton() {
  return (
    <Button
      className="h-fit cursor-pointer rounded-full border p-1.5"
      onClick={(event) => {
        event.preventDefault()
        stop()
      }}
    >
      <StopIcon size={14} />
    </Button>
  )
}
