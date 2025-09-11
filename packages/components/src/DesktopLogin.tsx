import { Trans } from '@lingui/react/macro'
import { Logo } from '@penx/widgets/Logo'
import { ProfileButton } from './ProfileButton'

interface DesktopWelcomeProps {}
export function DesktopLogin({}: DesktopWelcomeProps) {
  return (
    <div className="drag text-foreground flex h-screen w-full flex-col items-center justify-center gap-3 bg-white/70 dark:bg-neutral-900/70">
      <div className="flex flex-col items-center gap-3">
        <Logo className="border-foreground/10 rounded-2xl border" />
        <div className="flex flex-col items-center justify-center">
          <div className="no-drag text-3xl font-bold">PenX</div>
          {/* <div className="no-drag text-lg font-bold">
            <Trans>AI Powered Personal Data Hub</Trans>
          </div> */}
          <div className="no-drag text-foreground/60">
            <Trans>A local-first tool for for personal data management.</Trans>
          </div>
        </div>
        <ProfileButton size="lg" className="no-drag mt-4 w-36"></ProfileButton>
      </div>
    </div>
  )
}
