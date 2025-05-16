import { Capacitor } from '@capacitor/core'
import { IonContent, IonMenu } from '@ionic/react'
import { useSession } from '@penx/session'
import { cn } from '@penx/utils'
import { AreaList } from './AreaList'
import { MobileModeToggle } from './MobileModeToggle'

const platform = Capacitor.getPlatform()

const Menu: React.FC = () => {
  const { isLoading } = useSession()

  if (isLoading) return null

  return (
    <IonMenu contentId="main" type="overlay">
      <IonContent className="ion-padding safe-area drawer-menu h-full">
        <div
          className={cn(
            'flex h-full flex-col pt-5',
            platform === 'ios' && 'pt-10',
          )}
        >
          <div className="flex-1">
            <AreaList />
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
