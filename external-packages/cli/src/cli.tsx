#!/usr/bin/env node
import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'
import dev from './commands/dev'
import build from './commands/build'
import release from './commands/release'
import login from './commands/login'
import logout from './commands/logout'
import whoami from './commands/whoami'

yargs(hideBin(process.argv))
  .command(login)
  .command(logout)
  .command(dev)
  .command(build)
  .command(release)
  .command(whoami)
  .alias('version', 'v')
  .describe('version', 'Show version information')
  .demandCommand(1)
  .parse()
