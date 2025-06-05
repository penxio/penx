import { ReactNode } from 'react'
import { Trans } from '@lingui/react'

export const dynamic = 'force-static'

export default async function Layout({
  params,
  children,
}: {
  children: ReactNode
  params: Promise<{ domain: string; lang: string }>
}) {
  return (
    <html suppressHydrationWarning>
      <body className="">
        <div className="prose prose-invert mx-auto flex flex-col gap-8 md:p-0">
          <div className="pt-20">{children}</div>
        </div>
      </body>
    </html>
  )
}
