import { useMemo } from 'react'
import { Box } from '@fower/react'
import { useStructs } from '@penx/hooks/useStructs'
import { getBgColor } from '@penx/libs/color-helper'
import { cn } from '@penx/utils'
import { useCurrentCommand } from '~/hooks/useCurrentCommand'
import { useCurrentStruct } from '~/hooks/useCurrentStruct'

export const DatabaseName = () => {
  const {} = useCurrentStruct()
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
    <Box
      className={cn('', getBgColor(struct.color))}
      h-30
      roundedFull
      px3
      toCenter
      white
      textXS
    >
      {struct.name}
    </Box>
  )
}
