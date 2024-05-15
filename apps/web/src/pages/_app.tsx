import { Fragment } from 'react'
import { fowerStore, Parser } from '@fower/react'
import { Session } from 'next-auth'
import { SessionProvider } from 'next-auth/react'
import type { AppProps } from 'next/app'
import { isServer } from '@penx/constants'
import { ClientOnly } from '~/components/ClientOnly'
import { initFower } from '../common/initFower'
// import { SpeedInsights } from '@vercel/speed-insights/next'
// import 'prismjs/themes/prism.css'
// import 'prismjs/themes/prism.css'
// import 'prismjs/themes/prism-twilight.css'

import 'simplebar-react/dist/simplebar.min.css'
import 'react-circular-progressbar/dist/styles.css'
import 'react-datepicker/dist/react-datepicker.css'
import '../styles/globals.css'
import '../styles/command.scss'
import '@glideapps/glide-data-grid/dist/index.css'
import { NextSeo } from 'next-seo'
import { AuthProvider } from '~/components/AuthProvider'

initFower()

interface Props<T> extends AppProps<T> {
  Component: AppProps<T>['Component'] & {
    Layout: any
    session: Session
  }
}

if (!isServer) {
  // TODO: move this code to a separate file
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
      />

      <SessionProvider session={pageProps.session} refetchInterval={0}>
        {/* <SpeedInsights /> */}
        {/* <Analytics /> */}
        <ClientOnly>
          <AuthProvider>
            <Layout>
              <Component {...pageProps} />
              <div id="portal" />
            </Layout>
          </AuthProvider>
        </ClientOnly>
      </SessionProvider>
    </>
  )
}

export default MyApp
