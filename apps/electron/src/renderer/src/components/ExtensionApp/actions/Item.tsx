import { ReactNode } from 'react'
import { BaseActionProps } from '../types'
import { ListActionItem } from './ListActionItem'

interface ItemProps extends BaseActionProps {
  title: ReactNode
  onSelect?: () => void
}

export function Item({
  title,
  shortcut,
  icon = { name: 'lucide--cat' },
  onSelect,
}: ItemProps) {
  return (
    <ListActionItem
      shortcut={shortcut}
      icon={icon}
      onSelect={() => {
        onSelect?.()
      }}
    >
      {title}
    </ListActionItem>
  )
}
