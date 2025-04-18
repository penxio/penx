import { cn } from '@/lib/utils'
import { Trans } from '@lingui/react/macro'
import { Merienda, Poppins } from 'next/font/google'

const merienda = Merienda({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
})

const poppins = Poppins({
  weight: ['400', '500', '600', '700', '800', '900'],
  subsets: ['latin'],
  display: 'swap',
})

export function Slogan() {
  return (
    <div className="space-y-3 text-center">
      <div className="text-foreground space-y-2 text-5xl font-bold leading-none md:text-6xl md:leading-tight">
        <div className="">
          <Trans>
            Build your own <span className="text-brand">Digital Garden</span>
          </Trans>
        </div>
      </div>

      <div className="text-foreground/80 mx-auto max-w-lg text-xl">
        <Trans>PenX is a tool for building a digital garden.</Trans>
        <br />
        <Trans>
          Having your own garden, start planting, and watch it grow.
        </Trans>
      </div>

      <div className="text-foreground/90 mx-auto max-w-lg text-2xl font-bold">
        <Trans>
          The Best Tool for{' '}
          <span className="text-brand">Learning in Public</span>
        </Trans>
      </div>
    </div>
  )
}
