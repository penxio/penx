// import '../../../globals.css'
import "@penx/uikit/globals.css"
// import '@farcaster/auth-kit/styles.css'
import 'shikwasa/dist/style.css'
import 'react-grid-layout/css/styles.css'
import 'react-resizable/css/styles.css'
// import 'react-datepicker/dist/react-datepicker.css'
// import '@glideapps/glide-data-grid/dist/index.css'
import { allMessages } from '@/appRouterI18n'
import { LinguiClientProvider } from '@/components/LinguiClientProvider'
import { SiteProvider } from '@/components/SiteContext'
import { ThemeProvider } from '@/components/ThemeProvider'
import { initLingui } from '@/initLingui'
import { ROOT_DOMAIN } from '@penx/constants'
import { getSite } from '@/lib/fetchers'
import { redirectTo404 } from '@/lib/redirectTo404'
import { AppearanceConfig } from '@penx/types'
import { cn, getUrl } from '@penx/utils'
import linguiConfig from '@/lingui.config'
// import { setI18n } from '@lingui/react/server'
import { Metadata } from 'next'
import { Poppins, Roboto } from 'next/font/google'
import Head from 'next/head'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { GoogleAnalytics } from 'nextjs-google-analytics'
import { Providers } from '../../providers'

type Params = Promise<{ domain: string; lang: string }>

export async function generateMetadata({
  params,
}: {
  params: Params
}): Promise<Metadata> {
  const site = await getSite(await params)

  const title = site?.seoTitle || ''
  const description = site?.seoDescription || ''

  const image = site?.logo
    ? getUrl(site?.logo)
    : 'https://penx.io/opengraph-image'

  return {
    title,
    description,
    icons: [site?.logo ? getUrl(site?.logo) : 'https://penx.io/favicon.ico'],
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
}

export async function generateStaticParams() {
  return linguiConfig.locales.map((lang: any) => ({ lang }))
}

export default async function RootLayout({
  params,
  children,
  ...rest
}: {
  children: React.ReactNode
  params: Promise<{ domain: string; lang: string }>
}) {
  const site = await getSite(await params)

  if (!site) return redirectTo404()

  const lang = (await params).lang
  const { appearance } = (site.config || {}) as {
    appearance: AppearanceConfig
  }
  const defaultLocale = appearance?.locale || 'en'
  const locale = lang === 'pseudo' ? defaultLocale : lang

  initLingui(locale)

  const headersList = await headers()
  const cookies = headersList.get('cookie')

  const bgColor = site.theme?.common?.bgColor ?? '#fff'
  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={cn('bg-background min-h-screen font-sans antialiased')}>
        <style>
          {`
            body {
              background: ${bgColor};
            }
           .dark body {
              background: #000;
            }

          `}
        </style>

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
              <SiteProvider site={site as any}>
                {children}
                {site.analytics?.umamiHost &&
                  site.analytics?.umamiWebsiteId && (
                    <script
                      async
                      defer
                      src={
                        `${site.analytics.umamiHost}/script.js` ||
                        'https://cloud.umami.is'
                      }
                      data-website-id={site.analytics.umamiWebsiteId}
                    ></script>
                  )}

                {site.analytics?.gaMeasurementId && (
                  <GoogleAnalytics
                    trackPageViews
                    gaMeasurementId={site.analytics?.gaMeasurementId}
                  />
                )}
              </SiteProvider>
            </ThemeProvider>

            <div id="portal" />
          </Providers>
        </LinguiClientProvider>
      </body>
    </html>
  )
}
