import { Trans } from '@lingui/react'
import { Merienda, Poppins } from 'next/font/google'
import { cn } from '@penx/utils'

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
        <div className="flex justify-center gap-3 text-center">
          <span>
            <Trans id="Build your own" />
          </span>
          <span className='text-brand'>
            <Trans id="Digital Garden"></Trans>
          </span>
        </div>
      </div>

      <div className="text-foreground/80 mx-auto max-w-lg text-xl">
        <Trans id="PenX is a tool for building a digital garden."></Trans>
        <br />
        <Trans id="Having your own garden, start planting, and watch it grow."></Trans>
      </div>

      <div className="text-foreground/90 mx-auto max-w-lg text-2xl font-bold">
        <Trans id="The Best Tool for Learning in Public"></Trans>
      </div>
    </div>
  )
}
