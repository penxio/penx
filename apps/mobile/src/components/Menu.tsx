import { useEffect, useRef } from 'react'
import { impact } from '@/lib/impact'
import { isAndroid } from '@/lib/utils'
import { PageSync } from '@/pages/PageSync/PageSync'
import {
  IonContent,
  IonFooter,
  IonHeader,
  IonMenu,
  IonNavLink,
  IonToolbar,
} from '@ionic/react'
import { Trans } from '@lingui/react/macro'
import { RefreshCwIcon, UserIcon } from 'lucide-react'
import { AddWidgetButton } from '@penx/components/area-widgets/AddWidgetButton'
import { MobileWidgetList } from '@penx/components/area-widgets/MobileWidgetList'
import { AreasPopover } from '@penx/components/AreasPopover'
import { appEmitter } from '@penx/emitter'
import { useArea } from '@penx/hooks/useArea'
import { useMobileMenu } from '@penx/hooks/useMobileMenu'
import { useSession } from '@penx/session'
import { Avatar, AvatarFallback, AvatarImage } from '@penx/uikit/avatar'
import { Button } from '@penx/uikit/ui/button'
import { cn, getUrl } from '@penx/utils'
import { generateGradient } from '@penx/utils/generateGradient'
import { AreasMenu } from './AreasMenu/AreasMenu'
import { EditWidgetButton } from './EditWidget/EditWidgetButton'
import { useTheme } from './theme-provider'

const Menu: React.FC = () => {
  const { setMenu } = useMobileMenu()
  const { isLoading } = useSession()
  const menu = useRef<HTMLIonMenuElement>(null)
  const { session } = useSession()
  const { isDark } = useTheme()
  const { area } = useArea()

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
      className="bg-foreground/5 z-[1000] pt-10"
    >
      <IonHeader
        className={cn(isAndroid && 'safe-area pt-20')}
        style={{ boxShadow: '0 0 0 rgba(0, 0, 0, 0.2)' }}
      >
        <IonToolbar
          className="menu-toolbar text-foreground px-3"
          style={{
            '--border-width': 0,
          }}
        >
          <AreasMenu />
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
          <div className="relative z-10 flex flex-1 flex-col gap-2">
            <MobileWidgetList></MobileWidgetList>

            <div className="flex items-center justify-start gap-2">
              <EditWidgetButton />
            </div>
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
      <IonFooter
        style={{
          boxShadow: '0 0 0 rgba(0, 0, 0, 0.2)',
        }}
      >
        <div className="flex items-center justify-between gap-2 px-2 pb-4">
          <Button
            variant="ghost"
            className="text-foreground w-full justify-start gap-2 pl-2"
            onClick={async () => {
              impact()
              if (!session) {
                appEmitter.emit('ROUTE_TO_LOGIN')
                menu.current?.close()
                return
              }
              appEmitter.emit('ROUTE_TO_SYNC')
              menu.current?.close()
            }}
          >
            <RefreshCwIcon size={18} />
            <Trans>Sync now</Trans>
          </Button>
        </div>
      </IonFooter>
    </IonMenu>
  )
}

export default Menu
