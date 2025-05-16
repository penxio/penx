import { Philosopher } from 'next/font/google'
import { cn } from '@penx/utils'

const logoFont = Philosopher({
  weight: ['400', '700'],
  subsets: ['latin'],
  display: 'swap',
})

interface Props {
  className?: string
}

export function TextLogo({ className }: Props) {
  return (
    <div
      className={cn('flex text-2xl font-bold', logoFont.className, className)}
    >
      <span className="">PenX</span>
    </div>
  )
}
