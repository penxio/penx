'use client'

import React, { FC, PropsWithChildren, useState } from 'react'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { ColumnType } from '@/lib/types'
import { Plus } from 'lucide-react'
import { useDatabaseContext } from '../../DatabaseProvider'
import { FieldIcon } from '../../shared/FieldIcon'

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
  return (
    <div className="p-2">
      <Item fieldType={ColumnType.TEXT} setIsOpen={setIsOpen}>
        <FieldIcon columnType={ColumnType.TEXT} />
        <div>Text</div>
      </Item>
      <Item fieldType={ColumnType.NUMBER} setIsOpen={setIsOpen}>
        <FieldIcon columnType={ColumnType.NUMBER} />
        <div>Number</div>
      </Item>

      <Item fieldType={ColumnType.URL} setIsOpen={setIsOpen}>
        <FieldIcon columnType={ColumnType.URL} />
        <div>URL</div>
      </Item>

      <Item fieldType={ColumnType.PASSWORD} setIsOpen={setIsOpen}>
        <FieldIcon columnType={ColumnType.PASSWORD} />
        <div>Password</div>
      </Item>

      <Item fieldType={ColumnType.SINGLE_SELECT} setIsOpen={setIsOpen}>
        <FieldIcon columnType={ColumnType.SINGLE_SELECT} />
        <div>Single Select</div>
      </Item>

      <Item fieldType={ColumnType.MULTIPLE_SELECT} setIsOpen={setIsOpen}>
        <FieldIcon columnType={ColumnType.MULTIPLE_SELECT} />
        <div>Multiple Select</div>
      </Item>

      <Item fieldType={ColumnType.RATE} setIsOpen={setIsOpen}>
        <FieldIcon columnType={ColumnType.SINGLE_SELECT} />
        <div>Rate</div>
      </Item>

      <Item fieldType={ColumnType.IMAGE} setIsOpen={setIsOpen}>
        <FieldIcon columnType={ColumnType.IMAGE} />
        <div>Image</div>
      </Item>

      {/* <Item fieldType={FieldType.MARKDOWN} setIsOpen={setIsOpen}>
        <FieldIcon fieldType={FieldType.MARKDOWN} />
        <div>Markdown</div>
      </Item> */}

      <Item fieldType={ColumnType.DATE} setIsOpen={setIsOpen}>
        <FieldIcon columnType={ColumnType.DATE} />
        <div>Date</div>
      </Item>

      <Item fieldType={ColumnType.CREATED_AT} setIsOpen={setIsOpen}>
        <FieldIcon columnType={ColumnType.CREATED_AT} />
        <div>Created At</div>
      </Item>

      <Item fieldType={ColumnType.UPDATED_AT} setIsOpen={setIsOpen}>
        <FieldIcon columnType={ColumnType.UPDATED_AT} />
        <div>Updated At</div>
      </Item>
    </div>
  )
}

interface Props {}

export const AddColumnBtn: FC<Props> = ({}) => {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <div className="flex h-9 w-9 items-center justify-center">
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <div className="text-foreground/50 flex h-full w-full cursor-pointer items-center justify-between">
            <Plus size={20} />
          </div>
        </PopoverTrigger>
        <PopoverContent className="p-0">
          <Content setIsOpen={setIsOpen} />
        </PopoverContent>
      </Popover>
    </div>
  )
}
