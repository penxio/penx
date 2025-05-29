import { useEffect, useRef } from 'react'
import { Capacitor } from '@capacitor/core'
import { IonContent, IonMenu } from '@ionic/react'
import { AreaWidgets } from '@penx/components/area-widgets/AreaWidgets'
import { AreasPopover } from '@penx/components/AreasPopover/AreasPopover'
import { LangSwitcher } from '@penx/components/LangSwitcher'
import { ProfileButton } from '@penx/components/ProfileButton'
import { appEmitter } from '@penx/emitter'
import { useMobileMenu } from '@penx/hooks/useMobileMenu'
import { useSession } from '@penx/session'
import { store } from '@penx/store'
import { Avatar, AvatarFallback, AvatarImage } from '@penx/uikit/avatar'
import { Button } from '@penx/uikit/ui/button'
import { cn, getUrl } from '@penx/utils'
import { generateGradient } from '@penx/utils/generateGradient'
import { AreaList } from './AreaList'
// import { AreasPopover } from './AreasPopover'
import { MobileModeToggle } from './MobileModeToggle'
import { useUpgradeDrawer } from './UpgradeDrawer/useUpgradeDrawer'

const platform = Capacitor.getPlatform()

const Menu: React.FC = () => {
  const { setMenu } = useMobileMenu()
  const { isLoading } = useSession()
  const menu = useRef<HTMLIonMenuElement>(null)
  const { setIsOpen } = useUpgradeDrawer()
  const { session } = useSession()

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
      // className="bg-foreground/5"
    >
      <IonContent
        className="ion-padding safe-area drawer-menu relative h-full"
        style={{
          '--background': '#f0f0f0',
        }}
      >
        <div
          className={cn(
            'relative z-10 flex h-full flex-col pt-5',
            platform === 'ios' && 'pt-10',
          )}
          style={
            {
              '--background': '#fff',
            } as any
          }
        >
          <div className="relative z-10 flex-1">
            {/* <AreaList /> */}
            <AreasPopover />
            <AreaWidgets />
          </div>
          <div className="relative z-10 flex items-center justify-between">
            <MobileModeToggle />
            <LangSwitcher />
            {/* <Button
              onClick={() => {
                setIsOpen(true)
              }}
            >
              Upgrade
            </Button> */}
            {!session && (
              <Button
                size="sm"
                onClick={() => {
                  appEmitter.emit('ROUTE_TO_LOGIN')
                  menu.current?.close()
                }}
              >
                Log in
              </Button>
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
          <div
            className="absolute bottom-0 left-0 right-0 top-0 z-[1] opacity-10 dark:opacity-0"
            style={{
              filter: 'blur(150px) saturate(150%)',
              transform: 'translateZ(0)',
              backgroundImage:
                'radial-gradient(at 27% 37%, #3a8bfd 0, transparent 50%), radial-gradient(at 97% 21%, #9772fe 0, transparent 50%), radial-gradient(at 52% 99%, #fd3a4e 0, transparent 50%), radial-gradient(at 10% 29%, #5afc7d 0, transparent 50%), radial-gradient(at 97% 96%, #e4c795 0, transparent 50%), radial-gradient(at 33% 50%, #8ca8e8 0, transparent 50%), radial-gradient(at 79% 53%, #eea5ba 0, transparent 50%)',
            }}
          ></div>
        </div>
      </IonContent>
    </IonMenu>
  )
}

export default Menu
