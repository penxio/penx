import { Trans } from '@lingui/react/macro'
import { ChevronRightIcon } from 'lucide-react'
import { appEmitter } from '@penx/emitter'
import { useMobileNav } from '@penx/hooks/useMobileNav'
import { useSession } from '@penx/session'
import { Avatar, AvatarFallback, AvatarImage } from '@penx/uikit/avatar'
import { cn, getUrl } from '@penx/utils'
import { generateGradient } from '@penx/utils/generateGradient'
import { AboutMenu } from './AboutMenu'
import { LocaleMenu } from './LocaleMenu'
import { SubscriptionMenu } from './SubscriptionMenu'
import { ThemeMenu } from './ThemeMenu'

export function Profile() {
  const { session, logout } = useSession()
  // const { routeToHome } = useMobileNav()
  if (!session) return null
  return (
    <div>
      <div className="text-foreground flex items-center gap-2">
        <Avatar className="size-12 rounded-lg">
          <AvatarImage src={getUrl(session?.image)} alt={session?.name} />
          <AvatarFallback
            className={cn(
              'rounded-lg text-white',
              generateGradient(session.name),
            )}
          >
            {session?.name.slice(0, 1)}
          </AvatarFallback>
        </Avatar>
        <div>
          <div className="text-lg font-bold">{session?.name}</div>
          <div className="text-foreground/60">{session?.email}</div>
        </div>
      </div>
      <div className="text-foreground mt-10 flex flex-col gap-1">
        <SubscriptionMenu />
        <LocaleMenu />
        <ThemeMenu />

        <AboutMenu />
        <Item
          onClick={async () => {
            await logout()
            appEmitter.emit('ON_LOGOUT_SUCCESS')
            // routeToHome()
          }}
        >
          <Trans>Log out</Trans>
        </Item>
      </div>
    </div>
  )
}

interface ItemProps {
  className?: string
  children?: React.ReactNode
  onClick?: () => void
}
function Item({ children, className, onClick }: ItemProps) {
  return (
    <div
      className={cn(
        'border-foreground/5 flex items-center justify-between border-b py-2',
        className,
      )}
      onClick={() => onClick?.()}
    >
      <div className="font-medium">{children}</div>
      <div>
        <ChevronRightIcon className="text-foreground/50" />
      </div>
    </div>
  )
}
