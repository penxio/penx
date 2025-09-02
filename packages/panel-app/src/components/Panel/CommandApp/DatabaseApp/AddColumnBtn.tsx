'use client'

import React, { FC, PropsWithChildren, useState } from 'react'
import { Plus, PlusIcon } from 'lucide-react'
import { ColumnTypeName } from '@penx/components/ColumnTypeName'
import { FieldIcon } from '@penx/components/FieldIcon'
import { Struct } from '@penx/domain'
import { store } from '@penx/store'
import { ColumnType } from '@penx/types'
import { Popover, PopoverContent, PopoverTrigger } from '@penx/uikit/popover'
import { Button } from '@penx/uikit/ui/button'

interface PopoverStateProps {
  struct: Struct
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}
interface ItemProps extends PopoverStateProps {
  columnType: ColumnType
  struct: Struct
}

function Item({
  children,
  setIsOpen,
  columnType,
  struct,
  ...rest
}: PropsWithChildren<ItemProps>) {
  async function addColumn() {
    setIsOpen(false)
    store.structs.addColumn(struct, { columnType })
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

function Content({ setIsOpen, struct }: PopoverStateProps) {
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
        <Item
          key={type}
          columnType={type}
          setIsOpen={setIsOpen}
          struct={struct}
        >
          <FieldIcon columnType={type} />
          <ColumnTypeName columnType={type} />
        </Item>
      ))}
    </div>
  )
}

interface Props {
  struct: Struct
}

export const AddColumnBtn: FC<Props> = ({ struct }) => {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <div className="flex h-9 w-9 shrink-0 items-center justify-center">
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            className=" hover:bg-foreground/10 size-7 rounded-md"
            size="icon"
          >
            <PlusIcon className="text-foreground/40" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          isPortal
          className="z-50 max-h-[320px] overflow-auto p-0"
          align="end"
          alignOffset={10}
        >
          <Content setIsOpen={setIsOpen} struct={struct} />
        </PopoverContent>
      </Popover>
    </div>
  )
}
