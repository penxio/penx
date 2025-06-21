'use client'

import { useMemo } from 'react'
import { Trans } from '@lingui/react/macro'
import { ColumnType } from '@penx/types'
import { cn } from '@penx/utils'

interface Props {
  className?: string
  columnType: any
}

export const ColumnTypeName = ({ columnType, className }: Props) => {
  const name = useMemo(() => {
    if (columnType == ColumnType.TEXT) return <Trans>Text</Trans>
    if (columnType == ColumnType.NUMBER) return <Trans>Number</Trans>
    if (columnType == ColumnType.URL) return <Trans>URL</Trans>
    if (columnType == ColumnType.BOOLEAN) return <Trans>Boolean</Trans>
    if (columnType == ColumnType.SINGLE_SELECT)
      return <Trans>Single Select</Trans>
    if (columnType == ColumnType.MULTIPLE_SELECT)
      return <Trans>Multiple Select</Trans>

    if (columnType == ColumnType.RATE) return <Trans>Rate</Trans>
    if (columnType == ColumnType.REMINDER) return <Trans>Reminder</Trans>
    if (columnType == ColumnType.PASSWORD) return <Trans>Password</Trans>
    if (columnType == ColumnType.IMAGE) return <Trans>Image</Trans>
    if (columnType == ColumnType.DATE) return <Trans>Date</Trans>
    if (columnType == ColumnType.CREATED_AT) return <Trans>Created At</Trans>
    if (columnType == ColumnType.UPDATED_AT) return <Trans>Updated At</Trans>
    return ''
  }, [columnType])
  return <div className={cn('', className)}>{name}</div>
}
