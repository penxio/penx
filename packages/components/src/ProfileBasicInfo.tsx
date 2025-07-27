import { useMemo } from 'react'
import { t } from '@lingui/core/macro'
import { Trans } from '@lingui/react/macro'
import { CopyIcon } from 'lucide-react'
import { toast } from 'sonner'
import { appEmitter } from '@penx/emitter'
import { useCopyToClipboard } from '@penx/hooks/useCopyToClipboard'
import { useSession } from '@penx/session'
import { PlanType } from '@penx/types'
import { Avatar, AvatarFallback, AvatarImage } from '@penx/uikit/avatar'
import { Badge } from '@penx/uikit/ui/badge'
import { cn, getUrl } from '@penx/utils'
import { generateGradient } from '@penx/utils/generateGradient'

export function ProfileBasicInfo() {
  const { session } = useSession()

  const planType = useMemo(() => {
    if (!session) return ''
    if (session.planType === PlanType.STANDARD) return <Trans>PRO</Trans>
    if (session.planType === PlanType.PRO) return <Trans>PRO + AI</Trans>
    if (session.planType === PlanType.BELIEVER) return <Trans>Believer</Trans>
    return <Trans>Free</Trans>
  }, [session])

  const { copy } = useCopyToClipboard()
  return (
    <div className="no-drag flex flex-col gap-2">
      <div className="text-foreground flex items-center gap-2">
        <Avatar className="size-10 rounded-lg">
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
          <div className="text-base font-bold">{session?.name}</div>
          <div className="text-foreground/60 text-sm">{session?.email}</div>
        </div>
      </div>
      <div className="flex gap-2 text-lg">
        <Badge
          className="bg-foreground/8 hover:bg-foreground/8 flex items-center gap-1 px-3"
          variant="secondary"
          onClick={() => {
            appEmitter.emit('IMPACT')
            copy(session.pid)
            toast.success(t`Copied to clipboard`)
          }}
        >
          ID: <span className="text-sm font-bold">{session.pid}</span>{' '}
          <CopyIcon size={16} />
        </Badge>
        <Badge
          variant="secondary"
          className="bg-foreground/8 hover:bg-foreground/8"
        >
          {planType}
        </Badge>
      </div>
    </div>
  )
}
