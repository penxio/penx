import { Box } from '@fower/react'
import { useCurrentStruct } from '~/hooks/useCurrentStruct'

export const DatabaseName = () => {
  const { struct: database } = useCurrentStruct()
  return (
    <Box
      h-30
      roundedFull
      px3
      bg={database.props.color}
      toCenter
      mr--8
      ml3
      white
      textXS
    >
      # {database.props.name}
    </Box>
  )
}
