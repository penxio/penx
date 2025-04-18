import { HTMLAttributes, HTMLProps } from 'react'

interface Props extends HTMLAttributes<HTMLDivElement> {
  size?: number
  innerSize?: number
  innerColor?: string
  outlineColor?: string
  dashed?: boolean
  className?: string
}

export function Bullet({
  size = 16,
  innerSize = 6,
  innerColor = 'gray500',
  outlineColor,
  dashed = false,
  ...rest
}: Props) {
  return (
    <div
      className="bulletIcon bg-foreground/20 flex h-4 w-4 cursor-pointer items-center justify-center rounded-full"
      {...rest}
    >
      <div className="bg-foreground/60 hover:scale-130 h-[6px] w-[6px] rounded-full transition-all" />
    </div>
  )
}
