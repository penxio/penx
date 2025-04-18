'use client'

import { forwardRef } from 'react'
import { FieldIcon } from './shared/FieldIcon'

interface Props {
  databaseId: string
  rowId: string
}

export const RowForm = forwardRef<HTMLDivElement, Props>(function RowForm(
  { databaseId, rowId },
  ref,
) {
  return null
})
