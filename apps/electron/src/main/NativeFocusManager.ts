import { runAppleScript } from 'run-applescript'

export interface FrontAppMeta {
  appName: string
  windowName: string
}

export async function getCurrentFrontAppAndWindow(): Promise<FrontAppMeta | null> {
  const script = `
        tell application "System Events"
            set frontApp to first application process whose frontmost is true
            set appName to name of frontApp
            try
                set frontWindow to first window of frontApp whose focused is true
                set windowName to name of frontWindow
                return appName & "|||" & windowName
            on error
                return appName & "|||"
            end try
        end tell
    `
  try {
    const result = await runAppleScript(script)
    const [appName, windowName] = (result as string).split('|||')
    if (!appName) return null
    return { appName: appName.trim(), windowName: windowName?.trim() ?? '' }
  } catch (err) {
    console.error('getCurrentFrontAppAndWindow error:', err)
    return null
  }
}

function safeStr(str: string): string {
  return (str || '').replace(/(["\\])/g, '\\$1')
}

function isAppNameSafe(str: string): boolean {
  return /^[\w\s\-\.]+$/.test(str)
}

export async function activateVisualFocus(
  appName: string,
  windowName: string,
): Promise<void> {
  if (!isAppNameSafe(appName)) return
  const safeWin = safeStr(windowName)
  const script = `
        tell application "System Events"
            tell application process "${appName}"
                set frontmost to true
                try
                    if "${safeWin}" is not "" then
                        set focused of window "${safeWin}" to true
                    end if
                end try
            end tell
        end tell
    `
  await runAppleScript(script)
}

export async function restoreInputFocus(
  appName: string,
  windowName: string,
): Promise<void> {
  if (!isAppNameSafe(appName)) return
  const safeWin = safeStr(windowName)
  const script = `
        tell application "System Events"
            tell application process "${appName}"
                set frontmost to true
                try
                    if "${safeWin}" is not "" then
                        set focused of window "${safeWin}" to true
                    end if
                end try
            end tell
        end tell
    `
  await runAppleScript(script)
}
