import SVG from 'react-inlinesvg'
import { css } from '@fower/react'

interface ItemIconProps {
  icon: string
}
export function ExtensionIcon({ icon }: ItemIconProps) {
  const size = 48
  const rounded = 12
  if (!icon) {
    return (
      <div
        className="bg-foreground/30"
        style={{
          height: size,
          width: size,
          borderRadius: rounded,
        }}
      ></div>
    )
  }

  if (icon.startsWith('/')) {
    return (
      <img
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
      <SVG
        style={{
          height: size,
          width: size,
          borderRadius: rounded,
        }}
        src={icon as string}
      />
    )
  }
  return (
    <img
      style={{
        height: size,
        width: size,
        borderRadius: rounded,
      }}
      src={`data:image/png;base64, ${icon}`}
    />
  )
}
