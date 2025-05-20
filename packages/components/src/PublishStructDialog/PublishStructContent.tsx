'use client'

import { toast } from 'sonner'
import { trpc } from '@penx/trpc-client'
import { LoadingDots } from '@penx/uikit/components/icons/loading-dots'
import { Button } from '@penx/uikit/ui/button'
import { cn } from '@penx/utils'
import { extractErrorMessage } from '@penx/utils/extractErrorMessage'
import { FieldIcon } from '../FieldIcon'
import { usePublishStructDialog } from './usePublishStructDialog'

export function PublishStructContent() {
  const { isOpen, setIsOpen, struct } = usePublishStructDialog()
  const { isPending, mutateAsync } = trpc.structTemplate.publish.useMutation()
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
      <Button
        disabled={isPending}
        onClick={async () => {
          console.log('=====struct.columns:', struct.columns)

          return
          try {
            await mutateAsync({
              id: struct.id,
              name: struct.name,
              pluralName: struct.pluralName,
              type: struct.type,
              color: struct.color,
              about: '',
              columns: struct.columns,
            })
            toast.success('Struct published successfully!')
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
