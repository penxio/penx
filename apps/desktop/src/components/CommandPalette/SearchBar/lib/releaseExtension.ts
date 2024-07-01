import { ReleaseExtension } from '@penxio/preset-ui'
import { join } from '@tauri-apps/api/path'
import { exists, readDir } from '@tauri-apps/plugin-fs'
import { toast } from 'uikit'
import { api } from '@penx/trpc-client'
import { getManifest } from './getManifest'
import { getReadme } from './getReadme'
import { GithubUpload } from './GithubUpload'
import { iconToString } from './iconToString'

type IconifyIconType = {
  name: string
  className?: string
}

function isIconify(icon: any): icon is IconifyIconType {
  return typeof icon === 'object' && icon.name
}

export async function releaseExtension(item: ReleaseExtension) {
  if (!item.location) throw new Error('location is empty')
  const manifest = await getManifest(item.location)

  const canRelease = await api.extension.canReleaseExtension.query({
    name: manifest.name,
  })

  if (!canRelease) {
    toast.warning(
      `"${manifest.name}" is a existed extension name, please use another extension name in your manifest.json`,
    )
    return
  }

  const token = await api.extension.getGitHubToken.query()
  await new GithubUpload(item.location, token).uploadToGitHub()

  const readme = await getReadme(item.location)
  const screenshotsDir = await join(item.location, 'screenshots')

  let screenshotsPaths: string[] = []
  if (await exists(screenshotsDir)) {
    const files = await readDir(screenshotsDir)
    screenshotsPaths = files.map((file) => file.name)
  }

  await api.extension.upsertExtension.mutate({
    name: manifest.name,
    manifest: JSON.stringify({
      ...manifest,
      screenshots: screenshotsPaths,
    }),
    readme,
    logo: isIconify(manifest.icon)
      ? JSON.stringify(manifest.icon)
      : await iconToString(item.location, manifest.icon),
  })
}
