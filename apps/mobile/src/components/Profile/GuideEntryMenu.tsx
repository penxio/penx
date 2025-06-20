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

export function GuideEntryMenu({ children, className }: ItemProps) {
  const { i18n } = useLingui()
  return (
    <>
      <div
        className={cn(
          'border-foreground/5 text-foreground flex items-center justify-between border-b py-2',
          className,
        )}
        onClick={async () => {
          await InAppBrowser.openInWebView({
            url: `https://penx.io/guide/${i18n.locale}`,
            options: DefaultWebViewOptions,
          })
        }}
      >
        <div className="font-medium">
          <Trans>Guide of PenX</Trans>
        </div>
        <div>
          <ChevronRightIcon className="text-foreground/50" />
        </div>
      </div>
    </>
  )
}
