'use client'

import React, { FC, useEffect, useState } from 'react'
import { Card } from '@/components/ui/Card'
import { Struct } from '@penx/domain'
import { store } from '@penx/store'
import { ColumnItem } from './ColumnItem'

interface Props {
  struct: Struct
}

export const ColumnList = ({ struct }: Props) => {
  const columns = struct.columns

  return (
    <Card className="text-foreground flex flex-col">
      {columns.map((column, index) => {
        if (index === 0) return null
        return <ColumnItem column={column} />
      })}
    </Card>
  )
}
