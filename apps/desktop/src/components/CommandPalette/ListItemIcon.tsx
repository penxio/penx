import { memo } from 'react'
import SVG from 'react-inlinesvg'
import { Box, css, FowerHTMLProps } from '@fower/react'
import { useQuery } from '@tanstack/react-query'
import { isObjectIcon } from 'penx'
import { getRandomColor } from '@penx/local-db'
import { getIcon } from '~/common/icon'

interface ListItemIconProps extends FowerHTMLProps<'div'> {
  icon?: string | number
  size?: number
  bg?: string
  isApplication?: boolean
}

export const ListItemIcon = memo(
  function ListItemIcon({
    icon,
    bg,
    isApplication,
    size = 20,
    ...rest
  }: ListItemIconProps) {
    if (!icon) {
      return (
        <Box flexShrink-0 square={size} bgNeutral300 rounded-6 {...rest}></Box>
      )
    }

    if (isApplication) {
      return <AppIcon size={size} icon={icon as string} />
    }

    if (typeof icon === 'number') {
      const colorName = bg || getRandomColor('500')

      const arr = [
        colorName.replace('500', '400'),
        colorName,
        colorName.replace('500', '600'),
      ]

      return (
        <Box
          square={size}
          flexShrink-0
          rounded-6
          toCenter
          textXS
          white
          bgGradientX={arr}
        >
          {icon}
        </Box>
      )
    }

    // TODO: handle other icon value
    if (isObjectIcon(icon)) {
      if (icon.value === '#') {
        return (
          <Box
            square={size}
            flexShrink-0
            rounded-6
            toCenter
            textXS
            white
            // bgGradientX={['green500', 'blue500']}
            bg={icon.bg || 'gray500'}
          >
            {icon.value}
          </Box>
        )
      }
    }

    if (icon.startsWith('/')) {
      return (
        <Box
          as="img"
          src={icon}
          alt=""
          width={size}
          height={size}
          style={{ borderRadius: 6 }}
        />
      )
    }

    const isSVG = icon.startsWith('<svg')
    if (isSVG) {
      return (
        <SVG
          width={size}
          height={size}
          className={css({ rounded: 6 })}
          src={icon as string}
        />
      )
    }
    return (
      <Box
        as="img"
        square={size}
        rounded-6
        src={`data:image/png;base64, ${icon}`}
      />
    )
  },
  (prev, next) => {
    return prev.icon === next.icon
  },
)

function AppIcon({ icon, size = 20 }: { icon: string; size: number }) {
  const { isLoading, data = '' } = useQuery({
    queryKey: [icon],
    queryFn: async () => {
      return getIcon(icon)
    },
  })

  if (isLoading) {
    return <Box flexShrink-0 square={size} bgNeutral300 rounded-6></Box>
  }

  // console.log('===============appIcon:', data)

  return (
    <Box
      as="img"
      src={data}
      alt=""
      width={size}
      height={size}
      style={{ borderRadius: 6 }}
    />
  )
}
