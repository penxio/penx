import yargs, { ArgumentsCamelCase } from 'yargs'
import { buildExtension } from '../lib/buildExtension'

type Args = {}

class Command {
  readonly command = 'build'
  readonly describe = 'PenX build'

  readonly builder = (args: yargs.Argv) => {
    return args.showHelpOnFail(true).strict()
  }

  handler = async (args: ArgumentsCamelCase<Args>) => {
    await buildExtension({
      onSuccess: async () => {
        console.log('Build success~')
      },
    })
  }
}

const command = new Command()

export default command
