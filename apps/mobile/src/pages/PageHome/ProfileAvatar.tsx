import { useRef } from 'react'
import { UserIcon } from 'lucide-react'
import { appEmitter } from '@penx/emitter'
import { useArea } from '@penx/hooks/useArea'
import { useSession } from '@penx/session'
import { Avatar, AvatarFallback, AvatarImage } from '@penx/uikit/avatar'
import { cn, getUrl } from '@penx/utils'
import { generateGradient } from '@penx/utils/generateGradient'

interface Props {
  //
}

export const ProfileAvatar = ({}: Props) => {
  const { session } = useSession()
  const menu = useRef<HTMLIonMenuElement>(null)
  return (
    <>
      {!session && (
        <Avatar
          className="h-8 w-8 rounded-full"
          onClick={() => {
            appEmitter.emit('ROUTE_TO_PROFILE')
            menu.current?.close()
          }}
        >
          <AvatarFallback className="text-foreground rounded-lg bg-transparent">
            <UserIcon size={20} />
          </AvatarFallback>
        </Avatar>
      )}
      {session && (
        <Avatar
          className="h-8 w-8 rounded-full"
          onClick={() => {
            appEmitter.emit('ROUTE_TO_PROFILE')
            menu.current?.close()
          }}
        >
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
      )}
    </>
  )
}
