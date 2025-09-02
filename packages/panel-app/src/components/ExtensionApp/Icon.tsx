import { IconifyIconType, isIconify } from './types'

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  icon: IconifyIconType
  size?: 'sm' | 'md' | 'lg'
}

export const Icon = ({ icon, size, ...rest }: Props) => {
  if (!isIconify(icon)) return null

  const { className = '', name } = icon
  const hasBg = className.includes('bg-')

  return (
    <div
      className={`flex flex-shrink-0 items-center justify-center rounded-md ${hasBg ? 'h-5 w-5 text-sm text-white' : 'text-base'} ${!!icon.className && icon.className} `}
      {...rest}
    >
      {typeof name === 'number' && <span className="text-xs">{name}</span>}
      {typeof name === 'string' && <span className={`iconify ${name}`}></span>}
    </div>
  )
}
