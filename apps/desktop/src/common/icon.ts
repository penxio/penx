import { convertFileSrc } from '@tauri-apps/api/core'
import { FALLBACK_ICON_SYMBOL, icons } from './cache'

export const _getIcon = async (app_name: string) => {
  const { appDataDir, join, resolveResource } = await import(
    '@tauri-apps/api/path'
  )
  let icon = icons.get(app_name)
  let fallbackIcon = icons.get(FALLBACK_ICON_SYMBOL)

  if (icon && fallbackIcon) {
    return { icon, fallbackIcon }
  }

  if (!fallbackIcon) {
    fallbackIcon = convertFileSrc(await resolveResource('assets/default.svg'))
    icons.set(FALLBACK_ICON_SYMBOL, fallbackIcon)
  }

  let iconPath: string
  if (
    [
      'Migration Assistant',
      'System Information',
      'Calendar',
      'System Settings',
      'Photo Booth',
      'AirPort Utility',
    ].includes(app_name)
  ) {
    iconPath = await resolveResource(`assets/appIcons/${app_name}.app.png`)
  } else {
    const appDataDirPath = await appDataDir()
    iconPath = await join(appDataDirPath, `appIcons/${app_name}.app.png`)
  }

  icon = convertFileSrc(iconPath)
  icons.set(app_name, icon)
  return { icon, fallbackIcon }
}

export const getIcon = (appIconPath: string) => {
  return convertFileSrc(appIconPath, 'appicon')
}
