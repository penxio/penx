import jetpack from 'fs-jetpack'
import yargs, { ArgumentsCamelCase } from 'yargs'
import fetch from 'node-fetch'
import { join } from 'path'
import { getManifest } from '../lib/getManifest'
import { buildExtension } from '../lib/buildExtension'
import { iconToString } from '../lib/iconToString'
import { assetsToStringMap } from '../lib/assetsToStringMap'
import { escAction } from '../constants'
import { isIconify } from '../lib/utils'

type Args = {}

class Command {
  readonly command = 'dev'
  readonly describe = 'PenX dev'

  readonly builder = (args: yargs.Argv) => {
    return args.showHelpOnFail(true).strict()
  }

  handler = async (args: ArgumentsCamelCase<Args>) => {
    await buildExtension({
      watch: true,
      onSuccess: async () => {
        // console.log('Build success~')
        this.handleBuildSuccess()
      },
    })
  }

  private handleBuildSuccess = async () => {
    const manifest = await getManifest()

    const url = 'http://127.0.0.1:14158/api/upsert-extension'

    for (const command of manifest.commands) {
      const codePath = join(process.cwd(), 'dist', `${command.name}.command.js`)
      const code = jetpack.read(codePath, 'utf8')

      command.code = code + escAction
      command.icon = isIconify(command.icon) ? command.icon : await iconToString(command.icon)
    }

    const assets = await assetsToStringMap()

    const data = {
      name: manifest.name,
      title: manifest.title,
      version: manifest.version || '',
      location: process.cwd(),
      icon: typeof manifest.icon === 'object' ? JSON.stringify(manifest.icon) : manifest.icon,
      commands: JSON.stringify(manifest.commands),
      assets: JSON.stringify(assets),
    }

    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      }).then((res) => res.json())
    } catch (error) {
      console.log('upsert extension error:', error)
    }
  }
}

const command = new Command()

export default command
