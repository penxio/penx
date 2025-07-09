import { Box, FowerHTMLProps } from '@fower/react'
import { ArrowLeft } from 'lucide-react'
import { useCommandPosition } from '~/hooks/useCommandPosition'
import { useSearch } from '~/hooks/useSearch'

interface Props extends FowerHTMLProps<'div'> {}

export const BackRootButton = ({ ...rest }: Props) => {
  const { setSearch } = useSearch()
  const { isCommandAppDetail, backToRoot, backToCommandApp } = useCommandPosition()

  return (
    <Box
      className="text-foreground/90 flex items-center justify-center cursor-pointer no-drag"
      {...rest}
      onClick={() => {
        console.log('=====name.....:', isCommandAppDetail)

        if (isCommandAppDetail) {
          backToCommandApp()
        } else {
          backToRoot()
          setSearch('')
        }
      }}
    >
      <ArrowLeft size={16}></ArrowLeft>
    </Box>
  )
}
