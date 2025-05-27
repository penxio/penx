import { Trans } from '@lingui/react/macro'
import { Struct } from '@penx/domain'
import { useActiveStruct } from '@penx/hooks/useActiveStruct'
import { useStructs } from '@penx/hooks/useStructs'
import { StructType } from '@penx/types'
import { cn } from '@penx/utils'

interface Props {
  className?: string
}
export const StructTypeSelect = ({ className }: Props) => {
  const { structs } = useStructs()
  const suggestions = structs.filter((s) => s.type !== StructType.VOICE)
  const { struct, setStruct } = useActiveStruct()
  function onChange(value: Struct | null) {
    setStruct(value)
  }

  return (
    <div
      className={cn(
        'scroll-container flex w-full flex-1 items-center gap-1 text-lg ',
        className,
      )}
    >
      <div
        className={cn(
          'text-foreground/40 flex cursor-pointer items-center justify-center px-1',
          !struct && 'text-foreground font-bold',
        )}
        onClick={() => {
          onChange(null)
        }}
      >
        <Trans>Journal</Trans>
      </div>

      {suggestions.map((item, index) => (
        <div
          key={item.id}
          className={cn(
            'text-foreground/40 flex flex-1 cursor-pointer items-center justify-center px-2',
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
