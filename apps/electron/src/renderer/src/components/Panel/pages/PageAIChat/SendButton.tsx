import { appEmitter } from '@penx/emitter'
import { Button } from '@penx/uikit/ui/button'
import { useInput } from './hooks/useInput'
import { ArrowUpIcon } from './icons'

export function SendButton() {
  const { input } = useInput()
  return (
    <Button
      className="disabled:bg-primary/30 h-fit rounded-full p-1.5"
      onClick={(event) => {
        event.preventDefault()
        console.log('input............>:', input)
        appEmitter.emit('SUBMIT_AI_CHAT', input)
      }}
      // disabled={input.length === 0 || uploadQueue.length > 0}
    >
      <ArrowUpIcon size={14} />
    </Button>
  )
}
