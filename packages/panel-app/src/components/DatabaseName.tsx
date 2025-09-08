import { useMemo } from 'react'
import { ColorfulStructIcon } from '@penx/components/ColorfulStructIcon'
import { useStructs } from '@penx/hooks/useStructs'
import { getBgColor } from '@penx/libs/color-helper'
import { cn } from '@penx/utils'
import { useCurrentCommand } from '../hooks/useCurrentCommand'

export const DatabaseName = () => {
  const { structs } = useStructs()
  const { currentCommand } = useCurrentCommand()

  const struct = useMemo(() => {
    if (currentCommand?.data?.struct) return currentCommand.data.struct
    if (currentCommand?.data?.creation) {
      const struct = structs.find(
        (s) => s.id === currentCommand?.data?.creation?.structId,
      )
      if (struct) return struct
    }
    return null
  }, [currentCommand, structs])

  if (!struct) return null
  return (
    <div className="text-foreground flex h-[30px] items-center gap-1 rounded-full text-sm">
      <ColorfulStructIcon
        struct={struct}
        iconClassName="size-4"
        className="size-5 rounded-sm p-0 shadow-sm"
      />

      <div>{struct.name}</div>
    </div>
  )
}
