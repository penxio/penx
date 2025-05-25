import { useEffect } from 'react'
import { i18n } from '@lingui/core'
import { detect, fromStorage, fromUrl } from '@lingui/detect-locale'
import { I18nProvider } from '@lingui/react'
import { dynamicActivate } from './dynamicActivate'

type Props = {
  children: React.ReactNode
}

const defaultLocale = 'zh_CN'

export const LocaleProvider = ({ children }: Props) => {
  useEffect(() => {
    const detectedLocale =
      detect(fromUrl('locale'), fromStorage('locale'), defaultLocale) ??
      defaultLocale

    // Activate the locale only if it's supported
    // if (languages.some((lang) => lang.locale === detectedLocale)) {
    //   void dynamicActivate(detectedLocale)
    // } else {
    //   void dynamicActivate(defaultLocale)
    // }

    void dynamicActivate(defaultLocale)
  }, [])

  return <I18nProvider i18n={i18n}>{children}</I18nProvider>
}

export const changeLanguage = async (locale: string) => {
  // Update locale in local storage
  window.localStorage.setItem('locale', locale)

  // Update locale in user profile, if authenticated
  // const state = useAuthStore.getState()
  // if (state.user) await updateUser({ locale }).catch(() => null)

  // Reload the page for language switch to take effect
  window.location.reload()
}
