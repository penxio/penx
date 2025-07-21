import { PropsWithChildren } from 'react'
import { Command } from 'cmdk'
import { Kbd } from '@penx/components/Kbd'
import { Icon } from '../Icon'
import { BaseActionProps } from '../types'

interface Props extends Omit<BaseActionProps, 'title'> {}

export function ListActionItem({
  shortcut,
  children,
  icon,
  onSelect,
  ...rest
}: PropsWithChildren<Props>) {
  return (
    <Command.Item
      className="text-foreground flex cursor-pointer items-center justify-between rounded-lg px-2 py-2 text-sm data-[selected=true]:bg-neutral-200"
      {...rest}
      onSelect={(item) => {
        onSelect?.(item as any)
        //
      }}
    >
      <div className="flex items-center gap-1 text-sm">
        {icon?.name && <Icon icon={icon} />}
        <div>{children}</div>
      </div>
      {shortcut && (
        <div className="flex items-center justify-between gap-x-1">
          {shortcut.modifiers.map((modifier, i) => (
            <Kbd key={i}>{modifier}</Kbd>
          ))}
          <Kbd>{shortcut.key}</Kbd>
        </div>
      )}
    </Command.Item>
  )
}
