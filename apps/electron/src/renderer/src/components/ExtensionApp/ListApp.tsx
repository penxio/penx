import {
  PropsWithChildren,
  ReactNode,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { Command } from 'cmdk'
import { tinykeys } from 'tinykeys'
import { Kbd } from '@penx/components/Kbd'
import { Separator } from '@penx/uikit/ui/separator'
import { cn } from '@penx/utils'
import { useCurrentCommand } from '~/hooks/useCurrentCommand'
import { useValue } from '~/hooks/useValue'
import { ICommandItem } from '~/lib/types'
import { ListItemIcon } from '../Panel/ListItemIcon'
import { SearchInput } from '../Panel/SearchBar/SearchInput'
import { PinnedButton } from '../PinnedButton'
import { loaderStyle } from './common/constants'
import { detailMap } from './common/store'
import { ShortcutKey, ShortcutModifier } from './types'
import { PopButton } from './widgets/PopButton'

const searchBarHeight = 54
const footerHeight = 48

interface IConfirm {
  title?: ReactNode
  shortcut?: {
    modifiers: ShortcutModifier[]
    key: ShortcutKey
  }
  onConfirm: (id?: string) => any
}

interface Props {
  className?: string
  bodyClassName?: string
  confirm?: IConfirm
  hideFooter?: boolean
  headerBordered?: boolean
  isLoading?: boolean
  isDetailVisible?: boolean
}

export function ListApp({
  className,
  isLoading,
  bodyClassName,
  children,
  confirm,
  hideFooter = false,
  headerBordered = true,
  isDetailVisible,
}: PropsWithChildren<Props>) {
  const { currentCommand: command } = useCurrentCommand()

  const itemIcon = useMemo(() => {
    const assets = command?.data?.assets || {}
    return assets[command.icon as string] || command.icon
  }, [command])

  return (
    <>
      <style>{loaderStyle}</style>
      <div
        className={cn(
          'drag relative flex items-center gap-2 pr-3',
          headerBordered && ' border-foreground/10 border-b',
        )}
        style={{
          height: searchBarHeight,
        }}
      >
        <PopButton className="ml-3" />
        <SearchInput searchBarHeight={searchBarHeight} />
        {isLoading && <hr list-app-loader="" />}
      </div>
      <div className="relative flex-1">
        <Command.List>
          <div className="absolute inset-0 flex overflow-hidden outline-none">
            <Command.Group className="m-0 flex-1 overflow-auto p-2">
              {children}
            </Command.Group>
            {/* {isDetailVisible && (
            <>
              <Separator orientation="vertical" />
              <Detail />
            </>
          )} */}

            <Separator orientation="vertical" />
            <Detail />
          </div>
        </Command.List>
      </div>

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
        {confirm && <Confirm confirm={confirm} />}
      </div>
    </>
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

function Detail() {
  const { value } = useValue()
  const [content, setContent] = useState<any>()
  useEffect(() => {
    setContent(detailMap.get(value))
  }, [value])

  return <div className="flex-1 overflow-auto p-2">{content}</div>
}
