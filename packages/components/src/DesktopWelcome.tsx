import { useEffect } from 'react'
import { Box } from '@fower/react'
import { Trans } from '@lingui/react/macro'
import { BindHotkey } from '@penx/components/BindHotkey/ui/BindHotkey'
import { ShortcutType } from '@penx/model-type'
import { LoadingDots } from '@penx/uikit/components/icons/loading-dots'
import { Button } from '@penx/uikit/ui/button'
import { Logo } from '@penx/widgets/Logo'

interface DesktopWelcomeProps {
  isLoading: boolean
  onGetStarted: () => void
}
export function DesktopWelcome({
  onGetStarted,
  isLoading,
}: DesktopWelcomeProps) {
  // useEffect(() => {
  //   registerDefaultAppHotkey()
  // }, [])

  return (
    <div className="drag text-foreground flex h-full w-full flex-col items-center justify-center gap-3 bg-white/70 dark:bg-neutral-900/70">
      <div className="flex items-center gap-2">
        <Logo className="rounded-2xl shadow-sm"></Logo>
      </div>
      <div className="flex flex-col items-center gap-2">
        <div className="no-drag text-3xl font-bold">PenX</div>
        <div className="no-drag text-foreground/60 text-base">
          <Trans>A local-first tool for for personal data management.</Trans>
        </div>
      </div>

      <div className="no-drag">
        <BindHotkey type={ShortcutType.TOGGLE_PANEL_WINDOW} />
      </div>

      <Button
        size="lg"
        className="no-drag mt-5 gap-1 px-8"
        disabled={isLoading}
        onClick={() => {
          localStorage.setItem('PENX_IS_BOARDED', 'true')
          onGetStarted()
        }}
      >
        <div>
          <Trans>Get Started</Trans>
        </div>
        {isLoading && <LoadingDots />}
      </Button>
    </div>
  )
}
