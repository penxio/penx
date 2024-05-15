import { Box, getAtomIds, getCssString } from '@fower/react'
import { getCookie, setCookie } from 'cookies-next'
import { NextSeo } from 'next-seo'
import Document, {
  DocumentContext,
  DocumentInitialProps,
  Head,
  Html,
  Main,
  NextScript,
} from 'next/document'
import { LogoSpinner } from '@penx/widget'

class MyDocument extends Document {
  static async getInitialProps(
    ctx: DocumentContext,
  ): Promise<DocumentInitialProps> {
    const initialProps = await Document.getInitialProps(ctx)
    const cookieTheme = getCookie('theme-mode', ctx) as string

    if (!cookieTheme) {
      setCookie('theme-mode', 'light', { req: ctx.req, res: ctx.res })
    }

    let theme: string = getCookie('theme-mode', ctx) as string

    ;(initialProps as any).theme = theme

    return initialProps
  }
  render() {
    const theme = (this.props as any).theme

    return (
      <Html lang="en" className={theme || 'light'}>
        <Head>
          <style
            data-fower={getAtomIds()}
            dangerouslySetInnerHTML={{ __html: getCssString() }}
          />
          <link rel="icon" href="/favicon.ico" />

          <meta name="application-name" content="PenX" />
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta
            name="apple-mobile-web-app-status-bar-style"
            content="default"
          />
          <meta name="apple-mobile-web-app-title" content="PenX" />
          <meta name="format-detection" content="telephone=no" />
          <meta name="mobile-web-app-capable" content="yes" />
          {/* <meta
            name="msapplication-config"
            content="/icons/browserconfig.xml"
          /> */}
          <meta name="msapplication-TileColor" content="#2B5797" />
          <meta name="msapplication-tap-highlight" content="no" />
          <meta name="theme-color" content="#FFFFFF" />

          <link rel="apple-touch-icon" href="/images/apple-touch-icon.png" />
          <link
            rel="apple-touch-icon"
            sizes="152x152"
            href="/images/apple-touch-icon.png"
          />
          <link
            rel="apple-touch-icon"
            sizes="180x180"
            href="/images/apple-touch-icon.png"
          />
          <link
            rel="apple-touch-icon"
            sizes="167x167"
            href="/images/apple-touch-icon.png"
          />

          <link
            rel="icon"
            type="image/png"
            sizes="32x32"
            href="/images/favicon-32x32.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="16x16"
            href="/images/favicon-16x16.png"
          />
          <link rel="manifest" href="/manifest.json" />
          <link rel="shortcut icon" href="/favicon.ico" />

          <meta name="twitter:card" content="Your personal database" />

          <meta name="twitter:url" content="https://penx.io" />
          <meta name="twitter:title" content="PenX" />
          <meta name="twitter:description" content="Your personal database" />
          <meta
            name="twitter:image"
            content="https://penx.io/images/logo-192.png"
          />
          <meta name="twitter:creator" content="@coder_zion" />
          <meta property="og:type" content="website" />
          <meta property="og:title" content="PenX" />
          <meta property="og:description" content="Your personal database" />
          <meta property="og:site_name" content="PenX" />
          <meta property="og:url" content="https://www.penx.io" />
          <meta
            property="og:image"
            content="https://www.penx.io/images/apple-touch-icon.png"
          />
          {/* <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css?family=Poppins:200,300,400,500,600,700,800,900&display=optional"
          /> */}

          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css?family=Poppins:200,300,400,500,600,700,800,900&display=optional"
          />

          {process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID && (
            <script
              defer
              src="https://umami.penx.io/script.js"
              data-website-id={process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID!}
            ></script>
          )}
        </Head>
        <body>
          <div id="logo-loader-wrapper">
            <div className="logo-loader"></div>
          </div>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument
