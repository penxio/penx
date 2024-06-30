import * as esbuild from 'esbuild'
import cssnano from 'cssnano'
import { Plugin } from 'esbuild'
import { join } from 'path'
import vuePlugin from 'esbuild-plugin-vue3'
import tailwindcss from 'tailwindcss'
import autoprefixer from 'autoprefixer'
import sveltePlugin from 'esbuild-svelte'
import { addIconSelectors } from '@iconify/tailwind'
import { iconsPlugin, getIconCollections, dynamicIconsPlugin } from '@egoist/tailwindcss-icons'

import { getManifest } from './getManifest'
import { CommandItem } from '../types'
import { createStyleFile } from './createStyleFile'
import { createVueEntry } from './createVueEntry'
import { createSvelteEntry } from './createSvelteEntry'
import { postcssPlugin } from '../esbuild-plugins/postcssPlugin'
import { inlineCssPlugin } from '../esbuild-plugins/inlineCssPlugin'
import { createReactPlugin } from '../esbuild-plugins/createReactPlugin'
import { createSolidPlugin } from '../esbuild-plugins/createSolidPlugin'
import { createOnEndPlugin } from '../esbuild-plugins/createOnEndPlugin'
import { createWorkerPlugin } from '../esbuild-plugins/createWorkerPlugin'

interface Options {
  watch?: boolean
  onSuccess?: () => Promise<void>
}

function findCommandFile(item: CommandItem) {
  const cwd = process.cwd()
  if (item?.mode !== 'custom-ui') {
    return join(cwd, 'src', `${item.name}.command.ts`)
  }

  if (item.framework === 'vue') {
    return join(cwd, 'src', `${item.name}.command.vue`)
  }

  if (item.framework === 'svelte') {
    return join(cwd, 'src', `${item.name}.command.svelte`)
  }

  if (item.framework === 'react' || item.framework === 'solid') {
    return join(cwd, 'src', `${item.name}.command.tsx`)
  }

  throw new Error(`Cannot find a command file for "${item.name}"`)
}

export async function buildExtension({ watch = false, onSuccess }: Options) {
  const cwd = process.cwd()

  const entries: string[] = []
  const commandFiles: string[] = []

  const manifest = await getManifest()

  for (const cmd of manifest.commands) {
    const commandFile = findCommandFile(cmd)
    commandFiles.push(commandFile)

    if (commandFile.endsWith('.vue')) {
      const entryFile = await createVueEntry(cmd)
      entries.push(entryFile)
    } else if (commandFile.endsWith('.svelte')) {
      const entryFile = await createSvelteEntry(cmd)
      entries.push(entryFile)
    } else {
      entries.push(commandFile)
    }
  }

  const hasIframeRuntime = manifest.commands.some((item) => item.mode === 'custom-ui')
  if (hasIframeRuntime) {
    createStyleFile()
  }

  const buildOptions = {
    entryPoints: entries,
    outdir: 'dist',
    bundle: true,
    format: 'iife',
    platform: 'browser',
    tsconfig: join(cwd, 'tsconfig.json'),
    loader: {
      '.css': 'css',
    },
    sourcemap: false,
    logLevel: 'debug',
    treeShaking: true,
  } as esbuild.BuildOptions

  const plugins: Plugin[] = []

  const { commands } = manifest
  const hasVue = commands.some((item) => item.framework === 'vue')
  const hasSvelte = commands.some((item) => item.framework === 'svelte')
  const hasTsx = commandFiles.some((item) => item.endsWith('.tsx'))

  if (hasIframeRuntime) {
    plugins.push(
      postcssPlugin({
        plugins: [
          tailwindcss({
            content: [
              './src/**/*.{js,ts,tsx,vue,svelte}',
              './manifest.json',
              './node_modules/@penxio/react/**/*.js',
            ],
            theme: {
              extend: {},
            },
            plugins: [
              addIconSelectors(['mdi', 'mdi-light', 'lucide', 'tabler']),

              // iconsPlugin({
              //   prefix: 'icon',
              //   collections: getIconCollections(['mdi', 'lucide', 'tabler']),
              // }),
            ],
          }),
          autoprefixer,
          cssnano,
        ],
      }),
      inlineCssPlugin,
    )
  }

  if (hasVue) {
    plugins.push(vuePlugin({}) as any)
  }

  if (hasSvelte) {
    plugins.unshift(sveltePlugin())
  }

  if (hasTsx) {
    plugins.push(createReactPlugin(manifest.commands))
    plugins.push(createSolidPlugin(manifest.commands))
  }

  plugins.push(createWorkerPlugin(manifest.commands))

  if (watch) {
    const onEndPlugin = createOnEndPlugin(onSuccess)
    plugins.push(onEndPlugin)
    const ctx = await esbuild.context({
      ...buildOptions,
      // minify: hasIframeRuntime,
      minify: true,
      plugins,
    })

    ctx.watch()
  } else {
    await esbuild.build({
      ...buildOptions,
      minify: true,
      plugins,
    })
    onSuccess?.()
  }
}
