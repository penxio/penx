'use client'

import { Trans } from '@lingui/react'
import { PenLineIcon, PlusIcon, Trash2 } from 'lucide-react'
import { RouterOutputs } from '@penx/api'
import { api, trpc } from '@penx/trpc-client'
import { Prop } from '@penx/types'
import { Badge } from '@penx/uikit/badge'
import { Button } from '@penx/uikit/button'
import { Separator } from '@penx/uikit/separator'
import { ConfirmDialog } from '@penx/widgets/ConfirmDialog'
import { useCreationTypeDialog } from './CreationTypeDialog/useCreationTypeDialog'
import { usePropDialog } from './PropDialog/usePropDialog'

type Props = {
  struct: RouterOutputs['struct']['list']['0']
}
export function CreationTypeItem({ struct }: Props) {
  const { refetch } = trpc.struct.list.useQuery()
  const { setState } = useCreationTypeDialog()
  const propDialog = usePropDialog()
  const props = (struct.props as Prop[]) || []

  return (
    <div className="border-foreground/10 gap-1 rounded-xl border p-4 ">
      <div className="flex items-center justify-between">
        <span className="text-xl font-bold">{struct.name}</span>
        <Button
          variant="ghost"
          size="icon"
          className="size-8"
          onClick={() => {
            setState({
              isOpen: true,
              struct,
            })
          }}
        >
          <PenLineIcon size={16} className="text-foreground/70" />
        </Button>
      </div>

      <Separator className="my-2" />

      <div className="flex items-center justify-between">
        <h2 className="mb-2 font-semibold">Properties</h2>
        <Button
          size="icon"
          variant="ghost"
          className="size-7 text-xs opacity-60"
          onClick={() => {
            propDialog.setState({
              isOpen: true,
              struct,
              prop: null as any,
            })
          }}
        >
          <PlusIcon size={14}></PlusIcon>
        </Button>
      </div>
      <div className="flex flex-col gap-3">
        {!props.length && (
          <div className="text-foreground/50 text-sm">No properties</div>
        )}
        {props.map((item, index) => (
          <div key={index} className="flex items-center justify-between gap-1">
            <div className="flex items-center gap-1">
              <Badge size="sm" variant="secondary">
                {item.type}
              </Badge>
              <div>{item.name}</div>
            </div>
            <div className="flex items-center gap-1">
              <Button
                size="icon"
                variant="secondary"
                className="size-7 text-xs opacity-60"
                onClick={() => {
                  propDialog.setState({
                    isOpen: true,
                    struct,
                    prop: item,
                  })
                }}
              >
                <PenLineIcon size={14}></PenLineIcon>
              </Button>

              <ConfirmDialog
                title={<Trans id="Delete this property?"></Trans>}
                content={
                  <Trans id="Are you sure you want to delete this property?"></Trans>
                }
                tooltipContent={<Trans id="Delete this Property"></Trans>}
                onConfirm={async () => {
                  console.log(
                    '=====>>>>:',
                    props.filter((_, i) => i !== index),
                  )
                  await api.struct.update.mutate({
                    id: struct.id,
                    props: props.filter((_, i) => i !== index),
                  })
                  await refetch()
                }}
              >
                <Button
                  size="icon"
                  variant="secondary"
                  className="size-7 gap-1 text-xs text-red-500 opacity-60"
                >
                  <Trash2 size={14}></Trash2>
                </Button>
              </ConfirmDialog>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
