import { memo } from 'react'
import SVG from 'react-inlinesvg'
import { Box, css, FowerHTMLProps } from '@fower/react'
import { Icon } from '@iconify/react'
import { useQuery } from '@tanstack/react-query'
import { ColorfulStructIcon } from '@penx/components/ColorfulStructIcon'
import { isObjectIcon } from '@penx/extension-api'
import { getRandomColor } from '@penx/local-db'
import { cn } from '@penx/utils'
import { getIcon } from '~/lib/icon'
import { IconifyIconType, isIconify } from '~/lib/isIconify'
import { ICommandItem } from '~/lib/types'

interface ListItemIconProps extends FowerHTMLProps<'div'> {
  icon?: any
  size?: number
  bg?: string
  item?: ICommandItem
}

export const ListItemIcon = memo(
  function ListItemIcon({
    icon,
    bg,
    size = 20,
    item,
    ...rest
  }: ListItemIconProps) {
    if (item?.data?.struct) {
      return (
        <ColorfulStructIcon
          struct={item.data.struct}
          iconClassName="size-4"
          className="size-5 rounded-sm p-0"
        />
      )
    }

    if (!icon) {
      return (
        <Box flexShrink-0 square={size} bgNeutral300 rounded-6 {...rest}></Box>
      )
    }

    if (isIconify(icon)) {
      return <IconifyIcon {...icon} />
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

function IconifyIcon(icon: IconifyIconType) {
  return (
    <Box
      className={cn(
        'flex size-5 items-center justify-center rounded-[6px] p-[3px] text-sm text-white',
        icon.className,
      )}
    >
      <Icon className="" icon={icon.name.split('--').join(':')} />
    </Box>
  )
}
