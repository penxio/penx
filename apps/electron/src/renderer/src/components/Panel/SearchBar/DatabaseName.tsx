import { Box } from '@fower/react'
import { getBgColor } from '@penx/libs/color-helper'
import { cn } from '@penx/utils'
import { useCurrentStruct } from '~/hooks/useCurrentStruct'

export const DatabaseName = () => {
  const { struct } = useCurrentStruct()
  return (
    <Box
      className={cn('', getBgColor(struct.props.color))}
      h-30
      roundedFull
      px3
      toCenter
      mr--8
      ml3
      white
      textXS
    >
      {struct.props.name}
    </Box>
  )
}
