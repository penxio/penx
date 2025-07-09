import { useEffect } from 'react'
import { get } from 'idb-keyval'
import { FOWER_THEME_MODE } from '@penx/constants'
import { useThemeMode } from '@penx/hooks'

export function useInitThemeMode() {
  const { initMode, setMode } = useThemeMode()

  // listen dark mode
  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)')

    initMode().then(async () => {
      media.addEventListener('change', async (event) => {
        const value = await get(FOWER_THEME_MODE)
        if (value === 'auto') {
          setMode(media.matches ? 'dark' : 'light', false)
        }
      })
    })

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
}
