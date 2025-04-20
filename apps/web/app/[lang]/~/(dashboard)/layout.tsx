// import '../../../globals.css'
import '@penx/uikit/globals.css'
// import '@farcaster/auth-kit/styles.css'
import 'shikwasa/dist/style.css'
import 'react-grid-layout/css/styles.css'
import 'react-resizable/css/styles.css'
// import 'react-datepicker/dist/react-datepicker.css'
import '@glideapps/glide-data-grid/dist/index.css'
import { allMessages } from '@/appRouterI18n'
import { LinguiClientProvider } from '@/components/LinguiClientProvider'
import { ThemeProvider } from '@/components/ThemeProvider'
import { initLingui } from '@/initLingui'
import linguiConfig from '@/lingui.config'
// import { setI18n } from '@lingui/react/server'
import { Metadata } from 'next'
import { Poppins, Roboto } from 'next/font/google'
import Head from 'next/head'
import { headers } from 'next/headers'
import NextTopLoader from 'nextjs-toploader'
import { cn } from '@penx/utils'
import { Providers } from '../../providers'
import { DashboardLayout } from './DashboardLayout'

const roboto = Poppins({
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  subsets: ['latin'],
  display: 'swap',
})

const title = 'PenX - build your own digital garden'

const description =
  'PenX is a tool for building a digital garden. Having your own garden, start planting, and watch it grow.'

const image = 'https://penx.io/opengraph-image'

export async function generateStaticParams() {
  return linguiConfig.locales.map((lang: any) => ({ lang }))
}

export const metadata: Metadata = {
  title,
  description,
  icons: ['https://penx.io/favicon.ico'],
  openGraph: {
    title,
    description,
    images: [image],
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
    images: [image],
    creator: '@zio_penx',
  },
  metadataBase: new URL('https://penx.io'),
}

export default async function RootLayout({
  params,
  children,
  ...rest
}: {
  children: React.ReactNode
  params: Promise<{ domain: string; lang: string }>
}) {
  const lang = (await params).lang
  const locale = lang === 'pseudo' ? 'en' : lang
  initLingui(locale)

  const headersList = await headers()
  const cookies = headersList.get('cookie')

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={cn('bg-background min-h-screen font-sans antialiased')}>
        <LinguiClientProvider
          initialLocale={locale}
          initialMessages={allMessages[locale]!}
        >
          <Providers cookies={cookies}>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <NextTopLoader
                color="#000"
                // crawlSpeed={0.08}
                height={2}
                showSpinner={false}
                template='<div class="bar" role="bar"><div class="peg"></div></div>'
              />

              <DashboardLayout>{children}</DashboardLayout>
            </ThemeProvider>

            <div id="portal" />
          </Providers>
        </LinguiClientProvider>
      </body>
    </html>
  )
}
