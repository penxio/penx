import { useMemo } from 'react'
import { transparentize } from '@fower/color-helper'
import { Emoji } from 'emoji-picker-react'
import { Struct } from '@penx/domain'
import { colorNameMaps } from '@penx/libs/color-helper'
import { isBuiltinStruct } from '@penx/libs/isBuiltinStruct'
import { cn } from '@penx/utils'
import { StructIcon } from '@penx/widgets/StructIcon'

export function ColorfulStructIcon({
  className,
  struct,
  emojiSize = 20,
  iconClassName = 'size-4',
}: {
  emojiSize?: number
  struct: Struct
  className?: string
  iconClassName?: string
}) {
  const bg = useMemo(() => {
    if (struct.emoji) return transparentize(colorNameMaps[struct.color], 80)
    return transparentize(colorNameMaps[struct.color], 0)
  }, [struct])

  const icon = useMemo(() => {
    if (struct.emoji) return <Emoji unified={struct.emoji} size={emojiSize} />
    if (isBuiltinStruct(struct.type))
      return <StructIcon type={struct.type} className={cn(iconClassName)} />
    return null
  }, [struct])
  return (
    <div
      className={cn(
        'flex size-7 items-center justify-center rounded-lg text-white',
        className,
      )}
      style={{
        background: bg,
        // color: colorNameMaps[struct.color],
      }}
    >
      {icon}
    </div>
  )
}
