import { ReactNode, useState } from 'react'
import { Trans, useLingui } from '@lingui/react/macro'
import { ChevronRightIcon } from 'lucide-react'
import { LOCALE, supportLanguages } from '@penx/constants'
import { cn } from '@penx/utils'
import { useTheme } from '../theme-provider'
import { Drawer } from '../ui/Drawer'
import { DrawerHeader } from '../ui/DrawerHeader'
import { DrawerTitle } from '../ui/DrawerTitle'
import { Menu } from '../ui/Menu'
import { MenuItem } from '../ui/MenuItem'

type LOCALES = 'en' | 'ja' | 'ko' | 'fr' | 'ru' | 'zh-CN'
interface ItemProps {
  className?: string
  children?: React.ReactNode
  onClick?: () => void
}
export function LocaleMenu({ children, className }: ItemProps) {
  const [open, setOpen] = useState(false)
  const { i18n } = useLingui()
  const [locale, setLocale] = useState<LOCALES>(
    // pathname?.split('/')[1] as LOCALES,
    i18n.locale as any,
  )

  function handleChange(value: string) {
    const locale = value as LOCALES

    setLocale(locale)
    i18n.activate(locale)
    localStorage.setItem(LOCALE, locale)
    // router.push(newPath)
  }
  return (
    <>
      <div
        className={cn(
          'flex h-full w-full items-center justify-between',
          className,
        )}
        onClick={() => {
          setOpen(!open)
        }}
      >
        <div className="font-medium">
          <Trans>Language</Trans>
        </div>
        <div>
          <ChevronRightIcon className="text-foreground/50" />
        </div>
      </div>

      <Drawer open={open} setOpen={setOpen}>
        <DrawerHeader>
          <DrawerTitle>
            <Trans>Language</Trans>
          </DrawerTitle>
        </DrawerHeader>

        <Menu>
          {supportLanguages.map(([code, name]) => (
            <MenuItem
              key={code}
              checked={code == locale}
              onClick={() => {
                handleChange(code)
              }}
            >
              {name}
            </MenuItem>
          ))}
        </Menu>
      </Drawer>
    </>
  )
}
