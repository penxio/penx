import { PropsWithChildren, ReactNode, useEffect, useMemo } from 'react';
import { tinykeys } from 'tinykeys';
import { Kbd } from '@penx/components/Kbd';
import { cn } from '@penx/utils';
import { ICommandItem } from '~/lib/types';
import { ListItemIcon } from '../Panel/ListItemIcon';
import { PinnedButton } from '../PinnedButton';
import { ShortcutKey, ShortcutModifier } from './types';
import { PopButton } from './widgets/PopButton';


const searchBarHeight = 54
const footerHeight = 48

interface IConfirm {
  title?: ReactNode
  shortcut?: {
    modifiers: ShortcutModifier[]
    key: ShortcutKey
  }
  onConfirm: () => any
}

interface Props {
  className?: string
  bodyClassName?: string
  command: ICommandItem
  actions?: ReactNode
  confirm?: IConfirm
  hideHeader?: boolean
  hideFooter?: boolean
  headerBordered?: boolean
  title?: ReactNode
}

export function DetailApp({
  className,
  bodyClassName,
  children,
  command,
  actions,
  confirm,
  hideHeader = false,
  hideFooter = false,
  headerBordered = true,
  title,
}: PropsWithChildren<Props>) {
  const itemIcon = useMemo(() => {
    const assets = command?.data?.assets || {}
    return assets[command.icon as string] || command.icon
  }, [command])

  return (
    <div className={cn('flex h-full w-full flex-col', className)}>
      {!hideHeader && (
        <div
          className={cn(
            'drag flex items-center gap-2 pr-3',
            headerBordered && ' border-foreground/10 border-b',
          )}
          style={{
            height: searchBarHeight,
          }}
        >
          <PopButton className="ml-3" />
          <div className="font-medium">{title}</div>
          <PinnedButton className='ml-auto' />
        </div>
      )}
      <div
        className={cn('relative flex-1 overflow-auto', bodyClassName)}
        style={{
          overscrollBehavior: 'contain',
          scrollPaddingBlockEnd: 40,
        }}
      >
        {children}
      </div>

      {!hideFooter && (
        <div
          className="border-foreground/10 bg-foreground/5 flex items-center justify-between border-t px-3"
          style={{
            height: footerHeight,
          }}
        >
          <div className="flex items-center gap-1">
            <ListItemIcon icon={itemIcon} />
            <div className="text-foreground/80 text-sm">
              {command.title.toString()}
            </div>
          </div>
          {actions}
          {confirm && <Confirm confirm={confirm} />}
        </div>
      )}
    </div>
  )
}

function Confirm({ confirm }: { confirm: IConfirm }) {
  const { shortcut } = confirm
  useEffect(() => {
    if (!shortcut) return
    const key = shortcut.modifiers.join('+') + '+' + shortcut.key
    let unsubscribe = tinykeys(window, {
      [key]: (event: any) => {
        event.preventDefault()
        confirm.onConfirm?.()
      },
    })
    return () => {
      unsubscribe()
    }
  })

  return (
    <div
      className="hover:bg-foreground/10 flex h-8 cursor-pointer items-center gap-1 rounded-md px-2"
      onClick={() => {
        confirm.onConfirm?.()
      }}
    >
      <div className="text-sm">{confirm.title}</div>
      {shortcut && (
        <div className="flex items-center justify-between gap-x-1">
          {shortcut.modifiers.map((modifier, i) => (
            <Kbd key={i}>{modifier}</Kbd>
          ))}
          <Kbd>{shortcut.key}</Kbd>
        </div>
      )}
    </div>
  )
}