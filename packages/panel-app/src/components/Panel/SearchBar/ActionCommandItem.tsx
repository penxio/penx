import { Box, FowerHTMLProps } from '@fower/react'
import { Kbd } from '@penx/components/Kbd'
import { appEmitter } from '@penx/emitter'
import { cn } from '@penx/utils'
import { CommandItem } from '../CommandComponents'

interface ActionCommandItemProps
  extends Omit<FowerHTMLProps<'div'>, 'onSelect'> {
  shortcut: string
  onSelect?: () => void
}
export function ActionCommandItem({
  children,
  shortcut,
  onSelect,
  className,
  ...rest
}: ActionCommandItemProps) {
  return (
    <CommandItem
      className={cn(
        "transition-normal data-[selected='true']:bg-foreground/10 text-foreground/80 flex h-10 cursor-pointer items-center gap-2 rounded-md px-2 text-sm",
        className,
      )}
      onSelect={() => {
        onSelect?.()
        appEmitter.emit('FOCUS_SEARCH_BAR_INPUT')
      }}
      onClick={() => {
        onSelect?.()
        appEmitter.emit('FOCUS_SEARCH_BAR_INPUT')
      }}
      {...rest}
    >
      {children}
      <div className="ml-auto flex items-center justify-between gap-1">
        {shortcut &&
          shortcut.split(' ').map((key) => {
            return <Kbd key={key}>{key}</Kbd>
          })}
      </div>
    </CommandItem>
  )
}
