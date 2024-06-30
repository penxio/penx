import { FormApp } from '@penxio/preset-ui'
import { fs, path } from '@penxio/api'
import { formatName } from './lib/utils'
import { GITIGNORE, PRETTIER, TSCONFIG } from './lib/constants'
import { codeMap } from './lib/codeMap'
import { getPackageJSON } from './lib/getPackageJSON'
import { getManifestJSON } from './lib/getManifestJSON'
import { db } from '@penx/local-db'
import { builtCodeMap } from './lib/builtCodeMap'

interface Values {
  template: string
  extensionTitle: string
  location: string
}

export function main() {
  new FormApp({
    fields: [
      {
        label: 'Template',
        name: 'template',
        component: 'Select',
        options: [
          { label: 'Markdown App', value: 'markdown' },
          { label: 'List App', value: 'list' },
          { label: 'Form App', value: 'form' },
        ],
        value: 'list',
      },

      {
        label: 'Extension Title',
        name: 'extensionTitle',
        component: 'Input',
        value: '',
        validators: {
          required: 'Extension Name is required',
        },
      },

      {
        label: 'Location',
        name: 'location',
        component: 'LocationInput',
        value: '',
        validators: {
          required: 'Location is required',
        },
      },
    ],
    actions: [
      {
        type: 'SubmitForm',
        onSubmit,
      },
    ],
  }).run()

  async function onSubmit(values: Values) {
    const name = formatName(values.extensionTitle)
    const title = values.extensionTitle
    const location = values.location

    const appDir = await path.resolve(location, name)
    const srcDir = await path.resolve(appDir, 'src')
    const manifestContent = getManifestJSON(values.template, title)
    const pkgContent = getPackageJSON(values.template)

    try {
      const code = codeMap[values.template]

      if (!(await fs.exists(appDir))) {
        await fs.mkdir(appDir, { recursive: true })
      }

      if (!(await fs.exists(srcDir))) {
        await fs.mkdir(srcDir, { recursive: true })
      }
      const readmePath = await path.resolve(appDir, 'README.md')
      const pkgPath = await path.resolve(appDir, 'package.json')
      const manifestPath = await path.resolve(appDir, 'manifest.json')
      const gitignorePath = await path.resolve(appDir, '.gitignore')
      const prettierPath = await path.resolve(appDir, '.prettier')
      const tsconfigPath = await path.resolve(appDir, 'tsconfig.json')
      const commandPath = await path.resolve(
        srcDir,
        `${values.template}.command.ts`,
      )

      await Promise.all([
        fs.writeTextFile(readmePath, `# ${title}`),
        fs.writeTextFile(pkgPath, pkgContent),
        fs.writeTextFile(manifestPath, manifestContent),
        fs.writeTextFile(gitignorePath, GITIGNORE),
        fs.writeTextFile(prettierPath, PRETTIER),
        fs.writeTextFile(tsconfigPath, TSCONFIG),
        fs.writeTextFile(commandPath, code),
      ])

      const ext = await db.getExtensionByName(name)
      if (ext) {
        // TODO:
        // toast
        return
      }

      const manifest = JSON.parse(manifestContent)
      manifest.commands[0].code = builtCodeMap[values.template]

      await db.upsertExtension(name, {
        isDeveloping: true,
        ...manifest,
      })

      console.log('file created!')
    } catch (error) {
      console.log('error:', error)
      await fs.remove(appDir, { recursive: true })
    }
  }
}
