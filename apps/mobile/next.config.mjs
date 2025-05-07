import path from 'path';
import { fileURLToPath } from 'url';
import { createVanillaExtractPlugin } from '@vanilla-extract/next-plugin';

const withVanillaExtract = createVanillaExtractPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  compiler: {
    // removeConsole: process.env.NODE_ENV === 'production',
  },

  output: 'standalone',
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '**',
      },
    ],
    unoptimized: true,
  },
  output: 'export',
  transpilePackages: [
    '@ionic/react',
    '@ionic/core',
    '@stencil/core',
    'ionicons',
    'octokit',
    '@octokit/oauth-app',
    '@octokit/openapi-types',
    '@octokit/core',
    '@octokit/app',
    'react-tweet',
  ],

  webpack: (config, { isServer }) => {
    // https://stackoverflow.com/questions/64926174/module-not-found-cant-resolve-fs-in-next-js-application
    config.resolve.fallback = {
      fs: false,
      net: false,
      tls: false,
    };

    config.externals.push('pino-pretty', 'lokijs', 'encoding', 'bcrypt');

    // console.log('====>>>>>>>process.env.NODE_ENV:', process.env.NODE_ENV)

    if (process.env.NODE_ENV === 'production') {
      config.module.rules.push({
        test: /\.po$/,
        use: {
          loader: '@lingui/loader',
        },
        type: 'javascript/auto',
      });
    }

    if (isServer) {
    }

    return config;
  },
};

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

if (process.env.NODE_ENV === 'development') {
  // console.log('======oo:', path.join(__dirname, '../../'))
  nextConfig.outputFileTracingRoot = path.join(__dirname, '../../');
}

export default withVanillaExtract(nextConfig);
