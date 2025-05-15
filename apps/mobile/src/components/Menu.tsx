import { Capacitor } from '@capacitor/core';
import { IonContent, IonMenu } from '@ionic/react';
import { ProfileButton } from '@penx/components/ProfileButton';
import { useSession } from '@penx/session';
import { cn } from '@penx/utils';
import { AreaList } from './AreaList';
import { LoginButton } from './Login/LoginButton';
import { MobileModeToggle } from './MobileModeToggle';


const platform = Capacitor.getPlatform()

const Menu: React.FC = () => {
  const { isLoading } = useSession()

  if (isLoading) return null

  return (
    <IonMenu contentId="main" type="overlay">
      <IonContent className="ion-padding safe-area h-full drawer-menu">
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
            <ProfileButton loginButton={<LoginButton></LoginButton>} />
          </div>
        </div>
      </IonContent>
    </IonMenu>
  )
}

export default Menu