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
      <div className="text-foreground space-y-2 text-4xl font-bold leading-none md:leading-tight">
        <div className="mx-auto flex justify-center gap-3">
          A structured note-taking App
        </div>
      </div>

      <div className="text-foreground/60 mx-auto max-w-lg text-lg">
        <Trans id="An elegant App designed to help you capture, organize, and store your thoughts, tasks, ideas, and information."></Trans>
        <br />
      </div>
    </div>
  )
}
