'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { localDB } from '@penx/local-db'
import { store } from '@penx/store'
import { trpc } from '@penx/trpc-client'
import { LoadingDots } from '@penx/uikit/components/icons/loading-dots'
import { Button } from '@penx/uikit/ui/button'
import { Input } from '@penx/uikit/ui/input'
import { extractErrorMessage } from '@penx/utils/extractErrorMessage'
import { FieldIcon } from '../FieldIcon'
import { usePublishStructDialog } from './usePublishStructDialog'

export function PublishStructContent() {
  const { isOpen, setIsOpen, struct } = usePublishStructDialog()
  const { isPending, mutateAsync } = trpc.structTemplate.publish.useMutation()
  const [type, setType] = useState(struct.type)
  const { refetch } = trpc.structTemplate.list.useQuery()

  if (!struct) return null

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        {struct.columns.map((column, index) => (
          <div key={column.id} className="flex items-center justify-between">
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

      <div className="space-y-1">
        <div className="text-foreground text-sm">Unique code</div>
        <Input
          placeholder="Unique code"
          value={type}
          onChange={(e) =>
            setType(
              e.target.value
                .toUpperCase()
                .trim()
                .replace(/[^(A-Z|0-9)]/g, ''),
            )
          }
        />
      </div>

      <Button
        disabled={isPending}
        onClick={async () => {
          if (!type) {
            return toast.error('Please struct unique code is required')
          }
          try {
            await mutateAsync({
              name: struct.name,
              pluralName: struct.pluralName,
              type: struct.type,
              color: struct.color,
              about: '',
              columns: struct.columns,
            })
            toast.success('Struct published successfully!')

            store.structs.updateStruct(struct.id, {
              ...struct.raw,
              props: {
                ...struct.raw.props,
                type: type,
              },
            })

            await localDB.updateStructProps(struct.id, {
              type,
            })
            refetch()
            setIsOpen(false)
          } catch (error) {
            console.log('=====error:', error)

            toast.error(extractErrorMessage(error))
          }
        }}
      >
        {isPending ? <LoadingDots /> : 'Publish'}
      </Button>
    </div>
  )
}
