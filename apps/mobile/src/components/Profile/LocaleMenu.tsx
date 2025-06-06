import { ReactNode, useState } from 'react'
import { Trans, useLingui } from '@lingui/react/macro'
import { ChevronRightIcon } from 'lucide-react'
import { LOCALE, supportLanguages } from '@penx/constants'
import { cn } from '@penx/utils'
import { Drawer } from '../Drawer'
import { useTheme } from '../theme-provider'
import { MenuItem } from './MenuItem'

type LOCALES = 'en' | 'ja' | 'ko' | 'fr' | 'ru' | 'zh-CN'
interface ItemProps {
  className?: string
  children?: React.ReactNode
  onClick?: () => void
}
export function LocaleMenu({ children, className }: ItemProps) {
  const [isOpen, setIsOpen] = useState(false)
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
          'border-foreground/5 text-foreground flex items-center justify-between border-b py-2',
          className,
        )}
        onClick={() => {
          setIsOpen(!isOpen)
        }}
      >
        <div className="font-medium">
          <Trans>Language</Trans>
        </div>
        <div>
          <ChevronRightIcon className="text-foreground/50" />
        </div>
      </div>

      <Drawer
        open={isOpen}
        setOpen={setIsOpen}
        className="bg-neutral-100 dark:bg-neutral-800"
      >
        <div className="mb-2 text-center font-bold">
          <Trans>Language</Trans>
        </div>
        <div className="divide-foreground/5 divide-y rounded-xl dark:bg-neutral-700">
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
        </div>
      </Drawer>
    </>
  )
}
