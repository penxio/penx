import '@/globals.css'
import 'shikwasa/dist/style.css'
import 'react-grid-layout/css/styles.css'
import 'react-resizable/css/styles.css'
// import { setI18n } from '@lingui/react/server'
import { Metadata } from 'next'
import { Poppins, Roboto } from 'next/font/google'
import Head from 'next/head'
import { headers } from 'next/headers'
import NextTopLoader from 'nextjs-toploader'
import { DashboardLayout } from '@penx/components/DashboardLayout'
import { DashboardProviders } from '@penx/components/DashboardProviders'
import { GoogleOauthDialog } from '@penx/components/GoogleOauthDialog'
import { LinguiClientProvider } from '@penx/components/LinguiClientProvider'
import { ThemeProvider } from '@penx/components/ThemeProvider'
import { isServer, locales } from '@penx/constants'
import { LocaleProvider } from '@penx/locales'
import { cn } from '@penx/utils'
import { LoginDialog } from '@penx/widgets/LoginDialog/LoginDialog'
import { PanelNotes } from '../../../../packages/components/src/DashboardLayout/panel-renderer/PanelJournal/PanelNotes'
import { NodeModelApiInjector } from './NodeModelApiInjector'
import { WatchAppEvent } from './WatchAppEvent'

const roboto = Poppins({
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  subsets: ['latin'],
  display: 'swap',
})

const title = 'PenX - A structured note-taking App'

const description =
  'An elegant App designed to help you capture, organize, and store your thoughts, tasks, ideas, and information.'

const image = 'https://penx.io/opengraph-image'

export async function generateStaticParams() {
  return locales.map((lang: any) => ({ lang }))
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
}: {
  children: React.ReactNode
  params: Promise<{ domain: string; lang: string }>
}) {
  const lang = (await params).lang
  const locale = lang === 'pseudo' ? 'en' : lang

  const headersList = await headers()
  const cookies = headersList.get('cookie')

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={cn('bg-background min-h-screen font-sans antialiased')}>
        <LocaleProvider locale={locale}>
          <NodeModelApiInjector>
            <DashboardProviders cookies={cookies}>
              <GoogleOauthDialog />
              <LoginDialog />
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

                <WatchAppEvent />
                <DashboardLayout>{children}</DashboardLayout>
              </ThemeProvider>
            </DashboardProviders>
          </NodeModelApiInjector>
        </LocaleProvider>

        <div id="portal" className="fixed left-0 top-0 z-[100000000]" />
      </body>
    </html>
  )
}
