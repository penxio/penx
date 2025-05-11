import { IonContent, IonMenu } from '@ionic/react'
import { ProfileButton } from '@penx/components/ProfileButton'
import { useSession } from '@penx/session'
import { AreaList } from './AreaList'
import { LoginButton } from './Login/LoginButton'
import { MobileModeToggle } from './MobileModeToggle'

const Menu: React.FC = () => {
  const { isLoading } = useSession()

  if (isLoading) return null

  return (
    <IonMenu contentId="main" type="overlay">
      <IonContent className="ion-padding safe-area h-full">
        <div className="flex h-full flex-col">
          <div className="flex-1">
            <AreaList />
          </div>
          <div className="flex items-center justify-between">
            <MobileModeToggle />
            <ProfileButton loginButton={<LoginButton></LoginButton>} />
          </div>
        </div>
      </IonContent>
    </IonMenu>
  )
}

export default Menu
