import { Trans } from '@lingui/react'
import {
  CheckCircleIcon,
  CheckIcon,
  ImageIcon,
  Link2Icon,
  LinkIcon,
  TextIcon,
} from 'lucide-react'
import { useStructs } from '@penx/hooks/useStructs'
import { ColumnType, PropType } from '@penx/types'
import { Input } from '@penx/uikit/input'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@penx/uikit/select'
import { cn } from '@penx/utils'
import { FieldIcon } from '../FieldIcon'
import { FileUpload } from '../FileUpload'
import { usePanelCreationContext } from './PanelCreationProvider'
import { SingleSelectProp } from './SingleSelectProp'

interface Props {
  onUpdateProps: (props: any) => void
}

export const PropList = ({ onUpdateProps }: Props) => {
  const creation = usePanelCreationContext()
  const { structs } = useStructs()
  const struct = structs.find((m) => m.id === creation.structId)
  if (!Array.isArray(struct?.props)) return null

  if (!struct.columns.length) return null
  return (
    <div className="mt-4 flex flex-col gap-1">
      {struct.columns.map((column, i) => {
        const props = creation.props.cells || {}
        const value = props[column.id] || ''
        return (
          <div key={i} className="flex gap-2">
            <div className="text-foreground/60 flex w-32 items-center gap-1">
              <div>
                <FieldIcon columnType={column.columnType} />
              </div>
              <span className="text-sm">{column.name}</span>
            </div>
            <div className="flex-1">
              {column.columnType === ColumnType.TEXT && (
                <Input
                  placeholder="Empty"
                  variant="unstyled"
                  className=""
                  defaultValue={value}
                  onChange={(e) => {
                    onUpdateProps({
                      ...props,
                      [column.id]: e.target.value,
                    })
                  }}
                />
              )}
              {column.columnType === ColumnType.URL && (
                <Input
                  variant="unstyled"
                  placeholder="Empty"
                  defaultValue={value}
                  onChange={(e) => {
                    onUpdateProps({
                      ...props,
                      [column.id]: e.target.value,
                    })
                  }}
                />
              )}
              {column.columnType === ColumnType.IMAGE && (
                <FileUpload
                  value={value}
                  onChange={(v) => {
                    onUpdateProps({
                      ...props,
                      [column.id]: v,
                    })
                  }}
                />
              )}
              {column.columnType === ColumnType.SINGLE_SELECT && (
                <Select
                  defaultValue={value}
                  onValueChange={(v) => {
                    onUpdateProps({
                      ...props,
                      [column.id]: v,
                    })
                  }}
                >
                  <SelectTrigger>
                    <SelectValue
                      placeholder={<Trans id="Select a property"></Trans>}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {column.options?.map((option, i) => (
                      <SelectItem key={i} value={option.name}>
                        <div className="flex items-center gap-2">
                          <div
                            className={cn(
                              'size-5 rounded',
                              `bg-${option.color}-500`,
                            )}
                          ></div>
                          <div>{option.name}</div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
