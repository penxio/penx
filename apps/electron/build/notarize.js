const path = require('path')
const { notarize } = require('@electron/notarize')
const fs = require('fs')

require('dotenv').config({
  path: path.join(process.cwd(), '.env.apple'),
})

exports.default = async function notarizing(context) {
  const { electronPlatformName, appOutDir } = context

  if (electronPlatformName !== 'darwin') {
    return
  }

  const appName = context.packager.appInfo.productFilename

  const appPath = `${appOutDir}/${appName}.app`

  if (
    !(
      'APPLE_ID' in process.env &&
      'APPLE_APP_SPECIFIC_PASSWORD' in process.env &&
      'APPLE_TEAM_ID' in process.env
    )
  ) {
    console.warn(
      'Skipping notarizing step. APPLE_ID, APPLE_ID_PASS, and APPLE_TEAM_ID env variables must be set',
    )
    return
  }

  console.log('start notarize.......')

  return await notarize({
    appBundleId: 'io.penx.app',
    appPath: appPath,
    appleId: process.env.APPLE_ID,
    appleIdPassword: process.env.APPLE_APP_SPECIFIC_PASSWORD,
    teamId: process.env.APPLE_TEAM_ID,
  })
}
