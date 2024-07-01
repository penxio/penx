import { memo, useEffect, useMemo, useRef } from 'react'
import isEqual from 'react-fast-compare'
import { Box, FowerHTMLProps } from '@fower/react'
import { useMutation } from '@tanstack/react-query'
import { useVirtualizer } from '@tanstack/react-virtual'
import { Button, Checkbox, Divider } from 'uikit'
import { db } from '@penx/local-db'
import { Command } from '@penx/model'
import { ICommand, IExtension } from '@penx/model-types'
import { useValue } from '~/hooks/useValue'
import { StyledCommandGroup } from '../../CommandComponents'
import { ListItemIcon } from '../../ListItemIcon'
import { BindingHotkey } from './BindingHotkey'
import { ExtensionItem } from './ExtensionItem'
import { SetAlias } from './SetAlias'
import { useExtensions } from './useExtensions'

export function InstalledExtensionsApp() {
  const { data = [], isLoading } = useExtensions()
  if (isLoading) return null
  return (
    <Box absolute top0 left0 right0 bottom0 toLeft>
      <StyledCommandGroup p2 overflowAuto relative w-300>
        {data.map((extension) => {
          return <ExtensionItem key={extension.id} extension={extension} />
        })}
      </StyledCommandGroup>
      <Divider orientation="vertical" />
      <Detail />
    </Box>
  )
}

function Detail() {
  const { value, setValue } = useValue()
  const { data = [], isLoading } = useExtensions()

  useEffect(() => {
    const extension = data.find((item) => item.id === value)
    if (!data.length) return
    if (!value || !extension) {
      setValue(data[0].id)
    }
  }, [setValue, value, data])

  if (!value) return <Box flex-1></Box>

  return <ExtensionDetail />
}

interface ItemProps extends FowerHTMLProps<'div'> {
  command: Command
  extension?: IExtension
}

const Item = memo(
  function Item({ command, extension, ...rest }: ItemProps) {
    return (
      <Box key={command.name} h-40 py1 {...rest}>
        <Box toCenterY gap2>
          <Box flex-2 toCenterY gap1 pl-6>
            <ListItemIcon icon={command.icon} isApplication />

            <Box textSM>{command.title}</Box>
          </Box>
          <Box flex-1>
            <SetAlias extension={extension} command={command} />
          </Box>
          <Box flex-1>
            <BindingHotkey extension={extension} command={command} />
          </Box>

          <Box w-30 toRight>
            <Checkbox defaultChecked={false} />
          </Box>
        </Box>
      </Box>
    )
  },
  (prev, next) => {
    return isEqual(prev.command, next.command)
  },
)

function ExtensionDetail() {
  const { value } = useValue()
  const { data = [], isLoading } = useExtensions()
  const extension = data.find((item) => item.id === value)

  if (!extension || isLoading) return <Box flex-1></Box>

  return <DetailList commands={extension.commands} extension={extension} />
}

interface DetailListProps {
  commands: ICommand[]
  extension: IExtension
}

function DetailList({ commands, extension }: DetailListProps) {
  const parentRef = useRef<HTMLDivElement>()

  const { refetch } = useExtensions()
  const { mutateAsync, isPending } = useMutation({
    mutationKey: ['uninstall-extension'],
    mutationFn: (id: string) => db.deleteExtension(id),
  })

  const rowVirtualizer = useVirtualizer({
    count: commands.length,
    getScrollElement: () => parentRef.current!,
    estimateSize: () => 40,
    overscan: 8,
  })

  const commandMap = useMemo(() => {
    return commands.reduce((acc, cur, index) => {
      acc.set(index, cur)
      return acc
    }, new Map<number, ICommand>())
  }, [commands])

  const isBuiltin = extension.name.startsWith('penx/penx')

  return (
    <Box ref={parentRef} column flex-1 overflowAuto p3>
      <Box relative w-100p style={{ height: `${rowVirtualizer.getTotalSize()}px` }}>
        {rowVirtualizer.getVirtualItems().map((virtualItem) => {
          const command = commandMap.get(virtualItem.index)!
          return (
            <Item
              key={command.name}
              absolute
              top0
              left0
              w-100p
              h={`${virtualItem.size}px`}
              style={{
                transform: `translateY(${virtualItem.start}px)`,
              }}
              command={Command.formExtension(extension, command)}
              extension={extension}
            />
          )
        })}
      </Box>

      {extension.name !== 'penx/applications' && (
        <Box flex-1 toCenterX toBottom>
          <Button
            w-100p
            colorScheme="red500"
            variant="outline"
            disabled={isPending || isBuiltin}
            onClick={async () => {
              if (isBuiltin) return
              await mutateAsync(extension.id)
              refetch()
            }}
          >
            Uninstall Extension
          </Button>
        </Box>
      )}
    </Box>
  )
}
