import { ReactNode, useMemo } from 'react'
import { Icon } from './Icon'
import { IAccessory, isAccessoryObjectText } from './types'

interface AccessoryProps {
  item: IAccessory
}

export function Accessory({ item }: AccessoryProps) {
  let text: ReactNode = useMemo(() => {
    if (typeof item.text === 'string' || typeof item.text === 'number') {
      return <div className="">{item.text}</div>
    }
    if (isAccessoryObjectText(item.text)) {
      return (
        <div className={item.text.color ? item.text.color : 'text-gray-600'}>
          {item.text?.value || ''}
        </div>
      )
    }
    return null
  }, [item.text])

  let tag: ReactNode = item.tag ? (
    <div className="flex h-6 items-center justify-center rounded bg-amber-500 px-2 text-white">
      {item.tag.value}
    </div>
  ) : null

  return (
    <div className="flex items-center gap-x-1 text-xs text-neutral-500">
      {item.icon && <Icon icon={item.icon} />}
      {text}
      {tag}
    </div>
  )
}
