'use client'

import React, { FC, PropsWithChildren, useState } from 'react'
import { Plus } from 'lucide-react'
import { ColumnType } from '@penx/types'
import { Popover, PopoverContent, PopoverTrigger } from '@penx/uikit/popover'
import { ColumnTypeName } from '../../../ColumnTypeName'
import { FieldIcon } from '../../../FieldIcon'
import { useDatabaseContext } from '../../DatabaseProvider'

interface PopoverStateProps {
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}
interface ItemProps extends PopoverStateProps {
  fieldType: ColumnType
}

function Item({
  children,
  setIsOpen,
  fieldType,
  ...rest
}: PropsWithChildren<ItemProps>) {
  const ctx = useDatabaseContext()
  async function addColumn() {
    setIsOpen(false)
    await ctx.addColumn(fieldType)
  }

  return (
    <div
      className="text-foreground/80 hover:bg-foreground/10 flex cursor-pointer items-center gap-2 rounded px-2 py-2 text-sm"
      {...rest}
      onClick={addColumn}
    >
      {children}
    </div>
  )
}

function Content({ setIsOpen }: PopoverStateProps) {
  const types = [
    ColumnType.TEXT,
    ColumnType.NUMBER,
    ColumnType.URL,
    ColumnType.PASSWORD,
    ColumnType.SINGLE_SELECT,
    ColumnType.MULTIPLE_SELECT,
    ColumnType.RATE,
    ColumnType.DATE,
    ColumnType.CREATED_AT,
    ColumnType.UPDATED_AT,
  ]
  return (
    <div className="p-2">
      {types.map((type) => (
        <Item key={type} fieldType={type} setIsOpen={setIsOpen}>
          <FieldIcon columnType={type} />
          <ColumnTypeName columnType={type} />
        </Item>
      ))}
    </div>
  )
}

interface Props {}

export const AddColumnBtn: FC<Props> = ({}) => {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <div className="flex h-9 w-9 shrink-0 items-center justify-center">
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <div className="text-foreground/50 flex h-full w-full cursor-pointer items-center justify-center">
            <Plus size={20} />
          </div>
        </PopoverTrigger>
        <PopoverContent isPortal className="p-0" align="end" alignOffset={10}>
          <Content setIsOpen={setIsOpen} />
        </PopoverContent>
      </Popover>
    </div>
  )
}
