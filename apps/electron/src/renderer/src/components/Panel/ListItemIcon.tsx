import { memo } from 'react'
import SVG from 'react-inlinesvg'
import { Box, css, FowerHTMLProps } from '@fower/react'
import { Icon } from '@iconify/react'
import { useQuery } from '@tanstack/react-query'
import { isObjectIcon } from '@penx/extension-api'
import { getRandomColor } from '@penx/local-db'
import { getIcon } from '~/lib/icon'
import { IconifyIconType, isIconify } from '~/lib/isIconify'
import { ICommandItem } from '~/lib/types'
import { ColorfulStructIcon } from '@penx/components/ColorfulStructIcon'

interface ListItemIconProps extends FowerHTMLProps<'div'> {
  icon?: any
  size?: number
  bg?: string
  isApplication?: boolean
  item?: ICommandItem
}

export const ListItemIcon = memo(
  function ListItemIcon({ icon, bg, isApplication, size = 20, item, ...rest }: ListItemIconProps) {
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
      return <Box flexShrink-0 square={size} bgNeutral300 rounded-6 {...rest}></Box>
    }

    if (isIconify(icon)) {
      return <IconifyIcon {...icon} />
    }

    if (isApplication) {
      return <AppIcon size={size} icon={icon as string} />
    }

    if (typeof icon === 'number') {
      const colorName = bg || getRandomColor('500')

      const arr = [colorName.replace('500', '400'), colorName, colorName.replace('500', '600')]

      return (
        <Box square={size} flexShrink-0 rounded-6 toCenter textXS white bgGradientX={arr}>
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
        <Box as="img" src={icon} alt="" width={size} height={size} style={{ borderRadius: 6 }} />
      )
    }

    const isSVG = icon.startsWith('<svg')
    if (isSVG) {
      return <SVG width={size} height={size} className={css({ rounded: 6 })} src={icon as string} />
    }
    return <Box as="img" square={size} rounded-6 src={`data:image/png;base64, ${icon}`} />
  },
  (prev, next) => {
    return prev.icon === next.icon
  }
)

function AppIcon({ icon, size = 20 }: { icon: string; size: number }) {
  const { isLoading, data = '' } = useQuery({
    queryKey: [icon],
    queryFn: async () => {
      return getIcon(icon)
    }
  })

  if (isLoading) {
    return <Box flexShrink-0 square={size} bgNeutral300 rounded-6></Box>
  }

  // console.log('===============appIcon:', data)

  return <Box as="img" src={data} alt="" width={size} height={size} style={{ borderRadius: 6 }} />
}

function IconifyIcon(icon: IconifyIconType) {
  // TODO: parse className to fower props
  let props: Record<string, any> = {}
  const bgGradientX: string[] = []
  const classNames = icon.className.split(/\s+/)

  for (const item of classNames) {
    if (item.startsWith('from-')) {
      bgGradientX[0] = item.replace('from-', '').split('-').join('')
    }
    if (item.startsWith('to-')) {
      bgGradientX[1] = item.replace('to-', '').split('-').join('')
    }
  }

  props.bgGradientX = bgGradientX
  if (props.bgGradientX?.length > 0) {
    props.white = true
    props.p = 2
  }

  return (
    <Box neutral900 square5 rounded-6 textSM toCenter {...props}>
      <Icon icon={icon.name.split('--').join(':')} />
    </Box>
  )
}
