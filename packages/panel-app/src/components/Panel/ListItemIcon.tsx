import { memo } from 'react'
import SVG from 'react-inlinesvg'
import { Box, css, FowerHTMLProps } from '@fower/react'
import { Icon } from '@iconify/react'
import { ColorfulStructIcon } from '@penx/components/ColorfulStructIcon'
import { isObjectIcon } from '@penx/extension-api'
import { getRandomColor } from '@penx/local-db'
import { cn } from '@penx/utils'
import { IconifyIconType, isIconify } from '../../lib/isIconify'
import { ICommandItem } from '../../lib/types'

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
          className="flex shrink-0 items-center justify-center rounded-[6px] text-xs text-white"
          style={{
            height: size,
            width: size,
          }}
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
        <div
          className="flex shrink-0 items-center justify-center rounded-[6px] text-xs text-white"
          style={{
            height: size,
            width: size,
          }}
          // bgGradientX={arr}
        >
          {icon}
        </div>
      )
    }

    // TODO: handle other icon value
    if (isObjectIcon(icon)) {
      if (icon.value === '#') {
        return (
          <Box
            className="flex shrink-0 items-center justify-center rounded-[6px] text-xs text-white shadow-md"
            style={{ width: size, height: size }}
            bgGradientX={['green500', 'blue500']}
            // bg={icon.bg || 'gray500'}
          >
            {icon.value}
          </Box>
        )
      }
    }

    if (icon.startsWith('/')) {
      return (
        <img
          src={icon}
          alt=""
          style={{
            borderRadius: 6,
            width: size,
            height: size,
          }}
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
      <img
        className="rounded-lg"
        style={{
          height: size,
          width: size,
        }}
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
    <div
      className={cn(
        'flex size-5 items-center justify-center rounded-[6px] p-[3px] text-sm text-white shadow-md',
        icon.className,
      )}
    >
      <Icon className="" icon={icon.name.split('--').join(':')} />
    </div>
  )
}
