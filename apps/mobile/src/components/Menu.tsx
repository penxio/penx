import { useEffect, useRef } from 'react'
import { isAndroid } from '@/lib/utils'
import { Capacitor } from '@capacitor/core'
import {
  IonButton,
  IonButtons,
  IonContent,
  IonFooter,
  IonHeader,
  IonMenu,
  IonTitle,
  IonToolbar,
} from '@ionic/react'
import { Trans } from '@lingui/react/macro'
import { UserIcon } from 'lucide-react'
import { AreaWidgets } from '@penx/components/area-widgets/AreaWidgets'
import { AreasPopover } from '@penx/components/AreasPopover'
import { LangSwitcher } from '@penx/components/LangSwitcher'
import { appEmitter } from '@penx/emitter'
import { useMobileMenu } from '@penx/hooks/useMobileMenu'
import { localDB } from '@penx/local-db'
import { useSession } from '@penx/session'
import { Avatar, AvatarFallback, AvatarImage } from '@penx/uikit/avatar'
import { Button } from '@penx/uikit/ui/button'
import { cn, getUrl } from '@penx/utils'
import { generateGradient } from '@penx/utils/generateGradient'
import { syncNodesToServer } from '@penx/worker/lib/syncNodesToServer'
import { AreaList } from './AreaList'
import { MobileModeToggle } from './MobileModeToggle'
import { useTheme } from './theme-provider'

const Menu: React.FC = () => {
  const { setMenu } = useMobileMenu()
  const { isLoading } = useSession()
  const menu = useRef<HTMLIonMenuElement>(null)
  const { session } = useSession()
  const { isDark } = useTheme()

  useEffect(() => {
    setMenu(menu)
  }, [menu])

  return (
    <IonMenu
      ref={menu}
      id="menu"
      menuId="myMenu"
      contentId="main"
      type="overlay"
      // type="push"
      className="bg-foreground/5 z-[1000]"
    >
      <IonHeader
        className={cn(isAndroid && 'safe-area')}
        style={{ boxShadow: '0 0 0 rgba(0, 0, 0, 0.2)' }}
      >
        <IonToolbar
          className="menu-toolbar text-foreground px-3"
          style={{
            '--border-width': 0,
          }}
        >
          <div className=" flex items-center justify-between gap-2">
            <AreasPopover />
            {!session && (
              <Avatar
                className="h-8 w-8 rounded-lg"
                onClick={() => {
                  appEmitter.emit('ROUTE_TO_PROFILE')
                  menu.current?.close()
                }}
              >
                <AvatarFallback className=" bg-foreground/10 rounded-lg">
                  <UserIcon size={20} />
                </AvatarFallback>
              </Avatar>
            )}
            {session && (
              <Avatar
                className="h-8 w-8 rounded-lg"
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
        </IonToolbar>
      </IonHeader>

      <IonContent
        className="ion-padding safe-area drawer-menu relative h-full"
        style={{
          '--background': isDark ? '#333' : '#fff',
        }}
      >
        <div
          className={cn('text-foreground relative z-10 flex h-full flex-col')}
          style={
            {
              '--background': '#fff',
            } as any
          }
        >
          <div className="relative z-10 flex-1">
            <AreaWidgets />
          </div>
          <div className="relative z-10 flex items-center justify-between">
            {/* <Button
              onClick={() => {
                setIsOpen(true)
              }}
            >
              Upgrade
            </Button> */}
          </div>
        </div>
      </IonContent>
      <IonFooter>
        <div className="p-2">
          <Button
            variant="secondary"
            className="w-full"
            onClick={async () => {
              const changes = await localDB.change.toArray()
              console.log('>>>>>>>>>>>>>>sync nodes to server', changes)
              syncNodesToServer()
            }}
          >
            <Trans>Sync now</Trans>
          </Button>
        </div>
      </IonFooter>
    </IonMenu>
  )
}

export default Menu
