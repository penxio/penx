import { useEffect, useRef } from 'react'
import { Capacitor } from '@capacitor/core'
import { IonContent, IonMenu } from '@ionic/react'
import { AreaWidgets } from '@penx/components/area-widgets/AreaWidgets'
import { useMobileMenu } from '@penx/hooks/useMobileMenu'
import { useSession } from '@penx/session'
import { store } from '@penx/store'
import { cn } from '@penx/utils'
import { AreaList } from './AreaList'
import { MobileModeToggle } from './MobileModeToggle'

const platform = Capacitor.getPlatform()

const Menu: React.FC = () => {
  const { setMenu } = useMobileMenu()
  const { isLoading } = useSession()
  const menu = useRef<HTMLIonMenuElement>(null)

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
    >
      <IonContent className="ion-padding safe-area drawer-menu h-full">
        <div
          className={cn(
            'flex h-full flex-col pt-5',
            platform === 'ios' && 'pt-10',
          )}
        >
          <div className="flex-1">
            <AreaList />
            <AreaWidgets />
          </div>
          <div className="flex items-center justify-between">
            <MobileModeToggle />
          </div>
        </div>
      </IonContent>
    </IonMenu>
  )
}

export default Menu
