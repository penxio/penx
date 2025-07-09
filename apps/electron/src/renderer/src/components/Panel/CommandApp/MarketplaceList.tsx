import SVG from 'react-inlinesvg'
import { Box, css } from '@fower/react'
import { Button } from 'uikit'
import { Manifest } from '@penx/model'

interface ItemIconProps {
  icon: string
}
export function ExtensionIcon({ icon }: ItemIconProps) {
  const size = 48
  const rounded = 12
  if (!icon) {
    return <Box square={size} bgNeutral300 rounded={rounded}></Box>
  }

  if (icon.startsWith('/')) {
    return (
      <Box
        as="img"
        src={icon}
        alt=""
        width={size}
        height={size}
        style={{ borderRadius: rounded }}
      />
    )
  }

  const isSVG = icon.startsWith('<svg')
  if (isSVG) {
    return (
      <SVG className={css({ square: size, rounded })} src={icon as string} />
    )
  }
  return (
    <Box
      as="img"
      square={size}
      rounded={rounded}
      src={`data:image/png;base64, ${icon}`}
    />
  )
}
