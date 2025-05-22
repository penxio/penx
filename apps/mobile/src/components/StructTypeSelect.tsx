import { Struct } from '@penx/domain'
import { useActiveStruct } from '@penx/hooks/useActiveStruct'
import { useStructs } from '@penx/hooks/useStructs'
import { cn } from '@penx/utils'

interface Props {
  className?: string
}
export const StructTypeSelect = ({ className }: Props) => {
  const { structs } = useStructs()
  const suggestions = structs
  const { struct, setStruct } = useActiveStruct()
  function onChange(value: Struct | null) {
    setStruct(value)
  }

  return (
    <div
      className={cn(
        'flex w-full flex-1 items-center gap-1 overflow-auto text-xl',
        className,
      )}
    >
      <div
        className={cn(
          'text-foreground/50 flex flex-1 cursor-pointer items-center justify-center px-2',
          !struct && 'text-foreground font-bold',
        )}
        onClick={() => {
          onChange(null)
        }}
      >
        All
      </div>

      {suggestions.map((item, index) => (
        <div
          key={item.id}
          className={cn(
            'text-foreground/50 flex flex-1 cursor-pointer items-center justify-center px-2',
            struct?.id == item.id && 'text-foreground font-bold',
          )}
          onClick={() => {
            onChange(item)
          }}
        >
          {item.name}
        </div>
      ))}
    </div>
  )
}
