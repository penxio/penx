'use client'

import { useState } from 'react'
import { t } from '@lingui/core/macro'
import { useLingui } from '@lingui/react/macro'
import { useMutation, useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'
import { api } from '@penx/api'
import { useStructTemplates } from '@penx/hooks/useStructTemplates'
import { localDB } from '@penx/local-db'
import { store } from '@penx/store'
import { LoadingDots } from '@penx/uikit/components/icons/loading-dots'
import { Button } from '@penx/uikit/ui/button'
import { Input } from '@penx/uikit/ui/input'
import { extractErrorMessage } from '@penx/utils/extractErrorMessage'
import { FieldIcon } from '../FieldIcon'
import { usePublishStructDialog } from './usePublishStructDialog'

export function PublishStructContent() {
  const { isOpen, setIsOpen, struct } = usePublishStructDialog()
  const { isPending, mutateAsync } = useMutation({
    mutationKey: ['publishStruct'],
    mutationFn: api.publishStruct,
  })
  const { i18n } = useLingui()
  const [type, setType] = useState(struct.type)
  const { refetch, data: structTemplates, isLoading } = useStructTemplates()

  const publishedStruct = structTemplates?.find(
    (item) => item.type === struct.type,
  )

  if (!struct || isLoading)
    return (
      <div className="flex h-20 items-center justify-center">
        <LoadingDots className="bg-foreground" />
      </div>
    )

  return (
    <div className="space-y-8">
      {/* <div className="space-y-2">
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
      </div> */}

      <div className="space-y-1">
        <div className="text-foreground text-sm">Unique ID</div>
        <Input
          placeholder="Unique ID"
          value={type}
          disabled={!!publishedStruct}
          onChange={(e) =>
            setType(
              e.target.value
                .toLowerCase()
                .trim()
                .replace(/[^(a-z|0-9|\-)]/g, ''),
            )
          }
        />
      </div>

      <Button
        size="lg"
        className="w-full"
        disabled={isPending}
        onClick={async () => {
          if (!type) {
            return toast.error(t`Unique ID is required`)
          }
          try {
            await mutateAsync({
              name: struct.name,
              pluralName: struct.pluralName,
              emoji: struct.emoji,
              locale: i18n.locale,
              type: type,
              color: struct.color,
              about: '',
              columns: struct.columns,
            })
            toast.success(t`Struct published successfully!`)

            console.log('========type:', type)

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
