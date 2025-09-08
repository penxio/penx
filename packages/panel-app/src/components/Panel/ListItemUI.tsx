import { ReactNode, useEffect, useMemo } from 'react'
import { Box, css, FowerHTMLProps } from '@fower/react'
import { Trans } from '@lingui/react/macro'
import { tinykeys } from 'tinykeys'
import { useStructs } from '@penx/hooks/useStructs'
import { cn } from '@penx/utils'
import { useCurrentCommand } from '../../hooks/useCurrentCommand'
import { IAccessory, isAccessoryObjectText } from '../../lib/penx'
import { ICommandItem } from '../../lib/types'
import { CommandItem } from './CommandComponents'
import { ListItemIcon } from './ListItemIcon'

interface ListItemUIProps
  extends Omit<FowerHTMLProps<'div'>, 'onSelect' | 'prefix'> {
  index: number
  prefix?: ReactNode
  value?: any
  item: ICommandItem
  isListApp?: boolean
  isFavorite?: boolean
  titleLayout?: 'column' | 'row'
  icon?: ReactNode
  showIcon?: boolean
  showType?: boolean
  onSelect?: (item: ICommandItem) => void
}

export const ListItemUI = ({
  item,
  prefix,
  onSelect,
  index,
  titleLayout = 'row',
  isListApp = false,
  icon,
  showIcon = true,
  isFavorite = false,
  showType = true,
  value,
  className,
  ...rest
}: ListItemUIProps) => {
  const { currentCommand } = useCurrentCommand()
  const { structs } = useStructs()

  const itemIcon = useMemo(() => {
    const assets = currentCommand?.data?.assets || {}
    return assets[item.icon as string] || item.icon
  }, [item, currentCommand])

  const title = useMemo(() => {
    if (item.title) return item.title
    return item.data?.creation?.previewedContent
  }, [item])

  const subtitle =
    typeof item.subtitle === 'string' ? item.subtitle : item.subtitle?.value

  const keywords = [title, subtitle] as string[]
  if (item?.data?.alias) {
    keywords.push(item.data.alias)
  }

  const type = useMemo(() => {
    if (item.data?.type === 'Creation') {
      const struct = structs.find((s) => s.id === item.data.creation?.structId)
      if (struct) {
        return struct.name
      }
    }
    return item.data?.type
  }, [item])

  // useEffect(() => {
  //   let unsubscribe = tinykeys(window, {
  //     Enter: () => {
  //       onSelect?.(item)
  //     },
  //   })
  //   return () => {
  //     unsubscribe()
  //   }
  // }, [item, onSelect])

  return (
    <CommandItem
      className={cn(
        "text-foreground data-[selected='true']:bg-foreground/10 hover:bg-foreground/5 flex h-[38px] cursor-pointer items-center justify-between gap-4 rounded-lg px-2",
        className,
      )}
      value={value || title}
      keywords={keywords.filter(Boolean)}
      onSelect={() => {
        onSelect?.(item)
      }}
      // onClick={() => {
      //   onSelect?.(item)
      // }}
      onDoubleClick={() => {
        onSelect?.(item)
      }}
      {...rest}
    >
      <div className="flex items-center gap-2">
        {prefix}
        {showIcon &&
          (icon ?? <ListItemIcon icon={itemIcon as string} item={item} />)}
        <div
          className="flex items-center gap-x-2 gap-y-1"
          style={{
            flexDirection: titleLayout,
          }}
        >
          <div
            className={cn(
              'line-clamp-1 text-sm',
              !title && 'text-foreground/50',
            )}
          >
            {title || <Trans>Untitled</Trans>}
          </div>
          {subtitle && (
            <div className="text-foreground/40 text-xs">{subtitle}</div>
          )}

          {isFavorite && (
            <span className="icon-[material-symbols--star-rounded] size-4 text-yellow-500 opacity-80" />
          )}

          {item?.data?.alias && (
            <div className="border-foreground/8 text-foreground/40 flex h-5 items-center rounded border px-[6px] text-xs">
              {item.data.alias}
            </div>
          )}
        </div>
      </div>
      <div className="flex items-center gap-1">
        {showType && !!type && (
          <div className="text-foreground/50 shrink-0 text-xs">{type}</div>
        )}
        {item?.extra && (
          <div className="text-foreground/60 flex items-center gap-2 text-xs">
            {item.extra.map((extra, index) => (
              <Accessory key={index} item={extra} />
            ))}
          </div>
        )}
      </div>
    </CommandItem>
  )
}

interface AccessoryProps {
  item: IAccessory
}
function Accessory({ item }: AccessoryProps) {
  const { currentCommand } = useCurrentCommand()
  const assets = currentCommand?.data?.assets || {}

  let text: ReactNode = useMemo(() => {
    if (typeof item.text === 'string' || typeof item.text === 'number') {
      return <div>{item.text}</div>
    }
    if (isAccessoryObjectText(item.text)) {
      return <div className="text-foreground/60">{item.text?.value || ''}</div>
    }
    return null
  }, [item.text])
  let tag: ReactNode = item.tag ? (
    <div className="flex h-6 items-center rounded bg-amber-500 px-2 text-white">
      {item.tag.value}
    </div>
  ) : null

  let icon: ReactNode = item.icon ? (
    <ListItemIcon roundedFull icon={assets[item.icon]} />
  ) : null

  return (
    <div className="flex items-center gap-1">
      {icon}
      {text}
      {tag}
    </div>
  )
}
