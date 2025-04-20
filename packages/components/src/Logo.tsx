import Image from 'next/image'

interface Props {
  className?: string
}
export function Logo({ className }: Props) {
  return (
    <Image
      src="/logo.png"
      alt=""
      width={80}
      height={80}
      className={className}
    />
  )
}
