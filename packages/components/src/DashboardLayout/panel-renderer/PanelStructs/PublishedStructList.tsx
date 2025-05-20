import { toast } from 'sonner'
import { useStructs } from '@penx/hooks/useStructs'
import { IColumn } from '@penx/model-type'
import { store } from '@penx/store'
import { trpc } from '@penx/trpc-client'
import { LoadingDots } from '@penx/uikit/components/icons/loading-dots'
import { Button } from '@penx/uikit/ui/button'
import { cn } from '@penx/utils'
import { FieldIcon } from '../../../FieldIcon'

interface Props {}

export function PublishedStructList({}: Props) {
  const { structs } = useStructs()
  const { data = [], isLoading } = trpc.structTemplate.list.useQuery()
  if (isLoading) {
    return (
      <div className="flex items-center py-5">
        <LoadingDots className="bg-foreground" />
      </div>
    )
  }
  return (
    <div className="flex flex-wrap gap-2 px-1 pb-2">
      {data.map((struct) => {
        const columns = struct.columns as any as IColumn[]
        const installed = structs.some((s) => s.type === struct.type)
        return (
          <div
            key={struct.id}
            className="border-foreground/10 w-[320px]  space-y-3 rounded-xl border p-4"
          >
            <div
              className={cn(
                'text-foreground hover:bg-foreground/5 inline-flex cursor-pointer items-center justify-between gap-2 text-xl  font-bold',
              )}
            >
              <div>{struct.name}</div>
            </div>

            <div className="space-y-2">
              {columns.map((column) => (
                <div
                  key={column.id}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-1">
                    <FieldIcon columnType={column.columnType} />
                    <div className="text-foreground/70">{column.name}</div>
                  </div>
                  <div className="font-semibold">
                    {column.isPrimary
                      ? 'text'
                      : column.columnType.toLowerCase().replace('_', ' ')}
                  </div>
                </div>
              ))}
            </div>
            <Button
              size="sm"
              className=""
              disabled={installed}
              onClick={() => {
                store.structs.installStruct({
                  id: struct.id,
                  name: struct.name,
                  pluralName: struct.pluralName,
                  columns: columns,
                  description: struct.description,
                  color: struct.color,
                })
                toast.success('Struct installed successfully!')
              }}
            >
              {installed ? 'Installed' : 'Install'}
            </Button>
          </div>
        )
      })}
    </div>
  )
}
