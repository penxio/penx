import { useRef } from 'react'
import { SearchButton } from '@/components/MobileSearch/SearchButton'
import { IonButtons, IonHeader, IonMenuToggle, IonToolbar } from '@ionic/react'
import { UserIcon } from 'lucide-react'
import { appEmitter } from '@penx/emitter'
import { useArea } from '@penx/hooks/useArea'
import { useSession } from '@penx/session'
import { Avatar, AvatarFallback, AvatarImage } from '@penx/uikit/avatar'
import { cn, getUrl } from '@penx/utils'
import { generateGradient } from '@penx/utils/generateGradient'
import { BraceButton } from './BraceButton'

interface Props {
  //
}

export const HomeHeader = ({}: Props) => {
  const { area } = useArea()
  const { session } = useSession()
  const menu = useRef<HTMLIonMenuElement>(null)
  return (
    <div className="flex items-center justify-between">
      {area && (
        <div className="flex items-center gap-1">
          <IonButtons slot="start">
            <IonMenuToggle className="flex items-center">
              <span className="icon-[heroicons-outline--menu-alt-2] size-6"></span>
            </IonMenuToggle>
          </IonButtons>

          {/* <Avatar className="size-6 rounded-md">
            <AvatarImage src={area.logo} alt="" />
            <AvatarFallback
              className={cn(
                'rounded-md text-xs text-white',
                generateGradient(area.name),
              )}
            >
              {area.name.slice(0, 1)}
            </AvatarFallback>
          </Avatar> */}

          <div className="grid flex-1 text-left text-lg">
            <span className="truncate font-semibold">{area?.name}</span>
          </div>
        </div>
      )}

      <div className="flex items-center gap-2">
        <BraceButton />
        <SearchButton />
        {!session && (
          <Avatar
            className="h-8 w-8 rounded-full"
            onClick={() => {
              appEmitter.emit('ROUTE_TO_PROFILE')
              menu.current?.close()
            }}
          >
            <AvatarFallback className=" bg-foreground/10 text-foreground rounded-lg">
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
      </div>
    </div>
  )
}
