import { UserIcon } from 'lucide-react'
import { appEmitter } from '@penx/emitter'
import { useSession } from '@penx/session'
import { Avatar, AvatarFallback, AvatarImage } from '@penx/uikit/avatar'
import { cn, getUrl } from '@penx/utils'
import { generateGradient } from '@penx/utils/generateGradient'

interface Props {
  //
}

export const ProfileButton = ({}: Props) => {
  const { session } = useSession()
  return (
    <>
      {!session && (
        <Avatar
          className="size-7 rounded-full"
          onClick={() => {
            appEmitter.emit('ROUTE_TO_PROFILE')
          }}
        >
          <AvatarFallback className=" bg-foreground/10 text-foreground rounded-lg">
            <UserIcon size={20} />
          </AvatarFallback>
        </Avatar>
      )}
      {session && (
        <Avatar
          className="size-7 rounded-full"
          onClick={() => {
            appEmitter.emit('ROUTE_TO_PROFILE')
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
