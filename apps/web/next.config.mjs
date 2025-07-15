import path from 'path'
import { fileURLToPath } from 'url'
import { createVanillaExtractPlugin } from '@vanilla-extract/next-plugin'

const isProd = process.env.NODE_ENV === 'production'

const withVanillaExtract = createVanillaExtractPlugin()

/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: process.env.BASE_PATH,
  compiler: {
    // removeConsole: process.env.NODE_ENV === 'production',
  },
  eslint: {
    // ignoreDuringBuilds: process.env.IGNORE_DURING_BUILDS === 'true',
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  experimental: {
    swcPlugins: [['@lingui/swc-plugin', {}]],
  },
  turbopack: {
    rules: {
      '*.po': {
        loaders: ['@lingui/loader'],
        as: '*.js',
      },
    },
  },
  async rewrites() {
    return isProd
      ? []
      : [
          {
            source: '/api/:path*',
            // destination: 'http://localhost:4000/api/:path*',
            destination: 'https://penx.io/api/:path*',
          },
        ]
  },

  output: 'standalone',
  transpilePackages: [
    '@ionic/react',
    '@ionic/core',
    '@stencil/core',
    'ionicons',
    'octokit',
    'octokit',
    '@octokit/oauth-app',
    '@octokit/openapi-types',
    '@octokit/core',
    '@octokit/app',
    'react-tweet',
  ],

  images: {
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    remotePatterns: [
      { hostname: 'public.blob.vercel-storage.com' },
      { hostname: '2cil7amusloluyl8.public.blob.vercel-storage.com' },
      { hostname: '*.public.blob.vercel-storage.com' },
      { hostname: '*.spaceprotocol.xyz' },
      { hostname: '*.respace.one' },
      { hostname: '*.penx.io' },
      { hostname: '*.penx.me' },
      { hostname: 'penx.io' },
      { hostname: 'penx.me' },
      { hostname: 'i.imgur.com' },
      { hostname: 'res.cloudinary.com' },
      { hostname: 'abs.twimg.com' },
      { hostname: 'pbs.twimg.com' },
      { hostname: 'avatar.vercel.sh' },
      { hostname: 'avatars.githubusercontent.com' },
      { hostname: 'lh3.googleusercontent.com' },
      { hostname: 'www.google.com' },
      { hostname: 'flag.vercel.app' },
      { hostname: 'imagedelivery.net' },
    ],
  },

  webpack: (config, { isServer }) => {
    // https://stackoverflow.com/questions/64926174/module-not-found-cant-resolve-fs-in-next-js-application
    config.resolve.fallback = {
      fs: false,
      net: false,
      tls: false,
    }

    config.externals.push('pino-pretty', 'lokijs', 'encoding', 'bcrypt')

    // console.log('====>>>>>>>process.env.NODE_ENV:', process.env.NODE_ENV)

    if (process.env.NODE_ENV === 'production') {
      config.module.rules.push({
        test: /\.po$/,
        use: {
          loader: '@lingui/loader',
        },
        type: 'javascript/auto',
      })
    }

    return config
  },
}

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

if (process.env.NODE_ENV === 'development') {
  // console.log('======oo:', path.join(__dirname, '../../'))
  // nextConfig.outputFileTracingRoot = path.join(__dirname, '../../')
}

export default withVanillaExtract(nextConfig)
