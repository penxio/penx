import {
  hideGuideEntry,
  useGuideEntryHidden,
} from '@/hooks/useGuideEntryHidden'
import { DefaultWebViewOptions, InAppBrowser } from '@capacitor/inappbrowser'
import { t } from '@lingui/core/macro'
import { Trans, useLingui } from '@lingui/react/macro'
import { UserIcon, XIcon } from 'lucide-react'
import { Button } from '@penx/uikit/ui/button'

interface Props {
  //
}

export const GuideEntry = ({}: Props) => {
  const { data } = useGuideEntryHidden()
  const { i18n } = useLingui()
  if (data) return null
  return (
    <div
      className="shadow-card relative mb-2 flex flex-col overflow-hidden rounded-xl bg-white p-3 dark:bg-neutral-700"
      onClick={async () => {
        await InAppBrowser.openInWebView({
          url: `https://penx.io/guide/${i18n.locale}`,
          options: DefaultWebViewOptions,
        })
      }}
    >
      <div className="flex justify-between">
        <div className="text-base font-bold">
          <Trans>Guide of PenX</Trans>
        </div>
        <Button
          size="icon"
          className="size-7 rounded-full"
          variant="secondary"
          onClick={async (e) => {
            e.stopPropagation()
            hideGuideEntry()
          }}
        >
          <XIcon className="size-4" />
        </Button>
      </div>
      <div className="text-xs">
        <Trans>An Introduction to PenX and How to Use It</Trans>
      </div>
    </div>
  )
}
