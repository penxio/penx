import { Fragment } from 'react'
import { Session } from 'next-auth'
import { NextSeo } from 'next-seo'
import type { AppProps } from 'next/app'
import { isServer } from '@penx/constants'
import { initFower } from '../common/initFower'
import '../styles/globals.css'

initFower()

interface Props<T> extends AppProps<T> {
  Component: AppProps<T>['Component'] & {
    Layout: any
    session: Session
  }
}

function MyApp({ Component, pageProps }: Props<any>) {
  const Layout = Component.Layout ? Component.Layout : Fragment

  return (
    <>
      <meta
        name="viewport"
        content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, user-scalable=no, viewport-fit=cover"
      />

      <NextSeo
        title="PenX: Your personal database"
        description="Your personal database"
        openGraph={{
          type: 'website',
          locale: 'en_US',
          url: 'https://www.penx.io',
          siteName: 'PenX',
        }}
        twitter={{
          handle: '@coder_zion',
          site: '@coder_zion',
          cardType: 'summary_large_image',
        }}
      />

      {/* <SpeedInsights /> */}
      <Layout>
        <Component {...pageProps} />
        <div id="portal" />
      </Layout>

      {/* <Analytics /> */}
    </>
  )
}

export default MyApp
