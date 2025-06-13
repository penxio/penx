import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { menuController } from '@ionic/core'
import {
  IonButton,
  IonContent,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonMenu,
  IonMenuToggle,
  IonNote,
  IonToggle,
} from '@ionic/react'
import { Trans } from '@lingui/react/macro'
import { DialogTitle } from '@radix-ui/react-dialog'
import {
  ChevronDown,
  ChevronsUpDown,
  HomeIcon,
  PlusIcon,
  UserIcon,
} from 'lucide-react'
import { useAreaDialog } from '@penx/components/useAreaDialog'
import { useArea } from '@penx/hooks/useArea'
import { useAreas } from '@penx/hooks/useAreas'
import { useSession } from '@penx/session'
import { store } from '@penx/store'
import { Avatar, AvatarFallback, AvatarImage } from '@penx/uikit/avatar'
import { Button } from '@penx/uikit/button'
import { MenuItem } from '@penx/uikit/menu'
import { cn, getUrl } from '@penx/utils'
import { generateGradient } from '@penx/utils/generateGradient'

interface AppPage {
  url: string
  iosIcon: string
  mdIcon: string
  title: string
}

export const AreaList: React.FC = () => {
  const { session, isLoading } = useSession()
  const location = useLocation()
  const { areas = [] } = useAreas()
  const [visible, setVisible] = useState(false)
  const { setIsOpen } = useAreaDialog()

  return (
    <div className="">
      <div className="flex items-center justify-between">
        <div className="mb-2 mt-2 px-3 text-xl font-bold">My areas</div>
        <IonMenuToggle>
          <MenuItem
            className="flex cursor-pointer items-center gap-2"
            onClick={async () => {
              setIsOpen(true)
              // menuController.close()
              menuController.close('main')
            }}
          >
            <PlusIcon size={24} />
          </MenuItem>
        </IonMenuToggle>
      </div>

      <div className="flex flex-col gap-1">
        {areas.map((item) => (
          <IonMenuToggle key={item.id}>
            <MenuItem
              className="flex cursor-pointer items-center gap-2 py-2"
              onClick={async () => {
                store.area.set(item.raw)
                store.creations.refetchCreations(item.id)
                store.visit.setAndSave({ activeAreaId: item.id })
                // store.panels.resetPanels()
                setVisible(false)
              }}
            >
              <Avatar className="h-6 w-6 rounded-lg">
                <AvatarImage src={getUrl(item.logo!)} alt="" />
                <AvatarFallback
                  className={cn(
                    'rounded-lg text-white',
                    generateGradient(item.name),
                  )}
                >
                  {item.name.slice(0, 1)}
                </AvatarFallback>
              </Avatar>
              <div className="text-lg">{item.name}</div>
            </MenuItem>
          </IonMenuToggle>
        ))}
      </div>
    </div>
  )
}
