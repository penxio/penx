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

interface Props {
  //
}

export const BraceButton = ({}: Props) => {
  return (
    <span
      className="icon-[tabler--braces] size-6"
      onClick={() => {
        appEmitter.emit('ROUTE_TO_ALL_STRUCTS')
      }}
    ></span>
  )
}
