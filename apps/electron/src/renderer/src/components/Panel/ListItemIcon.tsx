import { memo } from 'react'
import SVG from 'react-inlinesvg'
import { Box, css, FowerHTMLProps } from '@fower/react'
import { Icon } from '@iconify/react'
import { ColorfulStructIcon } from '@penx/components/ColorfulStructIcon'
import { isObjectIcon } from '@penx/extension-api'
import { getRandomColor } from '@penx/local-db'
import { cn } from '@penx/utils'
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
      // console.log('=====item?.data?.struct:', item.title, item?.data?.struct)

      return (
        <ColorfulStructIcon
          struct={item.data.struct}
          iconClassName="size-4"
          className="size-5 rounded-sm p-0 shadow-md"
        />
      )
    }

    if (!icon) {
      // console.log('item>>>>>>>>>>>:', icon)

      const colorName = getRandomColor('500')

      const arr = [
        colorName.replace('500', '400'),
        colorName,
        colorName.replace('500', '600'),
      ]

      return (
        <Box
          flexShrink-0
          square={size}
          bgNeutral300
          rounded-6
          toCenter
          textXS
          uppercase
          white
          shadowSM
          bgGradientX={arr}
          {...rest}
        >
          {item?.title?.toString().slice(0, 1)}
        </Box>
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
            className="shadow-md"
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
          className={'rounded-[6px] shadow-md'}
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
        'flex size-5 items-center justify-center rounded-[6px] p-[3px] text-sm text-white shadow-md',
        icon.className,
      )}
    >
      <Icon className="" icon={icon.name.split('--').join(':')} />
    </Box>
  )
}
