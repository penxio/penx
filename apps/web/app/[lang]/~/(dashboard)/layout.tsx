import '@/globals.css'
// import '@farcaster/auth-kit/styles.css'
import 'shikwasa/dist/style.css'
import 'react-grid-layout/css/styles.css'
import 'react-resizable/css/styles.css'
// import 'react-datepicker/dist/react-datepicker.css'
import '@glideapps/glide-data-grid/dist/index.css'
import { allMessages } from '@/appRouterI18n'
import { SubscriptionGuideDialog } from '@/components/SubscriptionGuideDialog'
import { initLingui } from '@/initLingui'
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
import linguiConfig from '@penx/libs/lingui.config'
import { cn } from '@penx/utils'
import { LoginDialog } from '@penx/widgets/LoginDialog/LoginDialog'
import { WatchAppEvent } from './WatchAppEvent'

const roboto = Poppins({
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  subsets: ['latin'],
  display: 'swap',
})

const title = 'PenX - A structured note-taking App for creators'

const description =
  'PenX is an elegant note-taking app designed for creators to effortlessly capture, organize, and manage their ideas, tasks, and inspiration all in one place.'

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
              <DashboardLayout>
                <SubscriptionGuideDialog />
                {children}
              </DashboardLayout>
            </ThemeProvider>

            <div id="portal" />
          </DashboardProviders>
        </LinguiClientProvider>
      </body>
    </html>
  )
}
