import { forwardRef, ReactNode, useMemo } from 'react'
import { Command } from 'cmdk'
import { cn } from '@penx/utils'
import { Accessory } from './Accessory'
import { actionMap, detailMap } from './common/store'
import { Icon } from './Icon'
import { IAccessory, IconifyIconType } from './types'

interface ListItemProps {
  title: string
  subtitle?: ReactNode
  value: string
  titleLayout?: 'horizontal' | 'vertical'
  actions?: ReactNode
  detail?: ReactNode
  icon?: IconifyIconType
  accessories?: IAccessory[]
  className?: string
}

export const ListItem = ({
  title,
  subtitle,
  value,
  actions,
  icon,
  detail,
  accessories = [],
  titleLayout = 'horizontal',
  className,
}: ListItemProps) => {
  useMemo(() => {
    if (actions) actionMap.set(value, actions)
    if (detail) detailMap.set(value, detail)
  }, [value, actions, detail])

  return (
    <Command.Item
      value={value}
      onSelect={(item) => {
        console.log('item========:', item)
      }}
      className={cn(
        "text-foreground data-[selected='true']:bg-foreground/10 flex h-[38px] cursor-pointer items-center justify-between gap-4 rounded-lg px-2",
        className,
      )}
    >
      <div className="flex items-center gap-x-2">
        {icon && <Icon icon={icon} />}
        <div
          className={`flex ${titleLayout === 'vertical' ? 'flex-col justify-center gap-y-0' : 'flex-row items-center gap-x-2'}`}
        >
          <div className="text-sm">{title}</div>
          {!!subtitle && (
            <div className="text-sm text-neutral-500">{subtitle}</div>
          )}
        </div>
      </div>
      <div className="flex items-center gap-x-2">
        {!!accessories.length &&
          accessories.map((accessory, index) => (
            <Accessory key={index} item={accessory} />
          ))}
      </div>
    </Command.Item>
  )
}
