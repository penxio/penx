import { ReactNode, useState } from 'react'
import { DefaultWebViewOptions, InAppBrowser } from '@capacitor/inappbrowser'
import { Trans, useLingui } from '@lingui/react/macro'
import { ChevronRightIcon } from 'lucide-react'
import { cn } from '@penx/utils'

interface ItemProps {
  className?: string
  children?: React.ReactNode
  onClick?: () => void
}

export function PrivacyEntryMenu({ children, className }: ItemProps) {
  const { i18n } = useLingui()
  return (
    <>
      <div
        className={cn(
          'flex h-full w-full items-center justify-between',
          className,
        )}
        onClick={async () => {
          await InAppBrowser.openInWebView({
            url: 'https://penx.io/privacy',
            options: DefaultWebViewOptions,
          })
        }}
      >
        <div className="font-medium">
          <Trans>Privacy Policy</Trans>
        </div>
        <div>
          <ChevronRightIcon className="text-foreground/50" />
        </div>
      </div>
    </>
  )
}
