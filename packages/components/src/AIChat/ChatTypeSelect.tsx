import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@penx/uikit/ui/select'

export enum ChatType {
  DATAHUB = 'DATAHUB',
  CHAT = 'CHAT',
}

interface Props {
  value: ChatType
  onSelect: (v: ChatType) => any
}

export function ChatTypeSelect({ value, onSelect }: Props) {
  return (
    <Select value={value} onValueChange={(v) => onSelect(v as ChatType)}>
      <SelectTrigger className="h-7 w-[100px] cursor-pointer rounded-full py-0">
        <SelectValue placeholder="" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem className="cursor-pointer" value={ChatType.DATAHUB}>
          DataHub
        </SelectItem>
        <SelectItem className="cursor-pointer" value={ChatType.CHAT}>
          Chat
        </SelectItem>
      </SelectContent>
    </Select>
  )
}
